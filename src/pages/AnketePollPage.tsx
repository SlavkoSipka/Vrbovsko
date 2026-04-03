import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type SurveyPoll, type SurveyOption } from '../lib/supabase'

const VOTER_NAME_KEY = 'vrbovski_ankete_voter_name'
function getStoredName() { try { return localStorage.getItem(VOTER_NAME_KEY) ?? '' } catch { return '' } }
function storeName(n: string) { try { localStorage.setItem(VOTER_NAME_KEY, n) } catch { /* */ } }

function isPollExpired(poll: SurveyPoll) {
  if (poll.is_closed) return true
  if (poll.expires_at && new Date(poll.expires_at) < new Date()) return true
  return false
}

export default function AnketePollPage() {
  const { id } = useParams<{ id: string }>()
  const [poll, setPoll] = useState<SurveyPoll | null>(null)
  const [options, setOptions] = useState<SurveyOption[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [voterName, setVoterName] = useState(getStoredName())
  const [submitting, setSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [results, setResults] = useState<Record<string, number>>({})
  const [totalVotes, setTotalVotes] = useState(0)
  const [error, setError] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data: pollData } = await supabase.from('survey_polls').select('*').eq('id', id).single()
      if (!pollData) { setLoading(false); return }
      setPoll(pollData)
      document.title = `${pollData.title} | Ankete | Vrbovski`

      const { data: optData } = await supabase.from('survey_options').select('*').eq('poll_id', id).order('sort_order')
      setOptions(optData ?? [])

      const expired = isPollExpired(pollData)
      if (expired) {
        await loadResults(id!)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function loadResults(pollId: string) {
    const { data } = await supabase.rpc('get_poll_results', { p_poll_id: pollId })
    const counts: Record<string, number> = {}
    let total = 0
    if (data) {
      for (const row of data as { option_id: string; vote_count: number }[]) {
        counts[row.option_id] = row.vote_count
        total += row.vote_count
      }
    }
    setResults(counts)
    setTotalVotes(total)
  }

  async function handleVote() {
    if (!poll || !id || !selectedOption) return
    if (!voterName.trim()) { setError('Unesite vaše ime i prezime.'); nameRef.current?.focus(); return }
    setError('')
    setSubmitting(true)

    const { data: exists } = await supabase.rpc('check_voter_exists', {
      p_poll_id: id,
      p_voter_name: voterName.trim(),
    })
    if (exists) {
      setError('Osoba sa ovim imenom je već glasala u ovoj anketi.')
      setSubmitting(false)
      return
    }

    const { error: insertErr } = await supabase.from('survey_votes').insert({
      poll_id: id,
      option_id: selectedOption,
      voter_name: voterName.trim(),
    })

    if (insertErr) {
      if (insertErr.message.includes('unique') || insertErr.message.includes('duplicate')) {
        setError('Osoba sa ovim imenom je već glasala u ovoj anketi.')
      } else {
        setError('Greška pri glasanju: ' + insertErr.message)
      }
      setSubmitting(false)
      return
    }

    storeName(voterName.trim())
    setHasVoted(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image"><img src="/hero-nasa-zajednica.webp" alt="" loading="eager" style={{ objectPosition: 'center 40%' }} /><div className="hero-overlay" aria-hidden="true"></div></div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Anketa</h1></div></div></div>
        </header>
        <main className="ankete-poll-page"><div className="container"><div className="forum-loading"><div className="forum-loading-spinner" /><p>Učitavanje...</p></div></div></main>
      </>
    )
  }

  if (!poll) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image"><img src="/hero-nasa-zajednica.webp" alt="" loading="eager" style={{ objectPosition: 'center 40%' }} /><div className="hero-overlay" aria-hidden="true"></div></div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Anketa nije pronađena</h1></div></div></div>
        </header>
        <main className="ankete-poll-page"><div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Link to="/nasa-zajednica/ankete" className="forum-back-link"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Nazad na ankete</Link>
        </div></main>
      </>
    )
  }

  const expired = isPollExpired(poll)
  const showResults = expired || hasVoted

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image"><img src="/hero-nasa-zajednica.webp" alt="" loading="eager" style={{ objectPosition: 'center 40%' }} /><div className="hero-overlay" aria-hidden="true"></div></div>
        <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">{poll.title}</h1></div></div></div>
      </header>

      <main className="ankete-poll-page">
        <div className="container">

          <Link to="/nasa-zajednica/ankete" className="forum-back-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Sve ankete
          </Link>

          <div className="ankete-poll-card">
            <div className="ankete-poll-header">
              {expired ? (
                <span className="ankete-badge ankete-badge--closed">Završena</span>
              ) : (
                <span className="ankete-badge ankete-badge--active">Aktivna</span>
              )}
              {poll.expires_at && !poll.is_closed && (
                <span className="ankete-poll-expires">
                  Ističe: {new Date(poll.expires_at).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            <h2 className="ankete-poll-question">{poll.question}</h2>

            {showResults ? (
              /* ── Results view ── */
              <div className="ankete-results">
                {hasVoted && !expired && (
                  <p className="ankete-thankyou">Hvala na glasanju! Rezultati će biti vidljivi nakon zatvaranja ankete.</p>
                )}
                {expired && (
                  <>
                    <p className="ankete-results-info">Ukupno glasova: <strong>{totalVotes}</strong></p>
                    {options.map(opt => {
                      const count = results[opt.id] ?? 0
                      const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
                      return (
                        <div key={opt.id} className="ankete-result-row">
                          <div className="ankete-result-label">
                            <span>{opt.label}</span>
                            <span className="ankete-result-pct">{pct}% ({count})</span>
                          </div>
                          <div className="ankete-result-bar">
                            <div className="ankete-result-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            ) : (
              /* ── Voting form ── */
              <div className="ankete-vote-form">
                <div className="ankete-options">
                  {options.map(opt => (
                    <label key={opt.id} className={`ankete-option ${selectedOption === opt.id ? 'ankete-option--selected' : ''}`}>
                      <input
                        type="radio"
                        name="poll-vote"
                        value={opt.id}
                        checked={selectedOption === opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                      />
                      <span className="ankete-option-radio" />
                      <span className="ankete-option-label">{opt.label}</span>
                    </label>
                  ))}
                </div>

                <div className="ankete-voter-name">
                  <label className="ankete-voter-label">Vaše ime i prezime <span>(obavezno)</span></label>
                  <input
                    ref={nameRef}
                    type="text"
                    className="ankete-voter-input"
                    placeholder="Ime i prezime"
                    value={voterName}
                    onChange={e => { setVoterName(e.target.value); setError('') }}
                    maxLength={60}
                  />
                </div>

                {error && <p className="ankete-error">{error}</p>}

                <button
                  className="ankete-vote-btn"
                  disabled={!selectedOption || !voterName.trim() || submitting}
                  onClick={handleVote}
                >
                  {submitting ? 'Glasanje...' : 'Glasaj'}
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  )
}
