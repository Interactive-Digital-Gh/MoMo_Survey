import momoLogo from '../assets/momo-logo.png'
import './SurveyHeader.css'

/**
 * Shared top of every survey screen: the dark curved header (large ellipse)
 * with the MoMo app-icon centered on it (icon cropped from the stacked logo).
 */
export default function SurveyHeader() {
  return (
    <>
      <div className="survey-header" aria-hidden="true" />
      <header className="survey-topbar">
        <div className="survey-logo">
          <img src={momoLogo} alt="MoMo" />
        </div>
      </header>
    </>
  )
}
