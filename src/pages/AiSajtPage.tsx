import { useEffect } from 'react'

export default function AiSajtPage() {
  useEffect(() => {
    document.title = 'AiSajt — Izrada Web Sajtova | Vrbovski'
  }, [])

  return (
    <>
      <header className="hero hero-page aisajt-hero" role="banner">
        <div className="hero-image">
          <div className="aisajt-hero-bg" aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <p className="aisajt-label">Izrađeno sa ponosom</p>
              <h1 className="hero-page-title">
                Digitalna rješenja za <span className="highlight">modernu zajednicu</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="aisajt-section">
          <div className="container">
            <div className="aisajt-content">

              <div className="aisajt-intro">
                <p className="aisajt-overline">Ko smo mi</p>
                <h2 className="aisajt-heading">
                  AiSajt — agencija za web razvoj iz Beograda
                </h2>
                <div className="aisajt-body">
                  <p>
                    Bavimo se izradom web sajtova u Beogradu već nekoliko godina i iskreno,
                    svaki projekat doživljavamo kao nešto svoje. Nije nam cilj da samo
                    "isporučimo sajt" — trudimo se da razumijemo čime se klijent bavi,
                    šta mu treba i kako da to digitalno prikaže na pravi način. Rezultat
                    je uvijek nešto što klijent može da bude ponosan.
                  </p>
                  <p>
                    Tehnički gledano, radimo u Reactu, TypeScriptu i Vite okruženju —
                    što znači da su sajtovi koje pravimo brzi, stabilni i lako se održavaju.
                    Ali ono što nas zapravo razlikuje nije stack nego pristup: svaki detalj
                    je namjeran. Više o tome možete naći na{' '}
                    <a
                      href="https://aisajt.com/"
                      target="_blank"
                      rel="noopener"
                      className="aisajt-inline-link"
                    >
                      AiSajt.com
                    </a>
                    .
                  </p>
                </div>
              </div>

              <div className="aisajt-collab">
                <div className="aisajt-collab-card">
                  <div className="aisajt-collab-icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h3>Saradnja s Inicijativom</h3>
                  <p>
                    Kad smo počeli da radimo sa Inicijativom za Održivi Razvoj Vrbovskog,
                    odmah smo osjetili da je ovo nešto drugačije. Nije to bio klijent koji
                    hoće "neki sajt" — bili su jasni u tome šta žele postići i zajednica
                    iza toga je bila stvarna. To uvijek pravi razliku u radu.
                  </p>
                  <p>
                    Napravili smo kompletnu platformu — od dizajna do admin panela —
                    i drago nam je što danas taj sajt aktivno služi ljudima u Vrbovskom.
                    Takvi projekti su razlog zašto radimo ovaj posao.
                  </p>
                </div>

                <div className="aisajt-features">
                  <div className="aisajt-feature">
                    <span className="aisajt-feature-num">01</span>
                    <div>
                      <strong>Moderan dizajn</strong>
                      <p>Vizuelno rješenje prilagođeno identitetu i vrijednostima klijenta.</p>
                    </div>
                  </div>
                  <div className="aisajt-feature">
                    <span className="aisajt-feature-num">02</span>
                    <div>
                      <strong>Responsivnost</strong>
                      <p>Besprijekorno iskustvo na desktop računaru, tabletu i telefonu.</p>
                    </div>
                  </div>
                  <div className="aisajt-feature">
                    <span className="aisajt-feature-num">03</span>
                    <div>
                      <strong>SEO optimizacija</strong>
                      <p>Tehnički SEO od prvog dana — brzo učitavanje i vidljivost na Googlu.</p>
                    </div>
                  </div>
                  <div className="aisajt-feature">
                    <span className="aisajt-feature-num">04</span>
                    <div>
                      <strong>Admin panel</strong>
                      <p>Vlastito upravljanje sadržajem bez tehničkog znanja.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="aisajt-cta-block">
                <p className="aisajt-cta-text">
                  Ako imate ideju za sajt — ili samo niste sigurni odakle da počnete —
                  javite nam se. Konsultacija je besplatna i bez obaveze, a dobićete iskren
                  savet šta ima smisla, a šta ne.
                </p>
                <a
                  href="https://aisajt.com/"
                  target="_blank"
                  rel="noopener"
                  className="aisajt-cta-btn"
                >
                  Posjetite naš website — AiSajt.com
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  )
}
