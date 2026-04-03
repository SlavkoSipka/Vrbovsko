import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type SurveyPoll } from '../lib/supabase'

function isPollExpired(poll: SurveyPoll) {
  if (poll.is_closed) return true
  if (poll.expires_at && new Date(poll.expires_at) < new Date()) return true
  return false
}

export default function AnketePage() {
  const [polls, setPolls] = useState<SurveyPoll[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Ankete | Naša Zajednica | Vrbovski'
    supabase.from('survey_polls').select('*').order('sort_order').then(({ data }) => {
      setPolls(data ?? [])
      setLoading(false)
    })
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
                return (
                  <Link key={poll.id} to={`/nasa-zajednica/ankete/${poll.id}`} className={`ankete-card ${expired ? 'ankete-card--closed' : ''}`}>
                    <div className="ankete-card-status">
                      {expired ? (
                        <span className="ankete-badge ankete-badge--closed">Završena</span>
                      ) : (
                        <span className="ankete-badge ankete-badge--active">Aktivna</span>
                      )}
                    </div>
                    <h3 className="ankete-card-title">{poll.title}</h3>
                    <p className="ankete-card-question">{poll.question}</p>
                    <span className="ankete-card-cta">
                      {expired ? 'Pogledajte rezultate' : 'Glasajte'}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
