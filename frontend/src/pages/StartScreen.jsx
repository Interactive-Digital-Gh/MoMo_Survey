import { useNavigate } from 'react-router-dom'
import momoLogo from '../assets/momo-logo.png'
import './StartScreen.css'

function QuestionIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.5 7.5a2.5 2.5 0 1 1 3.4 2.33c-.72.27-1.4.86-1.4 1.67v.5"
        stroke="var(--momo-yellow-dark)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="15" r="0.6" fill="var(--momo-yellow-dark)" stroke="var(--momo-yellow-dark)" strokeWidth="0.6" />
    </svg>
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

/* Small overlapping "avatar" dots that sit at the bottom of a card */
function AvatarDots({ color }) {
  return (
    <div className="card__avatars">
      <span className="card__dot" style={{ background: color }} />
      <span className="card__dot" style={{ background: color }} />
    </div>
  )
}

export default function StartScreen() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/phone')
  }

  const handleDecline = () => {
    // "Not Interested" — exit flow (to be defined later).
    console.log('Not interested')
  }

  return (
    <main className="start">
      <div className="start__glow" aria-hidden="true" />

      <div className="start__content">
        <img className="start__logo" src={momoLogo} alt="MoMo, from MTN" />

        {/* ── Stacked "Did you know" cards ── */}
        <div className="start__cards" aria-hidden="true">
          <div className="card card--back">
            <span className="card__badge card__badge--faint">
              <QuestionIcon />
            </span>
            <span className="card__label" style={{ color: '#6b8f82' }}>
              mindful
            </span>
            <AvatarDots color="#c9f0e3" />
          </div>

          <div className="card card--mid">
            <span className="card__badge card__badge--faint">
              <QuestionIcon />
            </span>
          </div>

          <div className="card card--front">
            <span className="card__badge">
              <QuestionIcon />
            </span>
            <p className="card__title">Did you know</p>
            <span className="card__label">Yes or no</span>
            <AvatarDots color="#d9e5ea" />
          </div>
        </div>

        {/* ── Headline + subtext ── */}
        <div className="start__copy">
          <h1 className="start__title">Share Your MoMo Experience &amp; Win!</h1>
          <p className="start__subtitle">
            Share your thoughts in our quick survey and enter to win cool MoMo
            prizes!
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="start__actions">
          <button type="button" className="start__cta" onClick={handleStart}>
            <span>Lets Get Started</span>
            <ArrowRight />
          </button>
          <button type="button" className="start__decline" onClick={handleDecline}>
            Not Interested
          </button>
        </div>
      </div>
    </main>
  )
}
