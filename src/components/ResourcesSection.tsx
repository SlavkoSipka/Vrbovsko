import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Topic } from '../lib/supabase'

export default function ResourcesSection() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('topics')
        .select('*, sections!inner(slug)')
        .eq('sections.slug', 'odrzivi-razvoj')
        .eq('visible', true)
        .order('sort_order')
      setTopics(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <section className="res-section" aria-labelledby="res-heading">

      <div className="res-watermark" aria-hidden="true">RESURSI</div>

      <div className="container res-inner">

        <div className="res-top res-top--anim">
          <div className="res-top-left">
            <p className="onama-section-label">Biblioteka Materijala</p>
            <h2 className="res-title" id="res-heading">
              Resursi za<br />Lokalni Razvoj
            </h2>

            <div className="res-book-icon" aria-hidden="true">
              <svg viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 8 C30 4 10 4 2 8 L2 52 C10 48 30 48 40 52" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M40 8 C50 4 70 4 78 8 L78 52 C70 48 50 48 40 52" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <line x1="40" y1="8" x2="40" y2="52" stroke="currentColor" strokeWidth="2"/>
                <line x1="14" y1="16" x2="34" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="14" y1="22" x2="34" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="14" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="46" y1="16" x2="66" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="46" y1="22" x2="66" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="46" y1="28" x2="66" y2="28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="res-top-right">
            <p className="res-body">
              Ova sekcija je naša biblioteka proverenih materijala za lokalni razvoj — mesto
              gde na jednom mestu okupljamo stručne tekstove, analize i praktične vodiče koji
              pomažu da se ideje pretvore u konkretne akcije. Fokus je na temama održive
              revitalizacije naselja, urbanog planiranja, klimatske otpornosti i cirkularne
              ekonomije, uz stalno oslanjanje na primere dobre prakse.
            </p>
            <p className="res-body">
              Poseban deo čine EU vodiči i smernice koji mogu pomoći zajednicama i udruženjima
              da razumeju standarde, prioritete i modele realizacije projekata. Cilj je da
              građani, stručnjaci i partneri imaju pouzdanu osnovu za informisanje i planiranje —
              jasno, dostupno i primenljivo na lokalni kontekst.
            </p>
          </div>
        </div>

        <div className="res-divider res-divider--anim" aria-hidden="true">
          <span className="res-divider-line" />
          <span className="res-divider-label">Teme</span>
          <span className="res-divider-line" />
        </div>

        <div className="res-grid">
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', gridColumn: '1/-1', textAlign: 'center' }}>Učitavanje tema...</p>
          ) : topics.map((t, i) => (
            <Link
              key={t.id}
              to={`/odrzivi-razvoj/${t.slug}`}
              className="res-card res-card--anim"
              style={{ animationDelay: `${0.1 + i * 0.08}s` } as React.CSSProperties}
            >
              <div className="res-card-icon" aria-hidden="true">
                {t.icon_svg && t.icon_svg.trim().length <= 8
                  ? <span className="res-card-emoji">{t.icon_svg.trim()}</span>
                  : t.icon_svg
                    ? <span dangerouslySetInnerHTML={{ __html: t.icon_svg }} />
                    : <span className="res-card-emoji">📄</span>
                }
              </div>
              <div className="res-card-body">
                <strong className="res-card-label">{t.title}</strong>
                <p className="res-card-desc">{t.short_desc}</p>
              </div>
              <div className="res-card-arrow" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
