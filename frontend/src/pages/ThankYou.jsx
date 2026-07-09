import momoLogo from '../assets/momo-logo.png'
import confetti from '../assets/thankyou-confetti.svg'
import FallingConfetti from '../components/FallingConfetti.jsx'
import './ThankYou.css'

export default function ThankYou() {
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
              Boom!
              <br />
              You actually did it!
            </h1>
            <p className="thankyou__subtitle">
              Your effort just paid off in a big way; you&rsquo;ve officially
              won! You will be rewarded shortly.
            </p>
          </div>
        </div>

        <div className="thankyou__actions">
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
