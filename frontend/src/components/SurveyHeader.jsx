import momoLogo from '../assets/momo-logo.png'
import './SurveyHeader.css'

/**
 * Shared top of every survey screen: the dark curved header (large ellipse)
 * with the MoMo logo on the left and an optional "Skip" link on the right.
 */
export default function SurveyHeader({ onSkip }) {
  return (
    <>
      <div className="survey-header" aria-hidden="true" />
      <header className="survey-topbar">
        <img className="survey-logo" src={momoLogo} alt="MoMo, from MTN" />
        {onSkip && (
          <button type="button" className="survey-skip" onClick={onSkip}>
            Skip
          </button>
        )}
      </header>
    </>
  )
}
