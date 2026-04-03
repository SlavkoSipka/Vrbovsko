import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Project, type Initiative } from '../lib/supabase'

export default function ProjektiAktivnostiPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loadingInit, setLoadingInit] = useState(true)

  useEffect(() => {
    document.title = 'Projekti i Aktivnosti: Od Inicijative Do Rezultata | Vrbovski'

    Promise.all([
      supabase.from('projects').select('*').eq('visible', true).order('sort_order'),
      supabase.from('initiatives').select('*').eq('visible', true).order('sort_order'),
    ]).then(([{ data: projData, error: projErr }, { data: initData, error: initErr }]) => {
      if (projErr) console.error('Supabase projects:', projErr.message)
      if (initErr) console.error('Supabase initiatives:', initErr.message)
      setProjects(projData ?? [])
      setInitiatives(initData ?? [])
      setLoadingInit(false)
    })
  }, [])

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img
            src="/galerija/projekti-hero.webp"
            alt="Put kroz naselje Vrbovski — projekti i aktivnosti"
            loading="eager"
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                Projekti i Aktivnosti:{' '}
                <span className="highlight">Od Inicijative Do Rezultata</span>
              </h1>
            </div>
          </div>
        </div>
        <a href="#pa-sadrzaj" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>

      <main id="pa-sadrzaj">

        {/* Intro */}
        <section className="pa-intro" aria-labelledby="pa-intro-heading">
          <div className="container">

            <div className="pa-intro-top pa-intro-top--anim">
              <div className="pa-intro-top-text">
                <p className="onama-section-label">Naš Rad</p>
                <h2 className="pa-intro-heading" id="pa-intro-heading">
                  Verujemo u Snagu <span className="pa-intro-heading-accent">Konkretnih Koraka</span>
                </h2>
              </div>
              <p className="pa-intro-lead">
                Ova stranica je dokumentacija našeg rada na terenu — od velikih projekata
                koje realizujemo uz podršku donatora, do malih, ali značajnih inicijativa
                koje upućujemo institucijama.
              </p>
              <p className="pa-intro-lead">
                Ovde možete pratiti status svakog našeg dopisa,
                zahteva i akcije, jer verujemo da je vidljivost procesa ključna za poverenje zajednice.
              </p>
            </div>

            <div className="pa-intro-pillars pa-intro-pillars--anim">
              <div className="pa-intro-pillar">
                <span className="pa-intro-pillar-num">01</span>
                <div className="pa-intro-pillar-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </div>
                <h3 className="pa-intro-pillar-title">Projekti</h3>
                <p className="pa-intro-pillar-desc">Veliki projekti uz podršku donatora i institucija — dokumentovani, merljivi, transparentni.</p>
              </div>
              <div className="pa-intro-pillar">
                <span className="pa-intro-pillar-num">02</span>
                <div className="pa-intro-pillar-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="pa-intro-pillar-title">Dopisi &amp; Zahtevi</h3>
                <p className="pa-intro-pillar-desc">Svaka inicijativa upućena institucijama — zapisana, praćena i javno dostupna.</p>
              </div>
              <div className="pa-intro-pillar">
                <span className="pa-intro-pillar-num">03</span>
                <div className="pa-intro-pillar-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <h3 className="pa-intro-pillar-title">Praćenje Statusa</h3>
                <p className="pa-intro-pillar-desc">Svaki korak procesa vidljiv zajednici — jer poverenje se gradi transparentnošću.</p>
              </div>
              <div className="pa-intro-pillar">
                <span className="pa-intro-pillar-num">04</span>
                <div className="pa-intro-pillar-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <h3 className="pa-intro-pillar-title">Zajednica</h3>
                <p className="pa-intro-pillar-desc">Promene nastaju zajedno — svaki glas i svaki predlog doprinosi rezultatu.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Aktivni Projekti */}
        <section className="ap-section" aria-labelledby="ap-heading">

          {/* Top band: label + intro text over image */}
          <div className="ap-hero-band">
            <img
              src="/josh-olalde-X1P1_EDNnok-unsplash (1).jpg"
              alt="Radnik na izgradnji — aktivan projekat revitalizacije u toku"
              className="ap-hero-img"
              loading="lazy"
            />
            <div className="ap-hero-overlay" aria-hidden="true" />
            <div className="ap-hero-content">
              <p className="ap-hero-label">Aktivni Projekti</p>
              <h2 className="ap-hero-title" id="ap-heading">
                Šta Se Trenutno<br /><em>Gradi i Menja</em>
              </h2>
              <p className="ap-hero-desc">
                Projekti koji su trenutno u toku u naselju Vrbovski — sa jasnim ciljevima,
                fazama realizacije i partnerima koji ih podržavaju. Transparentno, pregledno
                i ažurirano.
              </p>
            </div>
          </div>

          {/* Project cards — dynamic from Supabase */}
          <div className="ap-cards-wrap">
            <div className="container">
              <div className="ap-cards">
                {projects.filter(p => p.status !== 'zavrsen').map((p, idx) => (
                  <Link to={`/projekti-i-aktivnosti/projekat/${p.slug}`} key={p.id} className="ap-card ap-card--anim" style={{ animationDelay: `${idx * 0.1}s`, textDecoration: 'none', color: 'inherit' }}>
                    <div className="ap-card-head">
                      <span className={`ap-card-tag ${p.status === 'aktivan' ? 'ap-card-tag--active' : 'ap-card-tag--planned'}`}>
                        {p.status === 'aktivan' ? 'U toku' : 'Planirano'}
                      </span>
                      {p.phase_total > 0 && <span className="ap-card-phase">Faza {p.phase_current} / {p.phase_total}</span>}
                    </div>
                    <h3 className="ap-card-title">{p.title}</h3>
                    <p className="ap-card-desc">{p.description.split('\n').filter(l => l.trim())[0]?.slice(0, 150)}...</p>
                    {p.progress_pct > 0 && (
                      <>
                        <div className="ap-card-progress" aria-label={`Napredak: ${p.progress_pct}%`}>
                          <div className="ap-card-progress-bar" style={{ '--ap-pct': `${p.progress_pct}%` } as React.CSSProperties} />
                        </div>
                        <p className="ap-card-pct">{p.progress_pct}% realizovano</p>
                      </>
                    )}
                    <div className="ap-card-meta">
                      {p.partner && (
                        <div className="ap-card-meta-item">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{p.partner}</span>
                        </div>
                      )}
                      {p.date_text && (
                        <div className="ap-card-meta-item">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span>{p.date_text}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <p className="ap-note">
                Podaci o projektima se redovno ažuriraju. Za pitanja o konkretnom projektu,
                slobodno nas kontaktirajte.
              </p>
            </div>
          </div>

        </section>

        {/* Arhiva */}
        <section className="arh-section" aria-labelledby="arh-heading">
          <div className="container">

            {/* Header */}
            <div className="arh-header arh-header--anim">
              <div className="arh-header-left">
                <p className="onama-section-label">Arhiva</p>
                <h2 className="arh-title" id="arh-heading">
                  Katalog Realizovanih<br />
                  <span className="arh-title-accent">Inicijativa</span>
                </h2>
              </div>
              <p className="arh-intro">
                Arhiva je katalog svih inicijativa koje smo do sada uspešno sproveli u
                naselju Vrbovski. Ovde dokumentujemo završene akcije, projekte i dopise —
                sa kratkim opisom cilja, datumom realizacije i rezultatima na terenu.
                Na taj način čuvamo kontinuitet rada, učimo iz iskustva i jasno pokazujemo
                šta je urađeno i kakav je efekat imalo na zajednicu.
              </p>
            </div>

            {/* Catalog grid — poslednje 4 završene inicijative */}
            <div className="arh-grid arh-grid--anim">
              {initiatives
                .filter(i => i.status === 'zavrsen')
                .slice(-4)
                .reverse()
                .map(i => {
                  const yearMatch = i.date_text.match(/(\d{4})/)
                  const year = yearMatch ? yearMatch[1] : ''
                  return (
                    <Link to={`/projekti-i-aktivnosti/inicijativa/${i.slug}`} key={i.id} className="arh-entry" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="arh-entry-img-wrap">
                        {i.cover_image ? (
                          <img src={i.cover_image} alt={i.title} className="arh-entry-img" loading="lazy" />
                        ) : (
                          <div className="arh-entry-img-placeholder" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        {year && <span className="arh-entry-year">{year}</span>}
                      </div>
                      <div className="arh-entry-body">
                        <p className="arh-entry-type">Inicijativa</p>
                        <h3 className="arh-entry-title">{i.title}</h3>
                        <p className="arh-entry-desc">
                          {i.description.split('\n').filter(l => l.trim()).slice(0, 2).join(' ').slice(0, 120)}...
                        </p>
                        <div className="arh-entry-footer">
                          <span className="arh-entry-result">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Realizovano
                          </span>
                          <span className="arh-entry-date">{i.date_text}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </div>

          </div>
        </section>

        {/* Zagovaranje — DYNAMIC INITIATIVES from Supabase */}
        <section className="zag-section" aria-labelledby="zag-heading">

          {/* Left — sticky image panel */}
          <div className="zag-img-panel" aria-hidden="true">
            <img
              src="/daniel-diesenreither-x9hHBvoWezA-unsplash (1).jpg"
              alt="Zvanično potpisivanje i pečatiranje dokumenata"
              className="zag-img"
              loading="lazy"
            />
            <div className="zag-img-overlay" />
            <div className="zag-img-badge">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Podnete inicijative
            </div>
          </div>

          {/* Right — content */}
          <div className="zag-content">
            <div className="zag-header zag-header--anim">
              <p className="onama-section-label">Zagovaranje</p>
              <h2 className="zag-title" id="zag-heading">
                Svaka Inicijativa —<br />
                <span className="zag-title-accent">Javno i Proverljivo</span>
              </h2>
              <p className="zag-intro">
                Objavljujemo sve podnete inicijative i dopise u vezi sa unapređenjem naselja
                Vrbovski. Svaka stavka ima status rešavanja, jer odgovorno zagovaranje znači
                i jasno praćenje rezultata.
              </p>

              {/* Status legend */}
              <div className="zag-legend">
                <span className="zag-legend-item zag-s--sent">Aktivan</span>
                <span className="zag-legend-item zag-s--done">Završen</span>
              </div>
            </div>

            {/* Initiative tracker list — DYNAMIC */}
            {loadingInit ? (
              <p style={{ padding: '2rem', color: '#999' }}>Učitavanje inicijativa...</p>
            ) : initiatives.length === 0 ? (
              <p style={{ padding: '2rem', color: '#999' }}>Još nema objavljenih inicijativa.</p>
            ) : (
              <ol className="zag-list zag-list--anim" aria-label="Tracker inicijativa">
                {initiatives.map((ini, idx) => (
                  <li key={ini.id} className="zag-item">
                    <div className="zag-item-left">
                      <time className="zag-item-date">{ini.date_text}</time>
                      <div className={`zag-item-line${idx === initiatives.length - 1 ? ' zag-item-line--last' : ''}`} aria-hidden="true" />
                    </div>
                    <Link to={`/projekti-i-aktivnosti/inicijativa/${ini.slug}`} className="zag-item-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="zag-item-head">
                        <span className={`zag-status ${ini.status === 'aktivan' ? 'zag-s--sent' : 'zag-s--done'}`}>
                          {ini.status === 'aktivan' ? 'Aktivan' : 'Završen'}
                        </span>
                        <span className="zag-item-type">Inicijativa</span>
                      </div>
                      <h3 className="zag-item-title">{ini.title}</h3>
                      <p className="zag-item-desc">
                        {ini.description.split('\n').filter(l => l.trim()).slice(0, 2).join(' ').slice(0, 180)}...
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>

        </section>

        {/* Kalendar */}
        <section className="kal-section" aria-labelledby="kal-heading">
          <div className="container">

            {/* Header */}
            <div className="kal-header kal-header--anim">
              <div className="kal-header-left">
                <p className="onama-section-label">Kalendar</p>
                <h2 className="kal-title" id="kal-heading">
                  Šta Se Dešava<br />
                  <span className="kal-title-accent">i Kada</span>
                </h2>
              </div>
              <p className="kal-intro">
                Kalendar okuplja sve najavljene projekte i inicijative u naselju Vrbovski.
                Ovde možete videti šta je planirano, šta je u pripremi i kada se očekuje
                početak novih aktivnosti.
              </p>
            </div>

            <div className="kal-body kal-body--anim">

              {/* Calendar grid — current month */}
              <CalendarGrid projects={projects} initiatives={initiatives} />

              {/* Upcoming events list — dynamic */}
              <div className="kal-events">
                <p className="kal-events-label">Predstojeće aktivnosti</p>

                <ol className="kal-events-list">
                  {(() => {
                    const upcoming = [
                      ...projects.filter(p => p.status === 'planiran').map(p => ({ type: 'projekat' as const, title: p.title, slug: p.slug, date: p.date_text, status: 'U pripremi' })),
                      ...projects.filter(p => p.status === 'aktivan').map(p => ({ type: 'projekat' as const, title: p.title, slug: p.slug, date: p.date_text, status: 'Aktivan' })),
                      ...initiatives.filter(i => i.status === 'aktivan').map(i => ({ type: 'inicijativa' as const, title: i.title, slug: i.slug, date: i.date_text, status: 'Aktivan' })),
                    ]
                    if (upcoming.length === 0) return <li className="kal-event"><div className="kal-event-body"><p>Nema najavljenih aktivnosti.</p></div></li>
                    return upcoming.map((item, idx) => {
                      const isPlanned = item.status === 'U pripremi'
                      return (
                        <li key={idx} className={`kal-event ${isPlanned ? 'kal-event--sastanak' : 'kal-event--akcija'}`}>
                          <Link to={`/projekti-i-aktivnosti/${item.type === 'projekat' ? 'projekat' : 'inicijativa'}/${item.slug}`} className="kal-event-link">
                            <div className="kal-event-date">
                              <span className="kal-event-day" style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                                {isPlanned ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                )}
                              </span>
                              {item.date && <span className="kal-event-mon">{item.date}</span>}
                            </div>
                            <div className="kal-event-body">
                              <span className="kal-event-type">{item.type === 'projekat' ? 'Projekat' : 'Inicijativa'}</span>
                              <h3 className="kal-event-title">{item.title}</h3>
                              <p className="kal-event-meta">
                                <span className={`kal-status-badge ${isPlanned ? 'kal-status-badge--planned' : 'kal-status-badge--active'}`}>
                                  {item.status}
                                </span>
                              </p>
                            </div>
                            <span className="kal-event-cta">Detaljnije</span>
                          </Link>
                        </li>
                      )
                    })
                  })()}
                </ol>

                <p className="kal-events-note">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Kalendar se automatski ažurira na osnovu podataka iz baze
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  )
}

const MONTH_NAMES = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']

function CalendarGrid({ projects, initiatives }: { projects: Project[]; initiatives: Initiative[] }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

  const firstDay = new Date(year, month, 1).getDay()
  const emptyCells = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDay = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1

  const planned = [
    ...projects.filter(p => p.status === 'planiran').map(p => p.title),
    ...initiatives.filter(i => i.status === 'aktivan').map(i => i.title),
  ]
  const hasUpcoming = planned.length > 0

  function prev() { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  function next() { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div className="kal-cal">
      <div className="kal-cal-nav">
        <button className="kal-nav-btn" type="button" aria-label="Prethodni mesec" onClick={prev}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="kal-cal-month">
          <span className="kal-cal-month-name">{MONTH_NAMES[month]}</span>
          <span className="kal-cal-month-year">{year}</span>
        </div>
        <button className="kal-nav-btn" type="button" aria-label="Sledeći mesec" onClick={next}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <div className="kal-cal-grid" role="grid" aria-label={`Kalendar ${MONTH_NAMES[month]} ${year}`}>
        {['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'].map(d => (
          <div key={d} className="kal-day-name" role="columnheader">{d}</div>
        ))}
        {[...Array(emptyCells)].map((_, i) => <div key={`e${i}`} className="kal-day kal-day--empty" />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1
          const isToday = day === todayDay
          return (
            <div key={day} className={`kal-day${isToday ? ' kal-day--today' : ''}`} role="gridcell">
              <span className="kal-day-num">{day}</span>
            </div>
          )
        })}
      </div>

      <div className="kal-cal-legend">
        {hasUpcoming && <span className="kal-cal-legend-item kal-cal-legend-item--sastanak">U pripremi</span>}
        <span className="kal-cal-legend-item kal-cal-legend-item--akcija">Aktivan</span>
      </div>
    </div>
  )
}
