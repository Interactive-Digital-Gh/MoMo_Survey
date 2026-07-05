import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SurveyHeader from '../components/SurveyHeader.jsx'
import './PhoneNumber.css'

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

export default function PhoneNumber() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')

  // Start a fresh survey attempt: record the phone, mint a submission id (used
  // for idempotent submission), and clear any answers from a previous run.
  const startSurvey = (phoneValue) => {
    sessionStorage.setItem('momo_current_phone', phoneValue)
    sessionStorage.setItem('momo_submission_id', crypto.randomUUID())
    sessionStorage.removeItem('momo_current_answers')
    navigate('/question/1')
  }

  const handleProceed = () => startSurvey(phone || 'Anonymous')

  const handleSkip = () => startSurvey('Anonymous')

  return (
    <main className="survey-page phone">
      <div className="survey-page__inner">
        <SurveyHeader onSkip={handleSkip} />

        <div className="phone__body">
          <div className="phone__intro">
            <h1 className="phone__title">Phone Number</h1>
            <p className="phone__subtitle">
              Share your phone number to win MoMo gifts by completing a survey on
              your USSD or MoMo App.
            </p>
          </div>

          <input
            className="phone__input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-label="Phone number"
          />
        </div>

        <div className="phone__footer">
          <button type="button" className="phone__cta" onClick={handleProceed}>
            <span>Proceed To Survey</span>
            <ArrowRight />
          </button>
        </div>
      </div>
    </main>
  )
}
