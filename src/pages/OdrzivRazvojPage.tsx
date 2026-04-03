import { useEffect } from 'react'
import CitizenGuide from '../components/CitizenGuide'
import ResourcesSection from '../components/ResourcesSection'

export default function OdrzivRazvojPage() {
  useEffect(() => {
    document.title = 'Održivi Razvoj: Globalni Standardi za Naše Naselje | Vrbovski'
  }, [])

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img
            src="/IMG_20260227_121359  foto za hero.webp"
            alt="Održivi razvoj - Vrbovski"
            loading="eager"
            style={{ objectPosition: 'center 80%' }}
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                Održivi Razvoj:{' '}
                <span className="highlight">Globalni Standardi za Naše Naselje</span>
              </h1>
            </div>
          </div>
        </div>
        <a href="#odrzivi-razvoj-sadrzaj" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>

      <main id="odrzivi-razvoj-sadrzaj">

        {/* Intro / Overview Section */}
        <section className="or-intro-section" aria-labelledby="or-intro-heading">

          <div className="or-intro-bg-deco" aria-hidden="true">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1.5"/>
              <ellipse cx="200" cy="200" rx="75" ry="180" stroke="currentColor" strokeWidth="1"/>
              <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="1"/>
              <line x1="48" y1="110" x2="352" y2="110" stroke="currentColor" strokeWidth="0.8"/>
              <line x1="48" y1="290" x2="352" y2="290" stroke="currentColor" strokeWidth="0.8"/>
            </svg>
          </div>

          <div className="container">

            {/* Top row: label left, sub right */}
            <div className="or-intro-toprow or-intro-toprow--anim">
              <p className="onama-section-label">Strateški Okvir</p>
              <p className="or-intro-sub">UN Agenda 2030 &amp; Zelena Agenda EU</p>
            </div>

            {/* Centered mega-heading */}
            <h2 className="or-intro-heading or-intro-heading--anim" id="or-intro-heading">
              Održivost <em>kao</em> Strategija
            </h2>

            {/* Decorative divider */}
            <div className="or-intro-divider or-intro-divider--anim" aria-hidden="true">
              <span className="or-intro-divider-line"></span>
              <span className="or-intro-divider-diamond"></span>
              <span className="or-intro-divider-line"></span>
            </div>

            {/* Two-column text + tags */}
            <div className="or-intro-body-grid or-intro-body-grid--anim">
              <div className="or-intro-col">
                <p className="or-intro-body">
                  Održivost nije samo ekološki trend, već strateški okvir za opstanak lokalnih
                  zajednica. Naša strategija se direktno oslanja na UN Agendu 2030 i Zelenu
                  agendu Evropske unije, prilagođavajući globalne ciljeve specifičnim potrebama
                  našeg naselja.
                </p>
                <p className="or-intro-body">
                  Svaki projekat i svaka inicijativa proishode iz tog okvira —
                  merljivi, transparentni i usmereni na konkretan napredak.
                </p>
              </div>
              <div className="or-intro-col">
                <p className="or-intro-body">
                  Ovde istražujemo kako klimatska otpornost i cirkularna ekonomija prestaju
                  biti apstraktni pojmovi i postaju konkretni alati za bolji svakodnevni
                  život u Vrbovskom. Globalnim standardima dajemo lokalni smisao.
                </p>
                <div className="or-intro-tags">
                  <span className="or-intro-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    UN Agenda 2030
                  </span>
                  <span className="or-intro-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    Zelena Agenda EU
                  </span>
                  <span className="or-intro-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                    Klimatska Otpornost
                  </span>
                  <span className="or-intro-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Cirkularna Ekonomija
                  </span>
                  <span className="or-intro-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8L3 21" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                    Agenda 2030 u Republici Srbiji
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Agenda 2030 Section */}
        <section className="agenda-section" aria-labelledby="agenda-heading">

          {/* Background watermark */}
          <span className="agenda-watermark" aria-hidden="true">2030</span>

          <div className="container">

            {/* Header + intro split */}
            <div className="agenda-intro-split agenda-header--anim">
              <div className="agenda-intro-left">
                <p className="onama-section-label">UN Agenda 2030</p>
                <h2 className="agenda-title" id="agenda-heading">
                  Globalni Ciljevi,<br />Lokalna Rešenja
                </h2>
                <p className="agenda-lead">
                  U Vrbovskom primenjujemo UN ciljeve (Agenda 2030) tako što ih prevodimo u
                  konkretna rešenja za lokalne probleme. Fokus nam je na održivoj revitalizaciji
                  naselja — UN ciljevi su naš okvir, a rezultat su merljive, realne promene koje
                  direktno podižu kvalitet života u naselju.
                </p>
              </div>
              <div className="agenda-intro-right">
                <img
                  src="/za un agendu.webp"
                  alt="Ilustracija za UN Agendu 2030"
                  className="agenda-sdg-img"
                />
              </div>
            </div>

            {/* 4 focus pillars */}
            <div className="agenda-pillars">

              <article className="agenda-pillar agenda-pillar--anim" style={{ '--p-delay': '0.1s' } as React.CSSProperties}>
                <div className="agenda-pillar-top">
                  <span className="agenda-pillar-num">01</span>
                  <div className="agenda-pillar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
                <h3 className="agenda-pillar-title">Javni Prostori</h3>
                <p className="agenda-pillar-text">
                  Uređenje i bezbednost javnih prostora — pristupačnost, osvetljenje i sigurnost za sve stanovnike.
                </p>
              </article>

              <article className="agenda-pillar agenda-pillar--anim" style={{ '--p-delay': '0.22s' } as React.CSSProperties}>
                <div className="agenda-pillar-top">
                  <span className="agenda-pillar-num">02</span>
                  <div className="agenda-pillar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <h3 className="agenda-pillar-title">Zelenilo & Klima</h3>
                <p className="agenda-pillar-text">
                  Više zelenila i otpornost na vrućine — zeleni pojasevi, hlad i klimatska adaptacija naselja.
                </p>
              </article>

              <article className="agenda-pillar agenda-pillar--anim" style={{ '--p-delay': '0.34s' } as React.CSSProperties}>
                <div className="agenda-pillar-top">
                  <span className="agenda-pillar-num">03</span>
                  <div className="agenda-pillar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                <h3 className="agenda-pillar-title">Otpad & Čistoća</h3>
                <p className="agenda-pillar-text">
                  Bolje upravljanje otpadom i čistoćom — reciklaža, separatno odlaganje i čisto javno okruženje.
                </p>
              </article>

              <article className="agenda-pillar agenda-pillar--anim" style={{ '--p-delay': '0.46s' } as React.CSSProperties}>
                <div className="agenda-pillar-top">
                  <span className="agenda-pillar-num">04</span>
                  <div className="agenda-pillar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="agenda-pillar-title">Zajednica</h3>
                <p className="agenda-pillar-text">
                  Uključivanje zajednice u odlučivanje kroz ankete, javne izveštaje i otvoreni dijalog.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* Zelena Agenda EU — split panel section */}
        <section className="eu-section" aria-labelledby="eu-heading">

          {/* Left dark zone */}
          <div className="eu-left eu-left--anim">
            <p className="onama-section-label eu-label">Zelena Agenda EU</p>
            <h2 className="eu-title" id="eu-heading">
              Evropski<br />Zeleni<br />Dogovor
            </h2>
            <div className="eu-stars" aria-hidden="true">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="eu-star"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-38px)`,
                  } as React.CSSProperties}
                >★</span>
              ))}
            </div>
            <p className="eu-tagline">
              Smernice i standardi za lokalni oporavak
            </p>
          </div>

          {/* Center content zone */}
          <div className="eu-right eu-right--anim">
            <p className="eu-body">
              Oporavak i revitalizacija naselja Vrbovski direktno su povezani sa principima
              Evropskog zelenog dogovora: manje zagađenja, efikasnije korišćenje resursa i
              zdraviji životni prostor. Kroz ovaj okvir, obnova naselja ne znači samo
              sređivanje izgleda, već stvaranje dugoročno održivog sistema.
            </p>
            <p className="eu-body">
              Evropski zeleni
              dogovor nam daje smernice i standarde, a lokalni oporavak pretvara te ciljeve
              u konkretne korake koji Vrbovski čine čistijim, otpornijim i funkcionalnijim
              za sve koji u njemu žive.
            </p>

            <div className="eu-benefits">

              <div className="eu-benefit">
                <div className="eu-benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <strong>Zelene površine i hlad</strong>
                  <p>Više zelenila, hlada i prirodnih tampon zona u javnom prostoru</p>
                </div>
              </div>

              <div className="eu-benefit">
                <div className="eu-benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <strong>Energetska efikasnost</strong>
                  <p>Efikasnija rasveta, objekti i infrastruktura sa manjim otiskom potrošnje</p>
                </div>
              </div>

              <div className="eu-benefit">
                <div className="eu-benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <strong>Pametno upravljanje otpadom</strong>
                  <p>Separatno odlaganje, reciklaža i smanjenje zagađenja u svakodnevnom životu</p>
                </div>
              </div>

              <div className="eu-benefit">
                <div className="eu-benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <strong>Otpornost na klimatske ekstreme</strong>
                  <p>Rešenja koja smanjuju posledice vrućina, poplava i vremenskih ekstrema</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right image panel */}
          <div className="eu-img-panel eu-img-panel--anim">
            <div className="eu-img-fade" aria-hidden="true" />
            <img
              src="/chelsea-WvusC5M-TM8-unsplash (1).jpg"
              alt="Solarna elektrana – niz solarnih panela u polju"
              className="eu-img"
              loading="lazy"
            />
            <div className="eu-img-caption">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Energetska obnova u akciji
            </div>
          </div>

        </section>

        <CitizenGuide />

        <ResourcesSection />

      </main>
    </>
  )
}
