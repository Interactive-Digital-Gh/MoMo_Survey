import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, clearToken, fetchResponses } from '../lib/api.js'
import { questions } from '../data/questions.js'
import { exportRowsToXlsx } from '../lib/xlsx.js'
import momoLogo from '../assets/momo-logo.png'
import './Dashboard.css'

// "2026-07-06 14:30" — sortable, locale-independent timestamp for the export.
function formatDateTime(d) {
  if (Number.isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(
    d.getHours(),
  )}:${p(d.getMinutes())}`
}

// Map an API row to the shape the dashboard renders (timestamp + safe phone).
function normalizeEntry(e) {
  return { ...e, phone: e.phone || 'Anonymous', timestamp: e.created_at }
}

function PowerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntry, setSelectedEntry] = useState(null)

  // Auth guard + load responses from the API.
  useEffect(() => {
    if (!getToken()) {
      navigate('/dashboard/login')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchResponses()
        if (!cancelled) setEntries(data.map(normalizeEntry))
      } catch (err) {
        if (cancelled) return
        if (err.status === 401) {
          navigate('/dashboard/login')
          return
        }
        setLoadError(err.message || 'Failed to load responses')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate])

  const handleLogout = () => {
    clearToken()
    navigate('/dashboard/login')
  }

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `momo_survey_responses_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Export the currently shown (filtered) rows as a real .xlsx. One row per
  // response; a column per question with the human-readable answer label.
  const handleExportExcel = () => {
    const header = [
      '#',
      'Phone Number',
      'Submission ID',
      'Submitted',
      'Answered',
      ...questions.map((q) => `Q${q.id}. ${q.question}`),
    ]

    const rows = filteredEntries.map((entry, i) => {
      const answered = Object.values(entry.answers).filter((v) => v != null).length
      const answerCells = questions.map((q) => {
        const opt = q.options.find((o) => o.key === entry.answers[q.id])
        return opt ? opt.label : ''
      })
      return [
        i + 1,
        entry.phone,
        entry.submission_id || '',
        formatDateTime(new Date(entry.timestamp)),
        `${answered}/${questions.length}`,
        ...answerCells,
      ]
    })

    const stamp = new Date().toISOString().slice(0, 10)
    exportRowsToXlsx(
      `momo_survey_responses_${stamp}.xlsx`,
      'Responses',
      [header, ...rows],
    )
  }

  // Live filter entries by phone search
  const filteredEntries = entries.filter((entry) =>
    entry.phone.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // Calculations for Admin Analytics Cards
  const totalCount = entries.length
  
  // 1. App Access Rate (Q1: B: App, C: Both)
  const appAccessCount = entries.filter(e => e.answers[1] === 'B' || e.answers[1] === 'C').length
  const appAccessPct = totalCount > 0 ? Math.round((appAccessCount / totalCount) * 100) : 0

  // 2. Smartphone usage (Q4: A: Smartphone only, C: Smartphone + Feature, D: Lesser Smartphone)
  const smartphoneCount = entries.filter(e => e.answers[4] === 'A' || e.answers[4] === 'C' || e.answers[4] === 'D').length
  const smartphonePct = totalCount > 0 ? Math.round((smartphoneCount / totalCount) * 100) : 0

  // 3. Biometric awareness (Q6: A: Yes)
  const biometricCount = entries.filter(e => e.answers[6] === 'A').length
  const biometricPct = totalCount > 0 ? Math.round((biometricCount / totalCount) * 100) : 0

  // 4. USSD Exclusive rate (Q1: A)
  const ussdExclusiveCount = entries.filter(e => e.answers[1] === 'A').length
  const ussdExclusivePct = totalCount > 0 ? Math.round((ussdExclusiveCount / totalCount) * 100) : 0

  // Chart aggregation helper: Returns list of keys, labels, select counts and percentages
  const getQuestionStats = (qId) => {
    const questionObj = questions.find(q => q.id === qId)
    if (!questionObj) return []
    
    return questionObj.options.map(opt => {
      const count = entries.filter(e => e.answers[qId] === opt.key).length
      const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
      return {
        key: opt.key,
        label: opt.label,
        count,
        pct
      }
    }).sort((a, b) => b.count - a.count)
  }

  const q1Stats = getQuestionStats(1)
  const q3Stats = getQuestionStats(3)
  const q4Stats = getQuestionStats(4)

  return (
    <main className="dashboard-page">
      {/* Curved branding header background */}
      <div className="dashboard-header-bg" aria-hidden="true" />
      
      <div className="dashboard-container">
        {/* Navigation Top Bar */}
        <header className="dashboard-nav">
          <div className="dashboard-nav__left">
            <img className="dashboard-nav__logo" src={momoLogo} alt="MTN MoMo" />
            <h1 className="dashboard-nav__title">Survey Insights</h1>
          </div>
          <button type="button" className="dashboard-nav__logout" onClick={handleLogout}>
            <PowerIcon />
            <span>Log Out</span>
          </button>
        </header>

        {/* Stats Grid Overview */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-card__eyebrow">Total Submissions</span>
            <p className="stat-card__value">{totalCount}</p>
            <span className="stat-card__trend stat-card__trend--neutral">Live responses</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__eyebrow">App Access Rate</span>
            <p className="stat-card__value">{appAccessPct}%</p>
            <span className="stat-card__trend stat-card__trend--positive">Use MoMo App (Q1)</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__eyebrow">Smartphones Daily</span>
            <p className="stat-card__value">{smartphonePct}%</p>
            <span className="stat-card__trend stat-card__trend--positive">Device adoption (Q4)</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__eyebrow">Biometric Aware</span>
            <p className="stat-card__value">{biometricPct}%</p>
            <span className="stat-card__trend stat-card__trend--positive">Enable fingerprint (Q6)</span>
          </div>
        </section>

        {loading ? (
          <section className="dashboard-empty-card">
            <h2>Loading responses…</h2>
          </section>
        ) : loadError ? (
          <section className="dashboard-empty-card">
            <h2>Couldn&apos;t load responses</h2>
            <p>{loadError}</p>
          </section>
        ) : totalCount === 0 ? (
          <section className="dashboard-empty-card">
            <h2>No survey responses yet</h2>
            <p>Responses will appear here as people complete the survey.</p>
          </section>
        ) : (
          <>
            {/* Visual Charts Section */}
            <section className="charts-section">
              <div className="chart-card">
                <h2 className="chart-card__title">Access Methods (Q1)</h2>
                <p className="chart-card__subtitle">How users access their MoMo accounts</p>
                <div className="chart-container">
                  {q1Stats.map((item) => (
                    <div className="chart-row" key={item.key}>
                      <div className="chart-row__labels">
                        <span className="chart-row__option-label">{item.label}</span>
                        <span className="chart-row__option-val">{item.pct}% ({item.count})</span>
                      </div>
                      <div className="chart-row__track">
                        <div 
                          className="chart-row__fill" 
                          style={{ width: `${item.pct}%`, background: 'var(--momo-yellow-normal)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h2 className="chart-card__title">Device Profiles (Q4)</h2>
                <p className="chart-card__subtitle">Hardware actively used by respondents</p>
                <div className="chart-container">
                  {q4Stats.map((item) => (
                    <div className="chart-row" key={item.key}>
                      <div className="chart-row__labels">
                        <span className="chart-row__option-label">{item.label}</span>
                        <span className="chart-row__option-val">{item.pct}% ({item.count})</span>
                      </div>
                      <div className="chart-row__track">
                        <div 
                          className="chart-row__fill" 
                          style={{ width: `${item.pct}%`, background: 'var(--momo-blue-normal)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Main Responses Table Section */}
            <section className="table-section">
              <div className="table-section__header">
                <div className="table-section__title-group">
                  <h2 className="table-section__title">All Submissions</h2>
                  <p className="table-section__subtitle">Review and inspect individual user inputs</p>
                </div>
                <div className="table-section__actions">
                  <input
                    type="search"
                    placeholder="Search phone number..."
                    className="table-section__search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search entries by phone number"
                  />
                  <button type="button" className="action-btn action-btn--excel" onClick={handleExportExcel} title="Download responses as an Excel (.xlsx) file">
                    <DownloadIcon />
                    <span>Export Excel</span>
                  </button>
                  <button type="button" className="action-btn action-btn--export" onClick={handleExportJSON} title="Download responses as JSON">
                    <DownloadIcon />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="entries-table">
                  <thead>
                    <tr>
                      <th>Phone Number</th>
                      <th>Submission Date</th>
                      <th>Completion Time</th>
                      <th>Answers Log</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry) => {
                      const dateObj = new Date(entry.timestamp)
                      const formattedDate = dateObj.toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                      const formattedTime = dateObj.toLocaleTimeString(undefined, { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                      
                      // Count answered vs skipped questions
                      const answersCount = Object.values(entry.answers).filter(val => val !== null).length

                      return (
                        <tr key={entry.id}>
                          <td className="entry-phone">{entry.phone}</td>
                          <td>{formattedDate}</td>
                          <td>{formattedTime}</td>
                          <td>
                            <span className={`entry-badge ${answersCount === 10 ? 'entry-badge--complete' : 'entry-badge--partial'}`}>
                              {answersCount}/10 Answered
                            </span>
                          </td>
                          <td>
                            <button 
                              type="button" 
                              className="view-details-btn" 
                              onClick={() => setSelectedEntry(entry)}
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {filteredEntries.length === 0 && (
                      <tr>
                        <td colSpan="5" className="table-no-results">
                          No matching records found for "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Response Detail Modal Overlay */}
      {selectedEntry && (
        <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div>
                <h3 className="modal-header__title">Survey Response Details</h3>
                <p className="modal-header__subtitle">Phone: <strong>{selectedEntry.phone}</strong> • Submitted: {new Date(selectedEntry.timestamp).toLocaleString()}</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setSelectedEntry(null)}>
                &times;
              </button>
            </header>
            
            <div className="modal-body">
              {questions.map((q, idx) => {
                const userKey = selectedEntry.answers[q.id]
                const selectedOpt = q.options.find(opt => opt.key === userKey)

                return (
                  <div className="modal-question-row" key={q.id}>
                    <div className="modal-question-num">Q{q.id}</div>
                    <div className="modal-question-detail">
                      <p className="modal-question-text">
                        {q.eyebrow && <span className="modal-question-eyebrow">[{q.eyebrow}] </span>}
                        {q.question}
                      </p>
                      <div className="modal-answer-block">
                        {selectedOpt ? (
                          <div className="modal-answer-selected">
                            <span className="modal-answer-badge">{selectedOpt.key}</span>
                            <span className="modal-answer-label">{selectedOpt.label}</span>
                          </div>
                        ) : (
                          <span className="modal-answer-skipped">[No Answer / Skipped]</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
