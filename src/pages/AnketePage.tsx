import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type SurveyPoll, type SurveyOption } from '../lib/supabase'

function isPollExpired(poll: SurveyPoll) {
  if (poll.is_closed) return true
  if (poll.expires_at && new Date(poll.expires_at) < new Date()) return true
  return false
}

interface PollResult { optionId: string; count: number }

export default function AnketePage() {
  const [polls, setPolls] = useState<SurveyPoll[]>([])
  const [options, setOptions] = useState<SurveyOption[]>([])
  const [results, setResults] = useState<Record<string, PollResult[]>>({})
  const [totals, setTotals] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Ankete | Naša Zajednica | Vrbovski'
    async function load() {
      const [{ data: pollData }, { data: optData }] = await Promise.all([
        supabase.from('survey_polls').select('*').order('sort_order'),
        supabase.from('survey_options').select('*').order('sort_order'),
      ])
      const allPolls = pollData ?? []
      setPolls(allPolls)
      setOptions(optData ?? [])

      const closedPolls = allPolls.filter(isPollExpired)
      for (const p of closedPolls) {
        const { data } = await supabase.rpc('get_poll_results', { p_poll_id: p.id })
        if (data) {
          const rows = data as { option_id: string; vote_count: number }[]
          let total = 0
          const res: PollResult[] = rows.map(r => { total += r.vote_count; return { optionId: r.option_id, count: r.vote_count } })
          setResults(prev => ({ ...prev, [p.id]: res }))
          setTotals(prev => ({ ...prev, [p.id]: total }))
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img src="/hero-nasa-zajednica.webp" alt="" loading="eager" style={{ objectPosition: 'center 40%' }} />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">Ankete <span className="highlight">Zajednice</span></h1>
            </div>
          </div>
        </div>
      </header>

      <main className="ankete-page">
        <div className="container">
          <div className="forum-page-intro">
            <Link to="/nasa-zajednica" className="forum-back-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Nazad na Naša Zajednica
            </Link>
            <h2 className="forum-page-heading">Recite Nam Šta Mislite</h2>
            <p className="forum-page-desc">
              Glasajte u anketama i pomozite da prioriteti budu usklađeni sa stvarnim potrebama zajednice.
            </p>
          </div>

          {loading ? (
            <div className="forum-loading"><div className="forum-loading-spinner" /><p>Učitavanje anketa...</p></div>
          ) : (
            <div className="ankete-grid">
              {polls.map(poll => {
                const expired = isPollExpired(poll)
                const pollOpts = options.filter(o => o.poll_id === poll.id)
                const pollResults = results[poll.id]
                const pollTotal = totals[poll.id] ?? 0

                return (
                  <div key={poll.id} className={`ankete-card ${expired ? 'ankete-card--closed' : ''}`}>
                    <div className="ankete-card-status">
                      {expired ? (
                        <span className="ankete-badge ankete-badge--closed">Završena</span>
                      ) : (
                        <span className="ankete-badge ankete-badge--active">Aktivna</span>
                      )}
                    </div>
                    <h3 className="ankete-card-title">{poll.title}</h3>
                    <p className="ankete-card-question">{poll.question}</p>

                    {expired && pollResults ? (
                      <div className="ankete-card-results">
                        <p className="ankete-card-results-label">Rezultati ({pollTotal} {pollTotal === 1 ? 'glas' : 'glasova'})</p>
                        {pollOpts.map(opt => {
                          const found = pollResults.find(r => r.optionId === opt.id)
                          const count = found?.count ?? 0
                          const pct = pollTotal > 0 ? Math.round((count / pollTotal) * 100) : 0
                          return (
                            <div key={opt.id} className="ankete-card-result-row">
                              <div className="ankete-card-result-info">
                                <span>{opt.label}</span>
                                <span className="ankete-card-result-pct">{pct}%</span>
                              </div>
                              <div className="ankete-card-result-bar">
                                <div className="ankete-card-result-fill" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : null}

                    <Link to={`/nasa-zajednica/ankete/${poll.id}`} className="ankete-card-cta-link">
                      {expired ? 'Detaljni rezultati' : 'Glasajte'}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
