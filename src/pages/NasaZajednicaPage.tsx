import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const GALLERY_IMAGES = [
  { src: '/galerija/zajednica-naslovna.webp', alt: 'Zajednica Vrbovski — naslovna fotografija', cls: 'gal-slot--wide' },
  { src: '/galerija/divlja-tresnja.webp', alt: 'Divlja trešnja u naselju Vrbovski', cls: 'gal-slot--tall' },
  { src: '/galerija/igraliste-za-decu.webp', alt: 'Igralište za decu u Vrbovskom', cls: '' },
  { src: '/galerija/macka.webp', alt: 'Mačka u naselju', cls: '' },
  { src: '/galerija/granje-plavo-nebo.webp', alt: 'Granje i plavo nebo iznad naselja', cls: '' },
  { src: '/galerija/duz-puta-vrb.webp', alt: 'Pogled duž puta kroz Vrbovski', cls: 'gal-slot--wide' },
  { src: '/galerija/zeleni-horizont.webp', alt: 'Zeleni horizont Vrbovskog', cls: 'gal-slot--wide' },
]

export default function NasaZajednicaPage() {
  const [lightboxSrc, setLightboxSrc] = useState('')

  useEffect(() => {
    document.title = 'Naša Zajednica: Srce Koje Pokreće Promene | Vrbovski'
  }, [])

  return (
    <>
      {/* Hero */}
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img
            src="/hero-nasa-zajednica.webp"
            alt="Klupa u prirodi — prostor za zajednicu u Vrbovskom"
            loading="eager"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                Naša Zajednica:{' '}
                <span className="highlight">Srce Koje Pokreće Promene</span>
              </h1>
            </div>
          </div>
        </div>
        <a href="#nz-sadrzaj" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>

      <main id="nz-sadrzaj">

        {/* Intro */}
        <section className="nz-intro" aria-labelledby="nz-intro-heading">

          <div className="nz-intro-left nz-intro-left--anim">
            <p className="nz-intro-label">Naša Zajednica</p>
            <h2 className="nz-intro-heading" id="nz-intro-heading">
              Ovaj<br />Prostor<br /><em>Pripada</em><br />Vama
            </h2>
            <div className="nz-intro-vert-line" aria-hidden="true" />
            <p className="nz-intro-sub">Platforma za Dijalog &amp; Aktivno Učešće</p>
          </div>

          <div className="nz-intro-right nz-intro-right--anim">
            <blockquote className="nz-intro-quote">
              <span className="nz-intro-quote-mark" aria-hidden="true">&ldquo;</span>
              <p>
                Revitalizacija naselja je nemoguća bez aktivnog učešća svakog stanara.
                Ovde se čuje vaš glas i planira naša zajednička budućnost.
              </p>
            </blockquote>

            <p className="nz-intro-body">
              Ovaj prostor pripada ljudima koji u njemu žive. „Naša zajednica" je platforma za
              dijalog, mesto gde identifikujemo probleme, ali i slavimo lokalne heroje koji
              svojim radom čuvaju duh našeg kraja.
            </p>

            <div className="nz-intro-pillars">
              <div className="nz-intro-pillar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
                <span>Dijalog</span>
              </div>
              <div className="nz-intro-pillar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <span>Lokalni Heroji</span>
              </div>
              <div className="nz-intro-pillar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                <span>Mapa Naselja</span>
              </div>
              <div className="nz-intro-pillar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                <span>Zajednička Budućnost</span>
              </div>
            </div>
          </div>

        </section>

        {/* Glas Zajednice */}
        <section className="gz-section" aria-labelledby="gz-heading">

          {/* Soft decorative blobs */}
          <div className="gz-blob gz-blob--1" aria-hidden="true" />
          <div className="gz-blob gz-blob--2" aria-hidden="true" />

          <div className="container gz-inner">

            {/* ── Left column ── */}
            <div className="gz-text-col gz-text-col--anim">
              <p className="onama-section-label">Glas Zajednice</p>
              <h2 className="gz-title" id="gz-heading">
                Vrbovski Govori<br />
                <span className="gz-title-accent">Svojim Glasom</span>
              </h2>
              <p className="gz-lead">
                Glas zajednice je mesto gde Vrbovski govori svojim glasom. Ovde možete
                učestvovati u forumu i anketama, predložiti ideje, prijaviti problem i
                oceniti prioritete za revitalizaciju naselja.
              </p>
              <p className="gz-body">
                Svaki komentar i predlog pomaže da odluke budu realne, a rešenja usklađena
                sa onim što je ljudima zaista potrebno. Uključite se — recite šta treba
                menjati, šta već funkcioniše i šta je najhitnije. Zajedno pravimo plan koji
                ima smisla za svakog člana zajednice i naš kraj.
              </p>

              {/* 4 action chips */}
              <div className="gz-actions">
                <Link to="/nasa-zajednica/forum" className="gz-action-item gz-action-item--link">
                  <div className="gz-action-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="gz-action-title">Forum</strong>
                    <p className="gz-action-desc">Otvorena rasprava o temama koje su bitne za naše naselje.</p>
                  </div>
                </Link>

                <Link to="/nasa-zajednica/ankete" className="gz-action-item gz-action-item--link">
                  <div className="gz-action-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <strong className="gz-action-title">Ankete</strong>
                    <p className="gz-action-desc">Recite nam koji su prioriteti za revitalizaciju po vašem mišljenju.</p>
                  </div>
                </Link>

                <Link to="/nasa-zajednica/zid/predlozi" className="gz-action-item gz-action-item--link">
                  <div className="gz-action-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="gz-action-title">Predlozi Ideja</strong>
                    <p className="gz-action-desc">Imate ideju za poboljšanje? Podelite je sa zajednicom.</p>
                  </div>
                </Link>

                <Link to="/nasa-zajednica/zid/problemi" className="gz-action-item gz-action-item--link">
                  <div className="gz-action-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="gz-action-title">Prijava Problema</strong>
                    <p className="gz-action-desc">Prijavite infrastrukturne, ekološke ili komunalne probleme.</p>
                  </div>
                </Link>
              </div>

              {/* CTA buttons */}
              <div className="gz-cta-row">
                <Link to="/nasa-zajednica/forum" className="btn btn-primary gz-btn">
                  Otvorite Forum
                </Link>
                <Link to="/nasa-zajednica/zid/predlozi" className="btn gz-btn-outline">
                  Predložite Ideju
                </Link>
              </div>
            </div>

            {/* ── Right column — image ── */}
            <div className="gz-img-col gz-img-col--anim">
              <div className="gz-img-frame">
                <img
                  src="/pexels-ketut-subiyanto-4962985.webp"
                  alt="Komšije u razgovoru — zajednička diskusija o budućnosti naselja"
                  className="gz-img"
                  loading="lazy"
                />
                <div className="gz-img-badge" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Zajedno Odlučujemo</span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="gz-stats">
                <div className="gz-stat">
                  <span className="gz-stat-num">4</span>
                  <span className="gz-stat-label">kanala učešća</span>
                </div>
                <div className="gz-stat-divider" aria-hidden="true" />
                <div className="gz-stat">
                  <span className="gz-stat-num">∞</span>
                  <span className="gz-stat-label">vaših ideja</span>
                </div>
                <div className="gz-stat-divider" aria-hidden="true" />
                <div className="gz-stat">
                  <span className="gz-stat-num">1</span>
                  <span className="gz-stat-label">zajednica</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Mapa Naselja */}
        <section className="mn-section" aria-labelledby="mn-heading">
          <div className="container">

            {/* Header */}
            <div className="mn-header mn-header--anim">
              <div className="mn-header-text">
                <p className="onama-section-label">Mapa Naselja</p>
                <h2 className="mn-title" id="mn-heading">
                  Pregled Prioriteta<br />
                  <span className="mn-title-accent">Na Terenu</span>
                </h2>
              </div>
              <p className="mn-intro">
                Mapa naselja Vrbovski prikazuje ključne tačke koje traže hitnu intervenciju,
                kao i lokacije sa potencijalom za unapređenje. Obeležavamo problematična mesta
                (bezbednost, pristup, čistoća, infrastruktura) i prostore koji mogu postati
                kvalitetniji javni sadržaji. Cilj mape je da svi imamo jasan pregled prioriteta
                i da revitalizaciju planiramo transparentno — korak po korak, na osnovu stvarnih
                potreba na terenu.
              </p>
            </div>

            {/* Legend */}
            <div className="mn-legend mn-legend--anim">
              <div className="mn-legend-item">
                <span className="mn-legend-dot mn-legend-dot--urgent" aria-hidden="true" />
                Hitna intervencija
              </div>
              <div className="mn-legend-item">
                <span className="mn-legend-dot mn-legend-dot--potential" aria-hidden="true" />
                Potencijal za unapređenje
              </div>
              <div className="mn-legend-item">
                <span className="mn-legend-dot mn-legend-dot--done" aria-hidden="true" />
                Realizovano
              </div>
            </div>

            {/* Interactive MapHub map */}
            <div className="mn-map-wrap mn-map-wrap--anim">
              <div className="mn-map-iframe-container">
                <iframe
                  src="https://maphub.net/embed_h/8FRa7xLVihjTDUmJ?panel=1&panel_closed=1&legend=1"
                  title="Interaktivna mapa naselja Vrbovski"
                  allowFullScreen
                />
              </div>
            </div>

          </div>
        </section>

        {/* Lokalni Heroji */}
        <section className="lh-section" aria-labelledby="lh-heading">

          {/* Full-bleed image panel */}
          <div className="lh-img-panel" aria-hidden="true">
            <img
              src="/mary-jane-duford-1PGXH4VCwu4-unsplash (1).jpg"
              alt="Stanovnica Vrbovskog u bašti — briga o zajedničkom prostoru"
              className="lh-img"
              loading="lazy"
            />
            <div className="lh-img-vignette" />
          </div>

          {/* Content panel */}
          <div className="lh-content-panel">

            <div className="lh-inner">
              <p className="lh-label">Lokalni Heroji</p>

              {/* Pull quote deco */}
              <div className="lh-quote-mark" aria-hidden="true">&ldquo;</div>

              <h2 className="lh-title" id="lh-heading">
                Tihi Čuvari<br />Duha Mesta
              </h2>

              <p className="lh-lead">
                Lokalni heroji su ljudi koji svakog dana, često tiho i bez velike priče,
                čuvaju duh našeg mesta. To su zanatlije, komšije i porodice koje popravljaju,
                uređuju, sade, pomažu drugima i održavaju ono što Vrbovski čini živim.
              </p>

              <p className="lh-body">
                U ovoj sekciji delimo njihove priče — kako rade, šta ih motiviše i kako
                svojim primerom pokazuju da se naselje ne obnavlja samo projektima, već
                i ljudima.
              </p>

              {/* Feature chips */}
              <div className="lh-chips">
                <span className="lh-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Zanatlije &amp; Komšije
                </span>
                <span className="lh-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                  Čuvari Zajednice
                </span>
                <span className="lh-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Živi Primeri
                </span>
              </div>

              {/* Divider */}
              <div className="lh-divider" aria-hidden="true" />

              {/* Nominate CTA */}
              <div className="lh-nominate">
                <p className="lh-nominate-text">
                  Znate nekoga ko zaslužuje da se istakne?
                </p>
                <a href="mailto:administrator3@izorv.org?subject=Predlog%20heroja%20zajednice" className="lh-nominate-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Predložite Heroja
                </a>
                <p className="lh-coming-soon">Kontakt: administrator3@izorv.org</p>
              </div>
            </div>

          </div>
        </section>

        {/* Galerija */}
        <section className="gal-section" aria-labelledby="gal-heading">
          <div className="container">

            {/* Header */}
            <div className="gal-header gal-header--anim">
              <p className="onama-section-label">Galerija</p>
              <h2 className="gal-title" id="gal-heading">
                Trenuci Koji<br />
                <span className="gal-title-accent">Čine Naselje Živim</span>
              </h2>
              <p className="gal-intro">
                Galerija okuplja autentične fotografije naselja Vrbovski i događaja koji ga čine živim.
                Ovde beležimo svakodnevne trenutke, promene na terenu, akcije uređenja, zajednička
                okupljanja i ljude koji doprinose da se duh zajednice sačuva. Fotografije nisu samo
                uspomene — one su i dokaz napretka, inspiracija i podsetnik da se naselje gradi
                zajedno, korak po korak.
              </p>
            </div>

            {/* Gallery grid */}
            <div className="gal-grid gal-grid--anim">
              {GALLERY_IMAGES.map((img, i) => (
                <button key={i} className={`gal-slot ${img.cls}`} onClick={() => setLightboxSrc(img.src)}>
                  <div className="gal-slot-inner">
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </div>
                </button>
              ))}
            </div>

          </div>
        </section>

      </main>

      {lightboxSrc && (
        <div className="fp-lightbox" onClick={() => setLightboxSrc('')}>
          <button className="fp-lightbox-close" onClick={() => setLightboxSrc('')}>&times;</button>
          <img src={lightboxSrc} alt="Uvećana fotografija" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
