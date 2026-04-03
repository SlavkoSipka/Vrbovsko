import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Initiative, type Project, type ProjectDocument, type InitiativeDocument } from '../lib/supabase'

type AnyDoc = ProjectDocument | InitiativeDocument

export default function InicijativaPage() {
  const { type, slug } = useParams<{ type: string; slug: string }>()
  const isProject = type === 'projekat'
  const [item, setItem] = useState<Initiative | Project | null>(null)
  const [docs, setDocs] = useState<AnyDoc[]>([])
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
        const docTable = isProject ? 'project_documents' : 'initiative_documents'
        const fkCol = isProject ? 'project_id' : 'initiative_id'
        const { data: docsData } = await supabase
          .from(docTable)
          .select('*')
          .eq(fkCol, data.id)
          .order('sort_order')
        setDocs(docsData ?? [])
      }

      setLoading(false)
    }
    load()
  }, [slug, isProject])

  if (loading) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image">
            <img src="/mapa-vrbovsko.png" alt="" loading="eager" />
            <div className="hero-overlay" aria-hidden="true"></div>
          </div>
          <div className="hero-content">
            <div className="container">
              <div className="hero-page-text">
                <h1 className="hero-page-title">Učitavanje...</h1>
              </div>
            </div>
          </div>
        </header>
        <main><div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Učitavanje...</div></main>
      </>
    )
  }

  if (!item) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image">
            <img src="/mapa-vrbovsko.png" alt="" loading="eager" />
            <div className="hero-overlay" aria-hidden="true"></div>
          </div>
          <div className="hero-content">
            <div className="container">
              <div className="hero-page-text">
                <h1 className="hero-page-title">Stranica nije pronađena</h1>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <p>{isProject ? 'Projekat' : 'Inicijativa'} nije pronađen/a ili nije javno dostupan/a.</p>
            <Link to="/projekti-i-aktivnosti" className="pi-back-link">&larr; Nazad na Projekti i Aktivnosti</Link>
          </div>
        </main>
      </>
    )
  }

  const statusLabel = item.status === 'aktivan' ? 'Aktivan' : item.status === 'zavrsen' ? 'Završen' : 'Planiran'
  const statusClass = item.status === 'aktivan' ? 'pi-tag--active' : item.status === 'zavrsen' ? 'pi-tag--done' : 'pi-tag--planned'

  function docIcon(ft: string) {
    if (ft === 'pdf') return '📄'
    if (ft === 'file') return '📎'
    return '🔗'
  }

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          {item.cover_image ? (
            <img src={item.cover_image} alt={item.title} loading="eager" />
          ) : (
            <img src="/mapa-vrbovsko.png" alt={item.title} loading="eager" />
          )}
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                {item.title}
              </h1>
            </div>
          </div>
        </div>
        <a href="#inic-content" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>

      <main id="inic-content">
        <article className="inic-article">
          <div className="container">

            <Link to="/projekti-i-aktivnosti" className="inic-back">&larr; Sve inicijative i projekti</Link>

            <div className="inic-meta">
              <span className={`pi-tag ${statusClass}`}>{statusLabel}</span>
              {item.date_text && <time className="inic-date">{item.date_text}</time>}
              <span className="inic-type">{isProject ? 'Projekat' : 'Inicijativa'}</span>
            </div>

            <div className="inic-content-wrap">
              <div className="inic-body">
                {item.description.split('\n').map((line, i) => {
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

            {'partner' in item && item.partner && (
              <div className="inic-partner">
                <strong>Partner / Donator:</strong> {item.partner}
              </div>
            )}

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

            {docs.length > 0 && (
              <div className="inic-docs">
                <h3 className="inic-docs-title">Dokumenti i materijali</h3>
                <div className="inic-docs-grid">
                  {docs.map(doc => (
                    <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="inic-doc-card">
                      <span className="inic-doc-icon">{docIcon(doc.file_type)}</span>
                      <span className="inic-doc-info">
                        <span className="inic-doc-name">{doc.title}</span>
                        <span className="inic-doc-type">{doc.file_type === 'pdf' ? 'PDF dokument' : doc.file_type === 'file' ? 'Fajl' : 'Link'}</span>
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inic-doc-arrow"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </article>
      </main>
    </>
  )
}
