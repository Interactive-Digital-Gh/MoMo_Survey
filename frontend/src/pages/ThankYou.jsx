import momoLogo from '../assets/momo-logo.png'
import confetti from '../assets/thankyou-confetti.svg'
import FallingConfetti from '../components/FallingConfetti.jsx'
import './ThankYou.css'

export default function ThankYou() {
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
      </div>
    </main>
  )
}
