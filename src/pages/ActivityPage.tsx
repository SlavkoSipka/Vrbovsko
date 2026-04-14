import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Activity, type ActivityDocument, type ActivityGalleryImage } from '../lib/supabase'

export default function ActivityPage() {
  const { type, slug, activitySlug } = useParams<{ type: string; slug: string; activitySlug: string }>()
  const isProject = type === 'projekat'

  const [activity, setActivity] = useState<Activity | null>(null)
  const [docs, setDocs] = useState<ActivityDocument[]>([])
  const [gallery, setGallery] = useState<ActivityGalleryImage[]>([])
  const [parentTitle, setParentTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const parentTable = isProject ? 'projects' : 'initiatives'
      const { data: parent } = await supabase
        .from(parentTable)
        .select('id, title')
        .eq('slug', slug ?? '')
        .single()

      if (!parent) { setLoading(false); return }
      setParentTitle(parent.title)

      const { data: act } = await supabase
        .from('project_activities')
        .select('*')
        .eq('parent_id', parent.id)
        .eq('slug', activitySlug ?? '')
        .eq('visible', true)
        .single()

      setActivity(act)
      if (act) {
        document.title = `${act.title} | ${parent.title} | Vrbovski`

        const [{ data: docsData }, { data: galData }] = await Promise.all([
          supabase.from('activity_documents').select('*').eq('activity_id', act.id).order('sort_order'),
          supabase.from('activity_gallery').select('*').eq('activity_id', act.id).order('sort_order'),
        ])
        setDocs(docsData ?? [])
        setGallery(galData ?? [])
      }

      setLoading(false)
    }
    load()
  }, [slug, activitySlug, isProject])

  const statusLabel = (s: string) => s === 'planirano' ? 'Planirano' : s === 'u_toku' ? 'U toku' : 'Završeno'
  const statusClass = (s: string) => s === 'planirano' ? 'act-status--planned' : s === 'u_toku' ? 'act-status--active' : 'act-status--done'

  if (loading) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image"><img src="/mapa-vrbovsko.png" alt="" loading="eager" /><div className="hero-overlay" aria-hidden="true" /></div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Učitavanje...</h1></div></div></div>
        </header>
        <main><div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Učitavanje aktivnosti...</div></main>
      </>
    )
  }

  if (!activity) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image"><img src="/mapa-vrbovsko.png" alt="" loading="eager" /><div className="hero-overlay" aria-hidden="true" /></div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Aktivnost nije pronađena</h1></div></div></div>
        </header>
        <main>
          <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <p>Ova aktivnost nije dostupna.</p>
            <Link to={`/projekti-i-aktivnosti/${type}/${slug}`} className="pi-back-link">&larr; Nazad na {parentTitle || 'projekat'}</Link>
          </div>
        </main>
      </>
    )
  }

  const goalsArr = activity.goals ? activity.goals.split('\n').filter(g => g.trim()) : []
  const partnersArr = activity.partners ? activity.partners.split(',').map(p => p.trim()).filter(Boolean) : []
  const formattedDate = new Date(activity.activity_date).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <header className="hero hero-page hero-page--full-photo" role="banner">
        <div className="hero-image">
          <img src={activity.cover_image || '/mapa-vrbovsko.png'} alt={activity.title} loading="eager" />
          <div className="hero-overlay" aria-hidden="true" />
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">{activity.title}</h1>
            </div>
          </div>
        </div>
        <a href="#act-content" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span><div className="scroll-arrow" aria-hidden="true" />
        </a>
      </header>

      <main id="act-content">
        <article className="act-article">
          <div className="container">

            {/* Breadcrumb */}
            <nav className="act-breadcrumb" aria-label="Navigacija">
              <Link to="/projekti-i-aktivnosti">Projekti i Aktivnosti</Link>
              <span className="act-breadcrumb-sep">/</span>
              <Link to={`/projekti-i-aktivnosti/${type}/${slug}`}>{parentTitle}</Link>
              <span className="act-breadcrumb-sep">/</span>
              <span>{activity.title}</span>
            </nav>

            {/* Meta */}
            <div className="act-meta">
              <span className={`act-status ${statusClass(activity.status)}`}>{statusLabel(activity.status)}</span>
              <time className="act-date">{formattedDate}</time>
              <span className="act-type">{isProject ? 'Projekat' : 'Inicijativa'}</span>
            </div>

            {/* Short desc */}
            {activity.short_desc && (
              <p className="act-short-desc">{activity.short_desc}</p>
            )}

            {/* Description */}
            {activity.description && (
              <section className="act-section">
                <h2 className="act-section-title">Opis aktivnosti</h2>
                <div className="act-body">
                  {activity.description.split('\n').map((line, i) => {
                    const trimmed = line.trim()
                    if (!trimmed) return <br key={i} />
                    return <p key={i}>{trimmed}</p>
                  })}
                </div>
              </section>
            )}

            {/* Goals */}
            {goalsArr.length > 0 && (
              <section className="act-section">
                <h2 className="act-section-title">Ciljevi aktivnosti</h2>
                <ul className="act-goals">
                  {goalsArr.map((goal, i) => (
                    <li key={i} className="act-goal-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="act-goal-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Documents */}
            {docs.length > 0 && (
              <section className="act-section">
                <h2 className="act-section-title">Dokumenti i materijali</h2>
                <div className="act-docs-grid">
                  {docs.map(doc => (
                    <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="act-doc-card">
                      <span className="act-doc-icon">{doc.file_type === 'pdf' ? '📄' : '📎'}</span>
                      <span className="act-doc-info">
                        <span className="act-doc-name">{doc.title}</span>
                        <span className="act-doc-type">{doc.file_type === 'pdf' ? 'PDF dokument' : 'Fajl'}</span>
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="act-doc-arrow">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <section className="act-section">
                <h2 className="act-section-title">Galerija fotografija</h2>
                <div className="act-gallery-grid">
                  {gallery.map((img, idx) => (
                    <button key={img.id} className="act-gallery-item" onClick={() => setLightboxIdx(idx)}>
                      <img src={img.url} alt={img.alt || `Fotografija ${idx + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Partners */}
            {partnersArr.length > 0 && (
              <section className="act-section">
                <h2 className="act-section-title">Partneri</h2>
                <div className="act-partners">
                  {partnersArr.map((p, i) => (
                    <span key={i} className="act-partner-tag">{p}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Back button */}
            <div className="act-nav-bottom">
              <Link to={`/projekti-i-aktivnosti/${type}/${slug}`} className="act-back-btn">
                &larr; Nazad na aktivnosti
              </Link>
            </div>

          </div>
        </article>
      </main>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="act-lightbox" onClick={() => setLightboxIdx(null)}>
          <button className="act-lightbox-close" onClick={() => setLightboxIdx(null)}>&times;</button>
          <button className="act-lightbox-prev" onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? (i - 1 + gallery.length) % gallery.length : null) }}>&lsaquo;</button>
          <img
            src={gallery[lightboxIdx].url}
            alt={gallery[lightboxIdx].alt || ''}
            onClick={e => e.stopPropagation()}
          />
          <button className="act-lightbox-next" onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? (i + 1) % gallery.length : null) }}>&rsaquo;</button>
          <span className="act-lightbox-counter">{lightboxIdx + 1} / {gallery.length}</span>
        </div>
      )}
    </>
  )
}
