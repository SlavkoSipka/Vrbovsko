import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Initiative, type Project, type Activity, type ProjectPhase, type ProjectDocument, type InitiativeDocument } from '../lib/supabase'
import { CategoryBadge } from '../components/CategoryBadge'

function parseGoalsFromDesc(raw: string) {
  const marker = '<!--GOALS-->'
  const idx = raw.indexOf(marker)
  if (idx === -1) return { desc: raw, goals: '' }
  return { desc: raw.slice(0, idx).trimEnd(), goals: raw.slice(idx + marker.length).trim() }
}

export default function InicijativaPage() {
  const { type, slug } = useParams<{ type: string; slug: string }>()
  const isProject = type === 'projekat'
  const [item, setItem] = useState<(Initiative | Project) & { goals?: string; detailed_description?: string } | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [phases, setPhases] = useState<ProjectPhase[]>([])
  const [docs, setDocs] = useState<(ProjectDocument | InitiativeDocument)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const table = isProject ? 'projects' : 'initiatives'
      const { data } = await supabase
        .from(table)
        .select('*')
        .eq('slug', slug ?? '')
        .eq('visible', true)
        .single()

      setItem(data)
      if (data) document.title = `${data.title} | Vrbovski`

      if (data) {
        const parentType = isProject ? 'project' : 'initiative'

        const { data: acts } = await supabase.from('project_activities')
          .select('*')
          .eq('parent_type', parentType)
          .eq('parent_id', data.id)
          .eq('visible', true)
          .order('activity_date', { ascending: false })
        setActivities(acts ?? [])

        if (isProject) {
          const { data: phData } = await supabase.from('project_phases').select('*').eq('project_id', data.id).order('sort_order')
          setPhases(phData ?? [])
          const { data: docData } = await supabase.from('project_documents').select('*').eq('project_id', data.id).order('sort_order')
          setDocs(docData ?? [])
        } else {
          const { data: docData } = await supabase.from('initiative_documents').select('*').eq('initiative_id', data.id).order('sort_order')
          setDocs(docData ?? [])
        }
      }

      setLoading(false)
    }
    load()
  }, [slug, isProject])

  if (loading) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image"><img src="/mapa-vrbovsko.png" alt="" loading="eager" /><div className="hero-overlay" aria-hidden="true" /></div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Učitavanje...</h1></div></div></div>
        </header>
        <main><div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Učitavanje...</div></main>
      </>
    )
  }

  if (!item) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image"><img src="/mapa-vrbovsko.png" alt="" loading="eager" /><div className="hero-overlay" aria-hidden="true" /></div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Stranica nije pronađena</h1></div></div></div>
        </header>
        <main>
          <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <p>{isProject ? 'Projekat' : 'Inicijativa'} nije pronađen/a.</p>
            <Link to="/projekti-i-aktivnosti" className="pi-back-link">&larr; Nazad</Link>
          </div>
        </main>
      </>
    )
  }

  const statusLabel = item.status === 'aktivan' ? 'Aktivan' : item.status === 'zavrsen' ? 'Završen' : 'Planiran'
  const statusClass = item.status === 'aktivan' ? 'pi-tag--active' : item.status === 'zavrsen' ? 'pi-tag--done' : 'pi-tag--planned'

  const actStatusLabel = (s: string) => s === 'planirano' ? 'Planirano' : s === 'u_toku' ? 'U toku' : 'Završeno'
  const actStatusClass = (s: string) => s === 'planirano' ? 'tl-status--planned' : s === 'u_toku' ? 'tl-status--active' : 'tl-status--done'

  const phaseStatusLabel = (s: string) => s === 'planirano' ? 'Planirano' : s === 'u_toku' ? 'U toku' : 'Završeno'
  const phaseStatusClass = (s: string) => s === 'planirano' ? 'phase-status--planned' : s === 'u_toku' ? 'phase-status--active' : 'phase-status--done'

  const parsed = parseGoalsFromDesc(item.description)
  const cleanDesc = parsed.desc
  const goalsArr = parsed.goals ? parsed.goals.split('\n').filter(g => g.trim()) : []

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          {item.cover_image ? (
            <img src={item.cover_image} alt={item.title} loading="eager" />
          ) : (
            <img src="/mapa-vrbovsko.png" alt={item.title} loading="eager" />
          )}
          <div className="hero-overlay" aria-hidden="true" />
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">{item.title}</h1>
            </div>
          </div>
        </div>
        <a href="#inic-content" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span><div className="scroll-arrow" aria-hidden="true" />
        </a>
      </header>

      <main id="inic-content">
        <article className="inic-article">
          <div className="container">

            <Link to="/projekti-i-aktivnosti" className="inic-back">&larr; Sve inicijative i projekti</Link>

            {/* 1. Osnovne informacije */}
            <div className="inic-meta">
              <span className={`pi-tag ${statusClass}`}>{statusLabel}</span>
              {item.date_text && <time className="inic-date">{item.date_text}</time>}
              <span className="inic-type">{isProject ? 'Projekat' : 'Inicijativa'}</span>
              {item.category && <CategoryBadge category={item.category} />}
            </div>

            {/* 2. Opis */}
            <div className="inic-content-wrap">
              <div className="inic-body">
                {cleanDesc.split('\n').map((line, i) => {
                  const trimmed = line.trim()
                  if (!trimmed) return <br key={i} />
                  if (i === 0 || (trimmed.length < 80 && !trimmed.endsWith('.'))) {
                    return <h3 key={i} className="inic-body-heading">{trimmed}</h3>
                  }
                  return <p key={i}>{trimmed}</p>
                })}
              </div>
              {item.cover_image && (
                <aside className="inic-sidebar">
                  <figure className="inic-figure">
                    <img src={item.cover_image} alt={item.title} loading="lazy" />
                  </figure>
                </aside>
              )}
            </div>

            {/* Detaljan opis (ako postoji) */}
            {item.detailed_description && (
              <section className="inic-section">
                <h2 className="inic-section-title">Detaljan opis</h2>
                <div className="inic-body">
                  {item.detailed_description.split('\n').map((line, i) => {
                    const trimmed = line.trim()
                    if (!trimmed) return <br key={i} />
                    return <p key={i}>{trimmed}</p>
                  })}
                </div>
              </section>
            )}

            {/* 3. Ciljevi */}
            {goalsArr.length > 0 && (
              <section className="inic-section">
                <h2 className="inic-section-title">Ciljevi {isProject ? 'projekta' : 'inicijative'}</h2>
                <ul className="inic-goals-list">
                  {goalsArr.map((goal, i) => (
                    <li key={i} className="inic-goal-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inic-goal-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Partner / Donator */}
            {'partner' in item && item.partner && (
              <div className="inic-partner">
                <strong>Partner / Donator:</strong> {item.partner}
              </div>
            )}

            {/* Progress bar */}
            {'progress_pct' in item && item.progress_pct > 0 && (
              <div className="inic-progress-wrap">
                <div className="inic-progress-label">
                  <span>Napredak</span>
                  <span>{item.progress_pct}%</span>
                </div>
                <div className="inic-progress-bar">
                  <div className="inic-progress-fill" style={{ width: `${item.progress_pct}%` }} />
                </div>
              </div>
            )}

            {/* Dokumenti */}
            {docs.length > 0 && (
              <section className="inic-section">
                <h2 className="inic-section-title">Dokumenti</h2>
                <div className="inic-docs-grid">
                  {docs.map(doc => {
                    const isPdf = doc.file_type === 'pdf'
                    const isImage = doc.file_type === 'image' || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.url)
                    return (
                      <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="inic-doc-card">
                        <div className="inic-doc-icon">
                          {isPdf ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ) : isImage ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          )}
                        </div>
                        <div className="inic-doc-info">
                          <span className="inic-doc-title">{doc.title}</span>
                          <span className="inic-doc-type">{isPdf ? 'PDF dokument' : isImage ? 'Slika' : 'Link'}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inic-doc-arrow" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )
                  })}
                </div>
              </section>
            )}

            {/* 4. Faze projekta (samo za projekte) */}
            {isProject && phases.length > 0 && (
              <section className="inic-section">
                <h2 className="inic-section-title">Faze projekta</h2>
                <div className="phases-grid">
                  {phases.map((phase, idx) => (
                    <div key={phase.id} className="phase-card">
                      <div className="phase-card-header">
                        <span className="phase-number">Faza {idx + 1}</span>
                        <span className={`phase-status ${phaseStatusClass(phase.status)}`}>
                          {phaseStatusLabel(phase.status)}
                        </span>
                      </div>
                      <h3 className="phase-card-title">{phase.title}</h3>
                      {phase.description && <p className="phase-card-desc">{phase.description}</p>}
                      {phase.cover_image && (
                        <img src={phase.cover_image} alt={phase.title} className="phase-card-img" loading="lazy" />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. TIMELINE AKTIVNOSTI — uvek vidljiv */}
            <section className="inic-section" id="timeline">
              <h2 className="inic-section-title">
                Aktivnosti
                {activities.length > 0 && <span className="tl-count">({activities.length})</span>}
              </h2>

              {activities.length > 0 && (
                <div className="tl-legend">
                  <span className="tl-legend-item tl-status--planned">Planirano</span>
                  <span className="tl-legend-item tl-status--active">U toku</span>
                  <span className="tl-legend-item tl-status--done">Završeno</span>
                </div>
              )}

              {activities.length > 0 ? (
                <div className="timeline">
                  {activities.map((act, idx) => {
                    const dateFormatted = new Date(act.activity_date).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })
                    return (
                      <div key={act.id} className="tl-item">
                        <div className="tl-date-col">
                          <time className="tl-date">{dateFormatted}</time>
                        </div>
                        <div className="tl-dot-col">
                          <div className={`tl-dot ${actStatusClass(act.status)}`} />
                          {idx < activities.length - 1 && <div className="tl-line" />}
                        </div>
                        <div className="tl-content-col">
                          <Link
                            to={`/projekti-i-aktivnosti/${type}/${slug}/aktivnost/${act.slug}`}
                            className={`tl-card ${actStatusClass(act.status)}`}
                          >
                            <div className="tl-card-top">
                              <span className={`tl-card-status ${actStatusClass(act.status)}`}>
                                {actStatusLabel(act.status)}
                              </span>
                            </div>
                            {act.cover_image && (
                              <img src={act.cover_image} alt={act.title} className="tl-card-img" loading="lazy" />
                            )}
                            <h3 className="tl-card-title">{act.title}</h3>
                            {act.short_desc && <p className="tl-card-desc">{act.short_desc}</p>}
                            <span className="tl-card-link">Detaljnije &rarr;</span>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="tl-empty">
                  <div className="tl-empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="tl-empty-text">Aktivnosti za ovaj {isProject ? 'projekat' : 'inicijativu'} biće uskoro objavljene.</p>
                  <p className="tl-empty-sub">Pratite ovu stranicu za ažuriranja o svim aktivnostima, dokumentima i rezultatima.</p>
                </div>
              )}
            </section>

          </div>
        </article>
      </main>
    </>
  )
}
