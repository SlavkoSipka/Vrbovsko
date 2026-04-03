interface Props {
  statutUrl?: string
  izvestajiUrl?: string
}

export default function TransparencySection({
  statutUrl = '#',
  izvestajiUrl = '#',
}: Props) {
  return (
    <section className="transp-section" aria-labelledby="transp-heading">

      {/* Background seal decoration */}
      <div className="transp-bg-seal" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 8l18.2 12.4 21.8-4.2 10.6 19.6 21.8 4.2-2.4 22 15.8 15.8-10 19.6 10 19.6-15.8 15.8 2.4 22-21.8 4.2-10.6 19.6-21.8-4.2L100 192l-18.2-12.4-21.8 4.2-10.6-19.6-21.8-4.2 2.4-22L14.2 122l10-19.6-10-19.6 15.8-15.8-2.4-22 21.8-4.2 10.6-19.6 21.8 4.2L100 8z" stroke="currentColor" strokeWidth="3"/>
          <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="2"/>
          <path d="M76 100l14 14 34-34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="container">
        <div className="transp-inner">

          {/* Header */}
          <div className="transp-header transp-header--anim">
            <p className="onama-section-label">Transparentnost</p>
            <h2 className="transp-title" id="transp-heading">
              Otvoreni Prema<br />Zajednici
            </h2>
          </div>

          {/* Content grid */}
          <div className="transp-content-grid">

            {/* Text */}
            <div className="transp-text transp-text--anim">
              <p className="transp-body">
                Transparentnost nam je osnov rada. Statut i godišnji finansijski izveštaji
                udruženja javno su dostupni na portalu Agencije za privredne registre (APR)
                — gde su uvek najaktuelnije verzije dokumenata. Verujemo da poverenje nastaje
                kada su informacije dostupne, proverljive i lako pronađene.
              </p>
              <p className="transp-note">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dokumenta su javno dostupna na APR-u i automatski se ažuriraju.
              </p>

              {/* Contact info */}
              <div className="transp-contact">
                <p className="transp-contact-title">Podaci o udruženju</p>
                <ul className="transp-contact-list">
                  <li>
                    <span className="transp-contact-label">Naziv:</span>
                    ИНИЦИЈАТИВА ЗА ОДРЖИВИ РАЗВОЈ ВРБОВСКОГ
                  </li>
                  <li>
                    <span className="transp-contact-label">Naziv (EN):</span>
                    VRBOVSKI INITIATIVE FOR SUSTAINABLE DEVELOPMENT
                  </li>
                  <li>
                    <span className="transp-contact-label">Matični broj:</span>
                    28402589
                  </li>
                  <li>
                    <span className="transp-contact-label">PIB:</span>
                    115199722
                  </li>
                  <li>
                    <span className="transp-contact-label">Adresa:</span>
                    Vrbovski 19, Padinska Skela, opština Palilula, 11213 Beograd
                  </li>
                  <li>
                    <span className="transp-contact-label">E-mail:</span>
                    <a href="mailto:inicijativa.vrbovski@gmail.com" className="transp-contact-email">
                      inicijativa.vrbovski@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Document cards */}
            <div className="transp-docs transp-docs--anim">

              <a
                href={statutUrl}
                target="_blank"
                rel="noreferrer"
                className="transp-doc-card"
                aria-label="Pretraži statut udruženja na APR portalu"
              >
                <div className="transp-doc-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="transp-doc-badge">APR</span>
                </div>
                <div className="transp-doc-info">
                  <strong className="transp-doc-name">Statut udruženja</strong>
                  <span className="transp-doc-type">Objedinjena pretraga — APR</span>
                </div>
                <span className="transp-doc-btn" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Pogledaj na APR-u
                </span>
              </a>

              <a
                href={izvestajiUrl}
                target="_blank"
                rel="noreferrer"
                className="transp-doc-card"
                aria-label="Pogledaj finansijske izveštaje na APR portalu"
              >
                <div className="transp-doc-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="transp-doc-badge">APR</span>
                </div>
                <div className="transp-doc-info">
                  <strong className="transp-doc-name">Finansijski izveštaji</strong>
                  <span className="transp-doc-type">Pretrage evidencije — APR</span>
                </div>
                <span className="transp-doc-btn" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Pogledaj na APR-u
                </span>
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
