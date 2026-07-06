import { useMemo } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import confetti from '../assets/confetti.svg'
import rewardMedal from '../assets/reward-medal.svg'
import { HALFWAY_STEP, TOTAL_QUESTIONS } from '../data/questions.js'
import './HalfwayScreen.css'

// Confetti-piece colours drawn from the MoMo palette (yellow / white / blues).
const CONFETTI_COLORS = ['#FFCB05', '#FFFFFF', '#FFE7A0', '#4D849C', '#B0C8D3']

// Randomised falling confetti pieces layered over the static spray for motion.
function useConfettiPieces(count) {
  return useMemo(
    () =>
      Array.from({ length: count }, () => {
        const dur = 2.6 + Math.random() * 2
        return {
          left: Math.random() * 100,
          w: 4 + Math.random() * 4,
          h: 7 + Math.random() * 7,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          dur,
          delay: -Math.random() * dur, // negative → the sky is already full at load
          dist: 300 + Math.random() * 200,
          dx: (Math.random() - 0.5) * 70,
          r0: Math.random() * 360,
          r1: Math.random() * 720 - 360,
          round: Math.random() > 0.82,
        }
      }),
    [count],
  )
}

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
  const confettiPieces = useConfettiPieces(28)

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

      <div className="halfway__confetti-fall" aria-hidden="true">
        {confettiPieces.map((p, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              background: p.color,
              borderRadius: p.round ? '50%' : '1px',
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              '--dist': `${p.dist}px`,
              '--dx': `${p.dx}px`,
              '--r0': `${p.r0}deg`,
              '--r1': `${p.r1}deg`,
            }}
          />
        ))}
      </div>

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
