import momoLogo from '../assets/momo-logo.png'
import './SurveyHeader.css'

/**
 * Shared top of every survey screen: the dark curved header (large ellipse)
 * with the MoMo logo on the left.
 */
export default function SurveyHeader() {
  return (
    <>
      <div className="survey-header" aria-hidden="true" />
      <header className="survey-topbar">
        <img className="survey-logo" src={momoLogo} alt="MoMo, from MTN" />
      </header>
    </>
  )
}
