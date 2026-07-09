import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import momoLogo from '../assets/momo-logo.png'
import questionEmblem from '../assets/question-emblem.png'
import { preloadSurveyImages } from '../lib/preloadAssets.js'
import './StartScreen.css'

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

export default function StartScreen() {
  const navigate = useNavigate()

  // Warm every downstream image while the user is on the landing page so the
  // rest of the flow renders instantly with no first-paint lag.
  useEffect(() => {
    preloadSurveyImages()
  }, [])

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

        <img
          className="start__emblem"
          src={questionEmblem}
          alt=""
          aria-hidden="true"
        />

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
