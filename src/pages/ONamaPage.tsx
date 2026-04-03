import { useEffect } from 'react'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import TransparencySection from '../components/TransparencySection'

export default function ONamaPage() {
  useScrollAnimations()

  useEffect(() => {
    document.title = 'O Nama: Temelji Naše Zajednice | Vrbovski'
  }, [])

  return (
    <>
      {/* Hero Section */}
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img
            src="/IMG_20250915_113926.webp"
            alt="O Nama - Inicijativa za Održivi Razvoj Vrbovskog"
            loading="eager"
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                O Nama: <span className="highlight">Temelji Naše Zajednice</span>
              </h1>
            </div>
          </div>
        </div>
        <a href="#o-nama-sadrzaj" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>

      {/* Main Content */}
      <main id="o-nama-sadrzaj">

        {/* Intro Section */}
        <section className="onama-intro" aria-labelledby="onama-intro-heading">
          <div className="container">
            <div className="onama-intro-grid">

              {/* Left — text */}
              <div className="onama-intro-text onama-intro-text--anim">
                <p className="onama-section-label">Ko smo mi</p>
                <div className="onama-quote-deco" aria-hidden="true">&ldquo;</div>
                <p className="onama-lead">
                  Udruženje Inicijativa za održivi razvoj Vrbovskog nastalo je iz potrebe da
                  degradaciju našeg naselja zaustavimo znanjem i stručnošću. Mi smo tim
                  entuzijasta, stručnjaka i komšija koji veruju da tranzicioni ožiljci mogu
                  postati simboli novog početka.
                </p>
                <p className="onama-lead">
                  Vođeni principima transparentnosti i etike,
                  gradimo organizaciju koja je pouzdan partner građanima i institucijama u
                  stvaranju održivog prostora za život.
                </p>
                <div className="onama-divider" aria-hidden="true">
                  <span className="onama-divider-dot"></span>
                  <span className="onama-divider-line"></span>
                  <span className="onama-divider-dot"></span>
                  <span className="onama-divider-line"></span>
                  <span className="onama-divider-dot"></span>
                </div>
                <p className="onama-body">
                  Kroz konkretne projekte, edukaciju i saradnju sa lokalnom zajednicom, radimo
                  na rešenjima koja dugoročno unapređuju kvalitet života i čuvaju prirodne
                  resurse. Verujemo da promene počinju u komšiluku — i pozivamo sve koji dele
                  ovu viziju da nam se pridruže.
                </p>
              </div>

              {/* Right — pillars */}
              <div className="onama-pillars onama-pillars--anim">
                <article className="onama-pillar-card">
                  <div className="onama-pillar-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="onama-pillar-title">Transparentnost & Etika</h3>
                    <p className="onama-pillar-desc">
                      Otvorena komunikacija i etično delovanje u svakom koraku — prema građanima,
                      institucijama i partnerima.
                    </p>
                  </div>
                </article>

                <article className="onama-pillar-card">
                  <div className="onama-pillar-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="onama-pillar-title">Znanje & Stručnost</h3>
                    <p className="onama-pillar-desc">
                      Rešenja zasnovana na struci, istraživanju i lokalnom poznavanju
                      zajednice — ne na pretpostavkama.
                    </p>
                  </div>
                </article>

                <article className="onama-pillar-card">
                  <div className="onama-pillar-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="onama-pillar-title">Zajednica</h3>
                    <p className="onama-pillar-desc">
                      Svi zajedno — građani, institucije i partneri — za bolji prostor
                      za život. Promene počinju u komšiluku.
                    </p>
                  </div>
                </article>
              </div>

            </div>
          </div>
        </section>

        {/* Misija & Vizija Photo */}
        <div className="onama-mv-photo">
          <img
            src="/misija-vizija.webp"
            alt="Misija i vizija Inicijative za održivi razvoj Vrbovskog"
            className="onama-mv-photo-img"
            loading="lazy"
          />
        </div>

        {/* Misija & Vizija Section */}
        <section className="onama-mv-section" aria-labelledby="onama-mv-heading">
          <div className="container">
            <div className="onama-mv-grid">

              {/* Misija */}
              <div className="onama-mv-block onama-mv-block--left">
                <span className="onama-mv-num" aria-hidden="true">01</span>
                <div className="onama-mv-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <p className="onama-mv-label">Misija</p>
                <h2 className="onama-mv-title" id="onama-mv-heading">
                  Vodimo održivu<br />revitalizaciju naselja
                </h2>
                <p className="onama-mv-text">
                  Naša misija je da vodimo održivu revitalizaciju naselja kroz UN ciljeve i EU
                  standarde, pretvarajući postojeće prostore u zdravije, funkcionalnije i
                  sigurnije okruženje za ljude. Kroz plansku obnovu, pametno korišćenje resursa
                  i jasnu usklađenost sa EU standardima, stvaramo rešenja koja donose konkretne
                  i merljive koristi zajednici.
                </p>
                <p className="onama-mv-text">
                  UN ciljevi su naš okvir za dugoročan uticaj — od unapređenja kvaliteta života
                  i javnih prostora, do zaštite životne sredine i jačanja lokalnih potencijala.
                </p>
                <div className="onama-mv-tags">
                  <span className="onama-mv-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    UN Ciljevi 2030
                  </span>
                  <span className="onama-mv-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    EU Standardi
                  </span>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="onama-mv-divider" aria-hidden="true">
                <div className="onama-mv-divider-line"></div>
                <div className="onama-mv-divider-diamond"></div>
                <div className="onama-mv-divider-line"></div>
              </div>

              {/* Vizija */}
              <div className="onama-mv-block onama-mv-block--right">
                <span className="onama-mv-num" aria-hidden="true">02</span>
                <div className="onama-mv-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="onama-mv-label">Vizija</p>
                <h2 className="onama-mv-title">
                  Naselje koje raste<br />sistemski i odgovorno
                </h2>
                <p className="onama-mv-text">
                  Naša vizija je naselje koje se razvija održivo, sistemski i odgovorno — u
                  skladu sa UN ciljevima i po EU standardima. Težimo zajednicama u kojima je
                  obnova više od estetike: ona podiže kvalitet života, povezuje ljude i čini
                  prostor otpornijim na buduće izazove.
                </p>
                <p className="onama-mv-text">
                  Verujemo da revitalizacija naselja kroz UN ciljeve i EU standarde postavlja
                  temelje za stabilan razvoj, poverenje građana i trajnu vrednost za generacije
                  koje dolaze.
                </p>
                <div className="onama-mv-tags">
                  <span className="onama-mv-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Dugoročan razvoj
                  </span>
                  <span className="onama-mv-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    Za buduće generacije
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Naš Tim Section */}
        <section className="onama-tim-section" aria-labelledby="onama-tim-heading">
          <div className="container">

            <div className="onama-tim-header onama-tim-header--anim">
              <p className="onama-section-label">Naš Tim</p>
              <h2 className="section-title" id="onama-tim-heading">
                Ljudi Koji Stoje Iza Inicijative
              </h2>
              <p className="section-description onama-tim-desc">
                Naš tim funkcioniše kroz tri međusobno povezane uloge: koordinaciju projekata,
                unapređenje životne sredine i odnose sa zajednicom. Svaka funkcija doprinosi celini,
                obezbeđujući da inicijativa ostane usmerena na kvalitet prostora, institucionalnu
                saradnju i potrebe građana.
              </p>
            </div>

            <div className="onama-tim-grid onama-tim-grid--3">

              {/* Dr. Dušan Dabović — prvi */}
              <article className="onama-tim-card onama-tim-card--anim" style={{ '--card-delay': '0.1s' } as React.CSSProperties}>
                <div className="onama-tim-card-img">
                  <img src="/photo  dusan.webp" alt="Dr. Dušan Dabović" loading="lazy" />
                </div>
                <div className="onama-tim-card-body">
                  <span className="onama-tim-tag">Unapređenje životne sredine</span>
                  <h3 className="onama-tim-name">Dr. Dušan Dabović</h3>
                  <div className="onama-tim-divider"></div>
                  <p className="onama-tim-bio">Analiza stanja u zajednici, priprema predloga mera, praćenje sprovođenja aktivnosti koje doprinose zaštiti i unapređenju životne sredine, saradnja sa stručnim institucijama.</p>
                </div>
              </article>

              {/* Dragana Dabović */}
              <article className="onama-tim-card onama-tim-card--anim" style={{ '--card-delay': '0.22s' } as React.CSSProperties}>
                <div className="onama-tim-card-img">
                  <img src="/dragana.webp" alt="Dragana Dabović" loading="lazy" />
                </div>
                <div className="onama-tim-card-body">
                  <span className="onama-tim-tag">Koordinacija projekata</span>
                  <h3 className="onama-tim-name">Dragana Dabović</h3>
                  <div className="onama-tim-divider"></div>
                  <p className="onama-tim-bio">Planiranje, usklađivanje i sprovođenje projektnih aktivnosti, komunikacija sa institucijama i partnerima, praćenje realizacije i dokumentovanje procesa.</p>
                </div>
              </article>

              {/* Dragan Katić */}
              <article className="onama-tim-card onama-tim-card--anim" style={{ '--card-delay': '0.34s' } as React.CSSProperties}>
                <div className="onama-tim-card-img">
                  <img src="/20260309_185153  slika dragan.webp" alt="Dragan Katić" loading="lazy" />
                </div>
                <div className="onama-tim-card-body">
                  <span className="onama-tim-tag">Odnosi sa zajednicom</span>
                  <h3 className="onama-tim-name">Dragan Katić</h3>
                  <div className="onama-tim-divider"></div>
                  <p className="onama-tim-bio">Komunikacija sa građanima, prikupljanje potreba i predloga, organizovanje participativnih aktivnosti i jačanje saradnje između zajednice i institucija.</p>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* Istorijat Section */}
        <section className="onama-hist-section" aria-labelledby="onama-hist-heading">
          <div className="container">
            <div className="onama-hist-grid">

              {/* Left — visual timeline */}
              <div className="onama-hist-timeline onama-hist-timeline--anim" aria-hidden="true">
                <div className="onama-hist-tl-item">
                  <div className="onama-hist-tl-dot">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="onama-hist-tl-content">
                    <span className="onama-hist-tl-step">01</span>
                    <strong>Problem prepoznat</strong>
                    <p>Degradacija javnih prostora, neplanski zahvati, slabljenje infrastrukture</p>
                  </div>
                </div>

                <div className="onama-hist-tl-connector"></div>

                <div className="onama-hist-tl-item">
                  <div className="onama-hist-tl-dot">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div className="onama-hist-tl-content">
                    <span className="onama-hist-tl-step">02</span>
                    <strong>Istraživanje i analiza</strong>
                    <p>Razgovori sa stanovnicima, terenska analiza i primeri dobre prakse</p>
                  </div>
                </div>

                <div className="onama-hist-tl-connector"></div>

                <div className="onama-hist-tl-item">
                  <div className="onama-hist-tl-dot">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="onama-hist-tl-content">
                    <span className="onama-hist-tl-step">03</span>
                    <strong>Udruženje osnovano</strong>
                    <p>Stručnjaci različitih profila, UN ciljevi i EU standardi kao temelj</p>
                  </div>
                </div>
              </div>

              {/* Right — full narrative */}
              <div className="onama-hist-text onama-hist-text--anim">
                <p className="onama-section-label">Istorijat</p>
                <h2 className="onama-hist-title" id="onama-hist-heading">
                  Kako Je Sve<br />Počelo
                </h2>
                <p className="onama-hist-body">
                  Sve je počelo jednostavnim, ali upornim uočavanjem istog problema na više mesta:
                  naselja se menjaju, ali ne napreduju. Vremenom su se tragovi degradacije postajali
                  vidljiviji — zapušteni javni prostori, neplanski zahvati, slabljenje infrastrukture
                  i osećaj da zajednica gubi kvalitet života. Ta početna zapažanja pretvorila su se u
                  pitanje: kako da revitalizacija ne bude sporadična i kratkoročna, već sistemska
                  i održiva?
                </p>
                <p className="onama-hist-body">
                  Kroz razgovore sa stanovnicima, terenski rad i analizu primera dobre prakse,
                  formirala se jasna potreba za stručnim okvirom koji povezuje ljude, znanje i
                  standarde. Upravo taj put — od prepoznavanja degradacije naselja do potrebe za
                  konkretnim rešenjima — doveo je do okupljanja profesionalaca različitih profila
                  i osnivanja stručnog udruženja.
                </p>
                <p className="onama-hist-body">
                  Udruženje je nastalo sa ciljem da kroz saradnju,
                  edukaciju i primenu UN ciljeva i EU standarda doprinese održivoj revitalizaciji
                  naselja i vraćanju vrednosti prostoru i zajednici.
                </p>
                <div className="onama-hist-img-wrap">
                  <img
            src="/istorijat-compressed.webp"
            alt="Osnivanje udruženja, avgust 2025."
                    className="onama-hist-img"
                    loading="lazy"
                  />
                  <span className="onama-hist-img-caption">Osnivanje udruženja, avgust 2025.</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <TransparencySection
          statutUrl="https://apr.gov.rs/%d0%bf%d0%be%d1%87%d0%b5%d1%82%d0%bd%d0%b0.3.html"
          izvestajiUrl="https://apr.gov.rs/%d0%bf%d0%be%d1%87%d0%b5%d1%82%d0%bd%d0%b0.3.html"
        />

      </main>
    </>
  )
}
