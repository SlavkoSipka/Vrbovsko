import { useEffect, useState } from 'react'
import { supabase, type Partner, type Fond } from '../lib/supabase'

const CONTACT_EMAIL = 'administrator3@izorv.org'

function FondoviSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [fondovi, setFondovi] = useState<Fond[]>([])

  useEffect(() => {
    supabase.from('fondovi').select('*').eq('visible', true).order('sort_order')
      .then(({ data }) => setFondovi(data ?? []))
  }, [])

  const toggle = (i: number) => {
    setOpenIdx(prev => (prev === i ? null : i))
  }

  if (fondovi.length === 0) return null

  return (
    <section className="fo-section" aria-labelledby="fo-heading">
      <div className="container">

        <div className="fo-header">
          <div className="fo-header-left">
            <p className="onama-section-label fo-label">Fondovi</p>
            <h2 className="fo-title" id="fo-heading">
              Međunarodni Fondovi &amp;<br /><em>Programi Podrške</em>
            </h2>
          </div>
          <div className="fo-header-right">
            <p className="fo-lead">
              Pratimo prilike koje su usklađene sa našom vizijom — od zelenih inicijativa
              i klimatske otpornosti, do unapređenja javnih prostora, participacije građana
              i jačanja lokalnih kapaciteta. Cilj nam je da na jednom mestu objedinimo
              relevantne izvore finansiranja, uz kratka objašnjenja uslova i načina prijave.
            </p>
          </div>
        </div>

        <div className="fo-tags" aria-label="Oblasti finansiranja">
          {['Zelene Inicijative','Klimatska Otpornost','Javni Prostori','Participacija Građana','Lokalni Kapaciteti','Transparentnost'].map(tag => (
            <span key={tag} className="fo-tag">{tag}</span>
          ))}
        </div>

        <div className="fo-accordion">
          {fondovi.map((f, i) => (
            <div
              key={f.id}
              className={`fo-acc-item${openIdx === i ? ' fo-acc-item--open' : ''}`}
            >
              <button
                className="fo-acc-header"
                onClick={() => toggle(i)}
                aria-expanded={openIdx === i}
              >
                <span className="fo-acc-label">{f.name}</span>
                <svg
                  className="fo-acc-chevron"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="fo-acc-body">
                <p>{f.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default function SaradnjaPartneriPage() {
  const [partners, setPartners] = useState<Partner[]>([])

  useEffect(() => {
    document.title = 'Saradnja i Partneri: Mreža Za Budućnost | Vrbovski'
    supabase.from('partners').select('*').eq('visible', true).order('sort_order')
      .then(({ data }) => setPartners(data ?? []))
  }, [])

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img
            src="/galerija/saradnja-partneri-hero-asfalt.webp"
            alt="Asfaltirana površina u naselju Vrbovski"
            loading="eager"
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                Saradnja i Partneri:{' '}
                <span className="highlight">Mreža Za Budućnost</span>
              </h1>
            </div>
          </div>
        </div>
        <a href="#sp-sadrzaj" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>

      <main id="sp-sadrzaj">

        {/* Intro */}
        <section className="sp-intro" aria-labelledby="sp-intro-heading">

          {/* Background network SVG */}
          <div className="sp-intro-net" aria-hidden="true">
            <svg viewBox="0 0 900 500" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <circle cx="140" cy="120" r="5" fill="currentColor" opacity="0.4"/>
              <circle cx="450" cy="60"  r="5" fill="currentColor" opacity="0.4"/>
              <circle cx="760" cy="120" r="5" fill="currentColor" opacity="0.4"/>
              <circle cx="140" cy="380" r="5" fill="currentColor" opacity="0.4"/>
              <circle cx="760" cy="380" r="5" fill="currentColor" opacity="0.4"/>
              <circle cx="300" cy="250" r="3" fill="currentColor" opacity="0.25"/>
              <circle cx="600" cy="250" r="3" fill="currentColor" opacity="0.25"/>
              <circle cx="450" cy="440" r="3" fill="currentColor" opacity="0.25"/>
              <line x1="140" y1="120" x2="450" y2="60"  stroke="currentColor" strokeWidth="1" opacity="0.15"/>
              <line x1="450" y1="60"  x2="760" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
              <line x1="140" y1="120" x2="140" y2="380" stroke="currentColor" strokeWidth="1" opacity="0.12"/>
              <line x1="760" y1="120" x2="760" y2="380" stroke="currentColor" strokeWidth="1" opacity="0.12"/>
              <line x1="140" y1="380" x2="450" y2="440" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
              <line x1="760" y1="380" x2="450" y2="440" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
              <line x1="140" y1="120" x2="300" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.12"/>
              <line x1="450" y1="60"  x2="300" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              <line x1="450" y1="60"  x2="600" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              <line x1="760" y1="120" x2="600" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.12"/>
              <line x1="300" y1="250" x2="600" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              <line x1="300" y1="250" x2="450" y2="440" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              <line x1="600" y1="250" x2="450" y2="440" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
            </svg>
          </div>

          <div className="sp-intro-inner">

            {/* Label */}
            <p className="sp-intro-label sp-intro-label--anim">Saradnja i Partneri</p>

            {/* Big blockquote */}
            <figure className="sp-intro-quote sp-intro-quote--anim">
              <span className="sp-intro-qmark" aria-hidden="true">&ldquo;</span>
              <blockquote id="sp-intro-heading">
                <p className="sp-intro-qtext">
                  Revitalizacija degradiranog naselja je poduhvat koji prevazilazi snagu
                  pojedinca. Zato gradimo snažnu mrežu saradnje sa akademskom zajednicom,
                  stručnim institucijama, javnim preduzećima i odgovornim kompanijama.
                </p>
                <p className="sp-intro-qtext sp-intro-qtext--accent">
                  Verujemo u sinergiju nauke i prakse, težeći da postanemo spona između
                  najviših državnih institucija i realnih potreba ljudi na terenu.
                </p>
              </blockquote>
            </figure>

            {/* 4 partner nodes */}
            <div className="sp-intro-nodes sp-intro-nodes--anim" aria-label="Tipovi partnera">

              <div className="sp-intro-node">
                <div className="sp-intro-node-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  </svg>
                </div>
                <h3 className="sp-intro-node-title">Akademska<br />Zajednica</h3>
                <div className="sp-intro-node-line" aria-hidden="true" />
              </div>

              <div className="sp-intro-node">
                <div className="sp-intro-node-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                  </svg>
                </div>
                <h3 className="sp-intro-node-title">Stručne<br />Institucije</h3>
                <div className="sp-intro-node-line" aria-hidden="true" />
              </div>

              <div className="sp-intro-node-center sp-intro-node-center--pulse" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>

              <div className="sp-intro-node">
                <div className="sp-intro-node-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h3 className="sp-intro-node-title">Javna<br />Preduzeća</h3>
                <div className="sp-intro-node-line" aria-hidden="true" />
              </div>

              <div className="sp-intro-node">
                <div className="sp-intro-node-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 className="sp-intro-node-title">Odgovorne<br />Kompanije</h3>
                <div className="sp-intro-node-line" aria-hidden="true" />
              </div>

            </div>

          </div>
        </section>

        {/* Mreža saradnje */}
        <section className="ms-section" aria-labelledby="ms-heading">

          {/* Full-bleed image with text over it on the left */}
          <div className="ms-visual ms-visual--anim">
            <div className="ms-img-wrap">
              <img
                src="/Fakultet_elektrotehnicki_u_beogradu_ulaz.jpg"
                alt="Elektrotehnički fakultet u Beogradu — akademski partner"
                className="ms-img"
                loading="lazy"
              />
              <div className="ms-img-grad" aria-hidden="true" />
            </div>
            <div className="ms-img-caption">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
              Akademski partneri
            </div>
          </div>

          {/* Content */}
          <div className="ms-content ms-content--anim">
            <p className="onama-section-label ms-label">Mreža Saradnje</p>
            <h2 className="ms-title" id="ms-heading">
              Nauka i Praksa<br />
              <span className="ms-title-accent">Kao Jedan Sistem</span>
            </h2>
            <p className="ms-lead">
              Mreža saradnje je temelj stručnog razvoja i održive revitalizacije naselja
              Vrbovski. Fakulteti i istraživačke institucije donose metodologiju, analize
              i znanje koje pomaže da se problemi na terenu sagledaju tačno — od
              infrastrukture i javnih prostora, do ekologije i kvaliteta života.
            </p>
            <p className="ms-body">
              Kroz saradnju sa akademskom zajednicom, javnim institucijama i stručnim
              organizacijama, gradimo rešenja koja nisu „ad hoc", već planirana, proverljiva
              i usklađena sa standardima. Na taj način povezujemo nauku i praksu i stvaramo
              osnovu da se razvoj naselja vodi odgovorno i dugoročno.
            </p>

            {/* 3 value pillars */}
            <div className="ms-pillars">
              <div className="ms-pillar">
                <div className="ms-pillar-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <strong className="ms-pillar-title">Metodologija</strong>
                  <p className="ms-pillar-desc">Naučni pristup analizi problema i planiranju rešenja na terenu.</p>
                </div>
              </div>
              <div className="ms-pillar">
                <div className="ms-pillar-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div>
                  <strong className="ms-pillar-title">Standardi</strong>
                  <p className="ms-pillar-desc">Usaglašenost sa domaćim i EU standardima zahvaljujući institucionalnoj podršci.</p>
                </div>
              </div>
              <div className="ms-pillar">
                <div className="ms-pillar-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                </div>
                <div>
                  <strong className="ms-pillar-title">Sinergija</strong>
                  <p className="ms-pillar-desc">Spona između državnih institucija i realnih potreba zajednice na terenu.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Lokalni Partneri */}
        <section className="lp-section" aria-labelledby="lp-heading">
          <div className="container">

            {/* Header */}
            <div className="lp-header lp-header--anim">
              <div className="lp-header-left">
                <p className="onama-section-label">Lokalni Partneri</p>
                <h2 className="lp-title" id="lp-heading">
                  Kompanije Koje Stoje<br />
                  <span className="lp-title-accent">Uz Zajednicu</span>
                </h2>
              </div>
              <p className="lp-intro">
                Lokalni partneri su kompanije iz Vrbovskog i okoline koje svojim primerom i
                podrškom doprinose održivom razvoju naselja. Kroz donacije, materijalnu pomoć,
                usluge, logistiku ili zajedničke akcije, pomažu da ideje postanu konkretni
                rezultati.
              </p>
              <p className="lp-intro">
                Verujemo da održiva revitalizacija nije moguća bez lokalne privrede
                — jer kada se udruže stanovnici zajednice, struka i odgovorne kompanije, promene postaju brže
                i dugotrajnije.
              </p>
            </div>

            {/* Support type legend */}
            <div className="lp-legend lp-legend--anim">
              <span className="lp-legend-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Donacija
              </span>
              <span className="lp-legend-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Materijal
              </span>
              <span className="lp-legend-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Usluge
              </span>
              <span className="lp-legend-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                Logistika
              </span>
              <span className="lp-legend-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Zajednička akcija
              </span>
            </div>

            {/* Logo grid */}
            <div className="lp-grid lp-grid--anim">
              {partners.length > 0 ? partners.map(p => (
                <div key={p.id} className="lp-logo-slot">
                  {p.website_url ? (
                    <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="lp-logo-inner lp-logo-inner--link" aria-label={p.name}>
                      {p.logo_url ? <img src={p.logo_url} alt={p.name} className="lp-logo-img" /> : <span>{p.name}</span>}
                    </a>
                  ) : (
                    <div className="lp-logo-inner" aria-label={p.name}>
                      {p.logo_url ? <img src={p.logo_url} alt={p.name} className="lp-logo-img" /> : <span>{p.name}</span>}
                    </div>
                  )}
                </div>
              )) : (
                [1,2,3,4].map(n => (
                  <div key={n} className="lp-logo-slot">
                    <div className="lp-logo-inner" aria-label={`Partner ${n}`}>
                      <span>Partner {n}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CTA — become a partner */}
            <div className="lp-cta lp-cta--anim">
              <div className="lp-cta-text">
                <strong className="lp-cta-title">Postanite Partner</strong>
                <p className="lp-cta-desc">
                  Vaša kompanija može doprineti revitalizaciji Vrbovskog. Kontaktirajte nas
                  i dogovorimo oblik saradnje koji odgovara vašim mogućnostima.
                </p>
              </div>
              <a href={`mailto:${CONTACT_EMAIL}?subject=Partnerstvo%20sa%20Vrbovskim`} className="lp-cta-btn">
                Javite Nam Se
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
            </div>

          </div>
        </section>

        {/* Postani Partner */}
        <section className="pp-section" aria-labelledby="pp-heading">

          {/* Decorative gears — positioned right */}
          <div className="pp-gears-wrap" aria-hidden="true">
            <img
              src="/settings.png"
              alt=""
              className="pp-gears-img"
            />
          </div>

          <div className="container pp-inner">

            <div className="pp-content pp-content--anim">

              {/* Label + badge */}
              <div className="pp-top">
                <p className="onama-section-label pp-label">Postani Partner</p>
                <span className="pp-csr-badge">CSR Partnerstvo</span>
              </div>

              <h2 className="pp-title" id="pp-heading">
                Pretvorite Odgovornost<br />
                <em>u Stvaran Uticaj</em>
              </h2>

              <p className="pp-lead">
                Ako vaša kompanija ulaže u CSR (društvenu odgovornost), Vrbovski je
                prilika da taj doprinos postane <strong>vidljiv i merljiv na terenu</strong>.
                Partnerstvom sa nama pomažete konkretne projekte koji unapređuju kvalitet
                života u naselju.
              </p>

              {/* 3 benefit rows */}
              <ul className="pp-benefits">
                <li className="pp-benefit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  Od uređenja javnih prostora i zelenih inicijativa, do edukacija i akcija koje uključuju građane
                </li>
                <li className="pp-benefit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  Jasno definišemo ciljeve, aktivnosti i rezultate za svakog partnera
                </li>
                <li className="pp-benefit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  Javno ističemo partnere koji podržavaju razvoj zajednice
                </li>
              </ul>

              {/* CTA buttons */}
              <div className="pp-cta-row">
                <a href={`mailto:${CONTACT_EMAIL}?subject=Partnerstvo%20—%20Javi%20se`} className="pp-btn pp-btn--primary">
                  Javi Se Za Partnerstvo
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
                <a href={`mailto:${CONTACT_EMAIL}?subject=CSR%20Saradnja%20—%20Predlog`} className="pp-btn pp-btn--outline">
                  Predloži CSR Saradnju
                </a>
              </div>
              <p className="pp-note">Kontakt: {CONTACT_EMAIL}</p>

            </div>

          </div>
        </section>

        {/* Fondovi */}
        <FondoviSection />

      </main>
    </>
  )
}
