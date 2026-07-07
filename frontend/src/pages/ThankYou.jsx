import { useNavigate } from 'react-router-dom'
import momoLogo from '../assets/momo-logo.png'
import confetti from '../assets/thankyou-confetti.svg'
import FallingConfetti from '../components/FallingConfetti.jsx'
import './ThankYou.css'

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

export default function ThankYou() {
  const navigate = useNavigate()

  const handleRestart = () => {
    navigate('/')
  }

  const handleDecline = () => {
    // Exit flow (to be defined later).
    console.log('Not interested')
  }

  return (
    <main className="thankyou">
      <img className="thankyou__confetti" src={confetti} alt="" aria-hidden="true" />
      <FallingConfetti />
      <div className="thankyou__glow" aria-hidden="true" />

      <div className="thankyou__inner">
        <div className="thankyou__center">
          <img className="thankyou__logo" src={momoLogo} alt="MoMo, from MTN" />

          <div className="thankyou__copy">
            <h1 className="thankyou__title">
              Thank You for Sharing Your MoMo Experience!
            </h1>
            <p className="thankyou__subtitle">
              Thanks for sharing why you prefer USSD or the MoMo App! We
              appreciate your feedback and wish you luck winning MoMo gifts!
            </p>
          </div>
        </div>

        <div className="thankyou__actions">
          <button type="button" className="thankyou__cta" onClick={handleRestart}>
            <span>Take The Survey Again</span>
            <ArrowRight />
          </button>
          <button
            type="button"
            className="thankyou__decline"
            onClick={handleDecline}
          >
            Not Interested
          </button>
        </div>
      </div>
    </main>
  )
}
