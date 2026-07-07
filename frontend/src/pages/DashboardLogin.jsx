import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getToken } from '../lib/api.js'
import momoLogo from '../assets/momo-logo.png'
import './DashboardLogin.css'

function EyeIcon({ off }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {off ? (
        <>
          <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </>
      ) : (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )
}

export default function DashboardLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (getToken()) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__glow" aria-hidden="true" />
      
      <div className="login-page__inner">
        <form onSubmit={handleLogin} className="login-card">
          <div className="login-card__header">
            <img className="login-card__logo" src={momoLogo} alt="MoMo, from MTN" />
            <h1 className="login-card__title">MoMo Admin Portal</h1>
            <p className="login-card__subtitle">Authenticate to access survey statistics and responses</p>
          </div>

          {error && (
            <div className="login-card__error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <div className="login-card__field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
            />
          </div>

          <div className="login-card__field">
            <label htmlFor="password">Password</label>
            <div className="login-card__password">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
              />
              <button
                type="button"
                className="login-card__reveal"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-card__submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Log In'}
          </button>
        </form>
      </div>
    </main>
  )
}
