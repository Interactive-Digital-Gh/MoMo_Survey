import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SurveyHeader from '../components/SurveyHeader.jsx'
import { uuid } from '../lib/uuid.js'
import { normalizePhoneGh } from '../lib/phone.js'
import { checkPhoneExists } from '../lib/api.js'
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
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  // Start a fresh survey attempt: record the phone, mint a submission id (used
  // for idempotent submission), and clear any answers from a previous run.
  const startSurvey = (phoneValue) => {
    sessionStorage.setItem('momo_current_phone', phoneValue)
    sessionStorage.setItem('momo_submission_id', uuid())
    sessionStorage.removeItem('momo_current_answers')
    navigate('/question/1')
  }

  const handleProceed = async () => {
    if (checking) return

    const { valid, e164 } = normalizePhoneGh(phone)
    if (!valid) {
      setError(
        'Enter a valid MTN Ghana number (024, 025, 053, 054, 055 or 059).',
      )
      return
    }

    setError('')
    setChecking(true)
    try {
      if (await checkPhoneExists(e164)) {
        setError('This number has already entered the survey.')
        return
      }
    } catch {
      // Check unavailable (offline/server) — don't block a valid entrant; the
      // backend's unique constraint is the real guard against double entries.
    } finally {
      setChecking(false)
    }

    startSurvey(e164)
  }

  const handleChange = (e) => {
    setPhone(e.target.value)
    if (error) setError('')
  }

  return (
    <main className="survey-page phone">
      <div className="survey-page__inner">
        <SurveyHeader />

        <div className="phone__body">
          <div className="phone__intro">
            <h1 className="phone__title">Phone Number</h1>
            <p className="phone__subtitle">
              Share your MTN phone number to win MoMo gifts by completing a
              survey on your USSD or MoMo App.
            </p>
          </div>

          <div className="phone__field">
            <input
              className={`phone__input${error ? ' phone__input--error' : ''}`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleProceed()}
              aria-label="Phone number"
              aria-invalid={error ? 'true' : 'false'}
            />
            {error && (
              <p className="phone__error" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="phone__footer">
          <button
            type="button"
            className="phone__cta"
            onClick={handleProceed}
            disabled={checking}
          >
            <span>{checking ? 'Checking…' : 'Proceed To Survey'}</span>
            {!checking && <ArrowRight />}
          </button>
        </div>
      </div>
    </main>
  )
}
