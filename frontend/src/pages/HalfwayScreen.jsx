import { useNavigate, Navigate } from 'react-router-dom'
import confetti from '../assets/confetti.svg'
import rewardMedal from '../assets/reward-medal.svg'
import { HALFWAY_STEP, TOTAL_QUESTIONS } from '../data/questions.js'
import './HalfwayScreen.css'

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.75 9H14.25"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3.75 14.25 9 9 14.25"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function HalfwayScreen() {
  const navigate = useNavigate()

  // Reaching this screen out of context (e.g. a direct URL / refresh with no
  // survey in progress) has nothing to celebrate — send them to the start.
  if (!sessionStorage.getItem('momo_submission_id')) {
    return <Navigate to="/" replace />
  }

  const handleContinue = () => {
    navigate(`/question/${HALFWAY_STEP + 1}`)
  }

  const progressPct = (HALFWAY_STEP / TOTAL_QUESTIONS) * 100

  return (
    <main className="halfway">
      <img className="halfway__confetti" src={confetti} alt="" aria-hidden="true" />
      <div className="halfway__glow" aria-hidden="true" />

      <div className="halfway__inner">
        <div className="halfway__center">
          <div className="halfway__medal">
            <img
              className="halfway__medal-icon"
              src={rewardMedal}
              alt=""
              aria-hidden="true"
            />
          </div>

          <div className="halfway__copy">
            <h1 className="halfway__title">
              Halfway there!
              <br />
              A surprise awaits.
            </h1>
            <p className="halfway__subtitle">
              Awesome! You're halfway through your journey, and a surprise is
              waiting for you.
            </p>

            <div className="halfway__progress">
              <div className="halfway__progress-track">
                <div
                  className="halfway__progress-fill"
                  style={{ width: `${progressPct}%` }}
                >
                  <span className="halfway__progress-knob" />
                </div>
              </div>
              <span className="halfway__progress-label">
                {HALFWAY_STEP}/{TOTAL_QUESTIONS}
              </span>
            </div>
          </div>
        </div>

        <button type="button" className="halfway__cta" onClick={handleContinue}>
          <span>Continue The Journey</span>
          <ArrowRight />
        </button>
      </div>
    </main>
  )
}
