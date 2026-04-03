import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type ForumTopic } from '../lib/supabase'

export default function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [postCounts, setPostCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    document.title = 'Forum | Naša Zajednica | Vrbovski'

    async function load() {
      const { data } = await supabase
        .from('forum_topics')
        .select('*')
        .order('sort_order')
      setTopics(data ?? [])

      if (data && data.length > 0) {
        const counts: Record<string, number> = {}
        for (const t of data) {
          const { count } = await supabase
            .from('forum_posts')
            .select('*', { count: 'exact', head: true })
            .eq('topic_id', t.id)
          counts[t.id] = count ?? 0
        }
        setPostCounts(counts)
      }

      setLoading(false)
    }
    load()
  }, [])

  const topicIcons = [
    <svg key="0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    <svg key="1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    <svg key="2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  ]

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img
            src="/galerija/forum-zajednica-hero-javni-prostor.webp"
            alt="Travnjak i zgrade u naselju Vrbovski — javni prostor zajednice"
            loading="eager"
            className="forum-page-hero-img"
            style={{ objectPosition: 'center 22%' }}
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                Forum{' '}
                <span className="highlight">Zajednice</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="forum-page">
        <div className="container">

          <div className="forum-page-intro">
            <Link to="/nasa-zajednica" className="forum-back-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Nazad na Naša Zajednica
            </Link>
            <h2 className="forum-page-heading">Izaberite Temu za Diskusiju</h2>
            <p className="forum-page-desc">
              Otvorena rasprava o temama koje su bitne za naše naselje.
              Kliknite na temu koja vas zanima i pridružite se razgovoru.
            </p>
          </div>

          {loading ? (
            <div className="forum-loading">
              <div className="forum-loading-spinner" />
              <p>Učitavanje tema...</p>
            </div>
          ) : (
            <div className="forum-topics-grid">
              {topics.map((topic, idx) => (
                <Link
                  key={topic.id}
                  to={`/nasa-zajednica/forum/${topic.slug}`}
                  className="forum-topic-card"
                >
                  {topic.cover_image ? (
                    <div className="forum-topic-card-cover">
                      <img src={topic.cover_image} alt={topic.title} />
                    </div>
                  ) : (
                    <div className="forum-topic-card-icon">
                      {topicIcons[idx] || topicIcons[0]}
                    </div>
                  )}
                  <div className="forum-topic-card-body">
                    <h3 className="forum-topic-card-title">{topic.title}</h3>
                    <p className="forum-topic-card-intro">{topic.intro}</p>
                    <div className="forum-topic-card-cta">
                      <span className="forum-topic-card-invite">{topic.call_to_action}</span>
                    </div>
                  </div>
                  <div className="forum-topic-card-footer">
                    <span className="forum-topic-card-count">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                      {postCounts[topic.id] ?? 0} {(postCounts[topic.id] ?? 0) === 1 ? 'objava' : 'objava'}
                    </span>
                    <span className="forum-topic-card-btn">
                      Učestvujte
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>

      <section className="forum-community-strip" aria-labelledby="forum-community-heading">
        <div className="container">
          <h2 id="forum-community-heading" className="forum-community-strip__title">
            Forum u mojoj zajednici
          </h2>
          <p className="forum-community-strip__lead">
            Trenuci sa terena — otvoren prostor, svakodnevni život i mali detalji koji čine našu zajednicu prepoznatljivom.
          </p>
          <div className="forum-community-strip__row">
            <figure className="forum-community-strip__fig">
              <div className="forum-community-ellipse">
                <img
                  src="/galerija/forum-zajednica-strip-2.webp"
                  alt="Pogled na naselje Vrbovski — zajednički prostor"
                  loading="lazy"
                />
              </div>
            </figure>
            <figure className="forum-community-strip__fig forum-community-strip__fig--center">
              <div className="forum-community-ellipse">
                <img
                  src="/galerija/macka.webp"
                  alt="Mačka u naselju Vrbovski"
                  loading="lazy"
                />
              </div>
            </figure>
            <figure className="forum-community-strip__fig">
              <div className="forum-community-ellipse">
                <img
                  src="/galerija/forum-zajednica-strip-4.webp"
                  alt="Zajednica i okruženje u Vrbovskom"
                  loading="lazy"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>
    </>
  )
}
