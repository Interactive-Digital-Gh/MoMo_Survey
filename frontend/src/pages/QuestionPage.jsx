import { useState, useEffect, useRef, forwardRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import SurveyHeader from '../components/SurveyHeader.jsx'
import momoMark from '../assets/momo-mark-yellow.png'
import { submitSurvey } from '../lib/api.js'
import { questions, TOTAL_QUESTIONS, HALFWAY_STEP } from '../data/questions.js'
import './QuestionPage.css'

// Card slides away in the travel direction and the next one slides in behind it.
// dir = 1 → advancing (card flies off left), dir = -1 → going back (off right).
const cardVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? 540 : -540,
    scale: 0.94,
  }),
  center: { x: 0, scale: 1 },
  exit: (dir) => ({
    x: dir >= 0 ? -540 : 540,
    scale: 0.92,
  }),
}

const cardTransition = { type: 'tween', ease: [0.22, 0.61, 0.36, 1], duration: 0.34 }

const QuestionCard = forwardRef(({
  question,
  stepNum,
  selected,
  handleSelect,
  direction,
  goNext,
  goBack,
  ...framerProps
}, ref) => {
  const x = useMotionValue(0)
  
  // Transform x position into rotation and opacity for dynamic visual response (drag right only, but supports transition ranges)
  const rotate = useTransform(x, [-540, 0, 540], [-15, 0, 15])
  const opacity = useTransform(x, [-540, -150, 0, 150, 540], [0.3, 0.8, 1, 0.8, 0.3], { clamp: true })

  const handleDragEnd = (event, info) => {
    const threshold = 120
    const velocityThreshold = 500
    const { offset, velocity } = info

    // Only allow navigating back (dragging right)
    if (offset.x > threshold || velocity.x > velocityThreshold) {
      goBack()
    }
  }

  return (
    <motion.section
      ref={ref}
      {...framerProps}
      className="qcard"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.9 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      whileDrag={{ scale: 1.02 }}
    >
      <div className="qcard__head">
        {question.eyebrow && (
          <p className="qcard__eyebrow">{question.eyebrow}</p>
        )}
        <h1
          className={`qcard__question${
            question.eyebrow ? ' qcard__question--fact' : ''
          }`}
        >
          {question.question}
        </h1>
      </div>

      <div
        className="qcard__options"
        role="radiogroup"
        aria-label={question.question}
      >
        {question.options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={selected === opt.key}
            className={`option${
              selected === opt.key ? ' option--selected' : ''
            }`}
            onClick={() => handleSelect(opt.key)}
          >
            <span className="option__badge">
              {selected === opt.key ? (
                <img
                  className="option__badge-mark"
                  src={momoMark}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                opt.key
              )}
            </span>
            <span className="option__label">{opt.label}</span>
          </button>
        ))}
      </div>

      <p className="qcard__hint">Select An Option</p>
    </motion.section>
  )
})

export default function QuestionPage() {
  const { step } = useParams()
  const navigate = useNavigate()
  const stepNum = Number(step)
  const question = questions[stepNum - 1]

  const [selected, setSelected] = useState(null)
  // Travel direction for the card animation; kept in a ref so it's current for
  // the render triggered by navigation without adding an extra render.
  const direction = useRef(1)

  // The component stays mounted across /question/:step changes — restore any
  // previously saved answer from sessionStorage so going back shows the choice.
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('momo_current_answers') || '{}')
    setSelected(saved[stepNum] || null)
  }, [stepNum])

  // Invalid / out-of-range step → back to the first question.
  if (!question) {
    return <Navigate to="/question/1" replace />
  }

  const saveSurveyEntry = async () => {
    const submissionId =
      sessionStorage.getItem('momo_submission_id') || crypto.randomUUID()
    const phone = sessionStorage.getItem('momo_current_phone') || 'Anonymous'
    const answers = JSON.parse(
      sessionStorage.getItem('momo_current_answers') || '{}',
    )

    const entry = { submission_id: submissionId, phone, answers }

    try {
      await submitSurvey(entry)
    } catch {
      // Network/server hiccup — keep it locally so no response is lost; it can
      // be retried/exported later rather than disappearing.
      const pending = JSON.parse(
        localStorage.getItem('momo_pending_entries') || '[]',
      )
      pending.push({ ...entry, savedAt: new Date().toISOString() })
      localStorage.setItem('momo_pending_entries', JSON.stringify(pending))
    } finally {
      sessionStorage.removeItem('momo_submission_id')
      sessionStorage.removeItem('momo_current_phone')
      sessionStorage.removeItem('momo_current_answers')
    }
  }

  const goNext = () => {
    direction.current = 1
    if (stepNum === HALFWAY_STEP) {
      // Celebration interstitial midway through, then on to the next question.
      navigate('/halfway')
    } else if (questions[stepNum]) {
      navigate(`/question/${stepNum + 1}`)
    } else {
      // Last question answered — compile entry and go to thank you screen
      saveSurveyEntry()
      navigate('/thank-you')
    }
  }

  const handleSelect = (key) => {
    setSelected(key)
    
    // Save current response to sessionStorage
    const currentAnswers = JSON.parse(sessionStorage.getItem('momo_current_answers') || '{}')
    currentAnswers[stepNum] = key
    sessionStorage.setItem('momo_current_answers', JSON.stringify(currentAnswers))

    // Brief highlight, then advance to the next screen.
    setTimeout(goNext, 200)
  }

  const goBack = () => {
    direction.current = -1
    // Swipe right → previous question, or back to the phone screen from Q1.
    if (stepNum > 1) {
      navigate(`/question/${stepNum - 1}`)
    } else {
      navigate('/phone')
    }
  }

  const progressPct = Math.min(100, (stepNum / TOTAL_QUESTIONS) * 100)

  return (
    <main className="survey-page">
      <div className="survey-page__inner">
        <SurveyHeader />

        <div className="question__body">
          {/* Progress */}
          <div className="progress">
            <div className="progress__labels">
              <span className="progress__entry">Entry #{stepNum}</span>
              <span className="progress__total">{TOTAL_QUESTIONS} Total</span>
            </div>
            <div className="progress__track">
              <div
                className="progress__fill"
                style={{ width: `${progressPct}%` }}
              >
                <span className="progress__marker" />
              </div>
            </div>
          </div>

          {/* Question card (animated between steps) */}
          <div className="qcard-stage">
            <AnimatePresence mode="popLayout" custom={direction.current} initial={false}>
              <QuestionCard
                key={stepNum}
                question={question}
                stepNum={stepNum}
                selected={selected}
                handleSelect={handleSelect}
                direction={direction.current}
                goNext={goNext}
                goBack={goBack}
                custom={direction.current}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={cardTransition}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}
