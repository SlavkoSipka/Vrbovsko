import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import StandardsSlideshow from '../components/StandardsSlideshow'
import { supabase, type Project } from '../lib/supabase'
import { CategoryBadge } from '../components/CategoryBadge'

export default function HomePage() {
  useScrollAnimations()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    document.title = 'Vrbovski - Inicijativa za Održivi Razvoj | Održivost, Ekologija, Zajednica'
    supabase.from('projects').select('*').eq('visible', true).order('sort_order').then(({ data, error }) => {
      if (error) console.error('Supabase projects (početna):', error.message)
      setProjects(data ?? [])
    })
  }, [])

  return (
    <>
      {/* Hero Section */}
      <header className="hero" role="banner">
        <div className="hero-image">
          <div className="hero-pin" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e53935"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <img
            src="/mapa-vrbovsko.png"
            alt="Aerofotografija naselja Vrbovski sa okolnim poljima i šumama"
            loading="eager"
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                Vrbovski Ima Potencijal<br />
                <span className="highlight">Zajedno Ga Aktiviramo</span>
              </h1>
              <p className="hero-description">
                Udruženje INICIJATIVA ZA ODRŽIVI RAZVOJ VRBOVSKOG pokreće procese održivog
                razvoja kroz saradnju sa institucijama i aktivno učešće zajednice.
              </p>
              <div className="hero-buttons">
                <a href="#about" className="btn btn-primary" aria-label="Saznajte više o našoj inicijativi">
                  Saznaj Više
                </a>
                <a href="#contact" className="btn btn-secondary" aria-label="Priključite se inicijativi">
                  Priključi Se
                </a>
              </div>
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>

      {/* Main Content */}
      <main>
        {/* About Standards Section */}
        <section className="standards-section" id="about" aria-labelledby="standards-heading">
          <div className="container">
            <div className="standards-content">
              <div className="standards-text animate-slide-right">
                <h2 id="standards-heading" className="section-title">Standardi Održivog Razvoja</h2>
                <p className="section-description">
                  Delujemo u skladu sa međunarodnim i domaćim standardima održivog razvoja —
                  od Agende 2030 do nacionalnih politika zaštite prostora i životne sredine.
                </p>
                <p className="section-description">
                  Naše inicijative promovišu i štite resurse Vrbovskog kroz konkretne predloge
                  mera i projekata koje upućujemo nadležnim institucijama u javnom interesu.
                </p>
                <div className="standards-features">
                  <article className="feature-item">
                    <div className="feature-icon" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3>Agenda 2030</h3>
                      <p>Usklađenost sa globalnim ciljevima održivog razvoja</p>
                    </div>
                  </article>
                  <article className="feature-item">
                    <div className="feature-icon" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3>Zaštita Prostora</h3>
                      <p>Nacionalne politike i propisi zaštite životne sredine</p>
                    </div>
                  </article>
                  <article className="feature-item">
                    <div className="feature-icon" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3>Javni Interes</h3>
                      <p>Saradnja sa institucijama i aktivno učešće zajednice</p>
                    </div>
                  </article>
                </div>
              </div>
              <StandardsSlideshow />
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section" id="vision" aria-labelledby="vision-heading">
          <div className="container">
            <div className="vision-content">
              <h2 id="vision-heading" className="animate-fade-up">Budimo Deo Promene</h2>
              <div className="vision-text">
                <div className="vision-block animate-slide-right">
                  <h3>Prirodno Bogatstvo i Održivi Potencijal</h3>
                  <p>
                    Vrbovski je naselje okruženo obimnim površinama obradivog zemljišta, zelenih
                    livada i šuma koje pružaju idealne uslove za razvoj ekološke poljoprivrede i
                    održivog života. Prirodni resursi ovog područja omogućavaju razvoj različitih vidova
                    poljoprivredne proizvodnje, od organskih proizvoda do tradicionalnih metoda gajenja.
                  </p>
                  <p>
                    Kvalitet zemljišta i povoljni klimatski uslovi čine Vrbovski idealnim za
                    poljoprivrednu proizvodnju, od ekstenzivne do organske, dok prirodno okruženje pruža mogućnosti za razvoj
                    eko-turizma i rekreativnih sadržaja. Šume i zelene površine predstavljaju ne samo
                    ekološku vrednost, već i potencijal za održivo korišćenje prirodnih resursa uz
                    očuvanje biodiverziteta.
                  </p>
                </div>
                <div className="vision-block animate-slide-left">
                  <h3>Strateški Položaj i Razvojne Mogućnosti</h3>
                  <p>
                    Sa strateški povoljnim položajem i prirodnim bogatstvom, Vrbovski ima sve
                    predispozicije da postane model održive zajednice. Razvoj ekološke poljoprivrede,
                    turistički potencijal prirodnih lepota, i mogućnosti za obnovljive izvore energije
                    čine ovo naselje idealnim prostorom za familije koje traže kvalitetniji život u
                    harmoniji sa prirodom.
                  </p>
                  <p>
                    Blizina urbanih centara omogućava pristup tržištu i infrastrukturi, dok karakter
                    naselja obezbeđuje mir i kvalitet života. Ova kombinacija čini Vrbovski atraktivnom
                    lokacijom za razvoj malih porodičnih biznisa, poljoprivrednih gazdinstava i različitih
                    oblika održivog preduzetništva koji poštuju životnu sredinu i lokalne tradicije.
                  </p>
                </div>
                <div className="vision-block animate-slide-right">
                  <h3>Naša Vizija za Budućnost Zajednice</h3>
                  <p>
                    Kroz organizovanu akciju, edukaciju i saradnju sa institucijama, Vrbovski postaje
                    primer kako naselja mogu prosperirati uz očuvanje životne sredine i tradicionalnih
                    vrednosti. Naša inicijativa radi na povezivanju različitih aktera - od lokalnih
                    stanovnika, preko institucija, do privatnog sektora - kako bismo zajedno izgradili
                    održivu zajednicu.
                  </p>
                  <p>
                    Fokusiramo se na konkretne projekte koji poboljšavaju kvalitet života, stvaraju
                    nova radna mesta i promovišu održive prakse. Od edukativnih programa o ekološkoj
                    poljoprivredi, preko inicijativa za obnovljive izvore energije, do projekata očuvanja
                    lokalne baštine - svaka aktivnost doprinosi viziji Vrbovskog kao moderne, ali ekološki
                    osvešćene zajednice. Pridružite se inicijativi i budimo zajedno deo pozitivne promene
                    koja će ostaviti trajan pozitivan uticaj na buduće generacije.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aktuelni Projekti Section */}
        <section className="projekti-section" id="projekti" aria-labelledby="projekti-heading">
          <div className="container">
            <div className="projekti-header animate-fade-up">
              <p className="section-label">Sa stranice Projekti</p>
              <h2 id="projekti-heading" className="section-title">Aktuelni Projekti</h2>
              <p className="section-description">
                Pratite naše tekuće inicijative i projekte koji oblikuju budućnost Vrbovskog.
              </p>
            </div>
            <div className="projekti-grid">
              {projects.filter(p => p.status !== 'zavrsen').length > 0 ? (
                projects.filter(p => p.status !== 'zavrsen').map(p => (
                  <Link to={`/projekti-i-aktivnosti/projekat/${p.slug}`} key={p.id} className="projekat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="projekat-card-img">
                      {p.cover_image ? (
                        <img src={p.cover_image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="projekat-placeholder-img">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="projekat-card-body">
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="projekat-tag">{p.status === 'aktivan' ? 'U toku' : 'Planiran'}</span>
                        <CategoryBadge category={p.category} />
                      </div>
                      <h3>{p.title}</h3>
                      <p>{p.description.split('\n').filter(l => l.trim())[0]?.slice(0, 120)}...</p>
                      <span className="projekat-link">Saznaj više →</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '2rem' }}>Projekti se uskoro objavljuju.</p>
              )}
            </div>
            <div className="projekti-footer animate-fade-up">
              <Link to="/projekti-i-aktivnosti" className="btn btn-primary">Svi Projekti</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
