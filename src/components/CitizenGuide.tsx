import { useEffect, useRef } from 'react'

const categories = [
  {
    id: 'reciklaza',
    label: 'Reciklaža',
    accent: '#2d5a3d',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    tips: [
      { icon: '🟡', title: 'Odvajajte u 4 toka', text: 'Plastika, papir, staklo i biootpad idu u posebne kante — jedna od najlakših i najefikasnijih navika.' },
      { icon: '💧', title: 'Isperite pre odlaganja', text: 'Suvo i čisto reciklira se efikasnije. Ambalaža ne mora biti savršena — samo bez ostataka hrane.' },
      { icon: '📱', title: 'Elektronski otpad posebno', text: 'Stare uređaje, baterije i lekove ne bacajte u obično smeće — postoje posebni punktovi i sabirna mesta.' },
      { icon: '📦', title: 'Složite karton', text: 'Složene kutije uštede prostor u kontejneru i olakšavaju odvoz komunalnom preduzeću.' },
    ],
  },
  {
    id: 'energija',
    label: 'Energija',
    accent: '#3a7a50',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    tips: [
      { icon: '💡', title: 'Pređite na LED', text: 'LED sijalice troše do 80% manje struje od klasičnih i traju 10–15 puta duže.' },
      { icon: '🔌', title: 'Ugasite standby', text: 'Uređaji na čekanju troše i do 10% vaše mesečne potrošnje. Razdjelnici sa prekidačem pomažu.' },
      { icon: '🌡️', title: 'Termostat na 20°C', text: 'Svaki stepen više u grejnoj sezoni povećava potrošnju za oko 6%. Lagani džemper štedi više nego što mislite.' },
      { icon: '🪟', title: 'Izolujte prozore', text: 'Dobra izolacija prozora smanjuje gubitak toplote do 25%. Zaptivne trake su jeftine i brze za ugradnju.' },
    ],
  },
  {
    id: 'domacinstvo',
    label: 'Domaćinstvo',
    accent: '#4a8f5f',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    tips: [
      { icon: '🫧', title: 'Puna mašina uvek', text: 'Mašina za veš ili sudove troši jednako puna ili polupuna — sačekajte puno punjenje.' },
      { icon: '❄️', title: 'Hladno pranje radi', text: 'Program na 30°C čisti gotovo jednako dobro i troši 40% manje energije od 60°C.' },
      { icon: '🛒', title: 'Lokalno i sezonski', text: 'Namirnice iz lokalne proizvodnje imaju manji CO₂ otisak i podržavaju komšijska gazdinstva.' },
      { icon: '🪴', title: 'Biljke poboljšavaju vazduh', text: 'Nekoliko biljaka u stanu filtrira vazduh, smanjuje vlagu i pozitivno utiče na raspoloženje.' },
    ],
  },
  {
    id: 'prostor',
    label: 'Prostor',
    accent: '#2d5a3d',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    tips: [
      { icon: '🍂', title: 'Lišće je malča', text: 'Suvi listovi i pokošena trava su odlična prirodna malča — ne bacajte ih, iskoristite u bašti.' },
      { icon: '🌧️', title: 'Skupljajte kišnicu', text: 'Voda sa oluka skupljena u bure može da zaliva baštu besplatno tokom letnje sezone.' },
      { icon: '🤝', title: 'Zajednička dvorišta', text: 'Zelenilo oko zgrade zahteva zajedničku brigu. Inicijative ulepšavanja dostupne su svim stanarima.' },
      { icon: '🌿', title: 'Sadite autohtono bilje', text: 'Autohtone biljke su prilagođene klimi — manje zalivanja i više koristi za lokalne oprašivače.' },
    ],
  },
]

export default function CitizenGuide() {
  const sectionRef = useRef<HTMLElement>(null)
  const bubble1Ref = useRef<HTMLDivElement>(null)
  const bubble2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = rect.top / (window.innerHeight + rect.height)
      if (bubble1Ref.current) {
        bubble1Ref.current.style.transform = `translateY(${progress * -90}px)`
      }
      if (bubble2Ref.current) {
        bubble2Ref.current.style.transform = `translateY(${progress * 60}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="cg-section" aria-labelledby="cg-heading" ref={sectionRef}>

      {/* Parallax background blobs */}
      <div className="cg-blob cg-blob--1" ref={bubble1Ref} aria-hidden="true" />
      <div className="cg-blob cg-blob--2" ref={bubble2Ref} aria-hidden="true" />

      <div className="container cg-inner">

        {/* Header with image */}
        <div className="cg-header cg-header--anim">
          <div className="cg-header-content">
            <div>
              <p className="onama-section-label">Vodič za Građane</p>
              <h2 className="cg-title" id="cg-heading">
                Male Navike,<br />Velika Razlika
              </h2>
            </div>
            <p className="cg-intro">
              Praktični koraci ka urednijem, zdravijem i održivijem stanovanju u Vrbovskom —
              bez komplikacija i velikih ulaganja. Kroz jasne savete za reciklažu, uštedu energije
              i odgovorno korišćenje resursa, zajedno smanjujemo otpad, troškove i opterećenje
              životne sredine.
            </p>
          </div>
          <div className="cg-header-img-wrap">
            <img
              src="/pexels-karola-g-4207909.jpg"
              alt="Praktičan korak ka zelenijem životu — sadnja biljke u zemlju"
              className="cg-header-img"
              loading="lazy"
            />
          </div>
        </div>

        {/* Category grid */}
        <div className="cg-grid">
          {categories.map((cat, ci) => (
            <div
              key={cat.id}
              className="cg-card cg-card--anim"
              style={{ animationDelay: `${0.08 + ci * 0.09}s` } as React.CSSProperties}
            >
              <div className="cg-card-head" style={{ '--cg-accent': cat.accent } as React.CSSProperties}>
                <div className="cg-card-icon" aria-hidden="true">{cat.icon}</div>
                <h3 className="cg-card-title">{cat.label}</h3>
              </div>
              <ul className="cg-tips-list">
                {cat.tips.map((tip, ti) => (
                  <li key={ti} className="cg-tip-item">
                    <span className="cg-tip-emoji" aria-hidden="true">{tip.icon}</span>
                    <div>
                      <strong className="cg-tip-title">{tip.title}</strong>
                      <p className="cg-tip-text">{tip.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="cg-note cg-note--anim">
          Cilj je jednostavan: praktična rešenja koja svako može da primeni odmah, a koja dugoročno čine
          naselje čistijim, udobnijim i otpornijim.
        </p>

      </div>
    </section>
  )
}
