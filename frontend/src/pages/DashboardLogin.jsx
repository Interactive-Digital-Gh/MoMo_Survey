import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getToken } from '../lib/api.js'
import momoLogo from '../assets/momo-logo.png'
import './DashboardLogin.css'

export default function DashboardLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />
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
