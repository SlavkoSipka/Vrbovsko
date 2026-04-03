import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Topic, type TopicItem, type TopicImage, type TopicDocument } from '../lib/supabase'

export default function TopicPage() {
  const { sectionSlug, topicSlug } = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [items, setItems] = useState<TopicItem[]>([])
  const [images, setImages] = useState<TopicImage[]>([])
  const [documents, setDocuments] = useState<TopicDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: t } = await supabase
        .from('topics')
        .select('*, sections!inner(slug)')
        .eq('slug', topicSlug ?? '')
        .eq('sections.slug', sectionSlug ?? '')
        .eq('visible', true)
        .single()

      if (t) {
        setTopic(t as Topic)
        const [itemsRes, imagesRes, docsRes] = await Promise.all([
          supabase.from('topic_items').select('*').eq('topic_id', t.id).order('sort_order'),
          supabase.from('topic_images').select('*').eq('topic_id', t.id).order('sort_order'),
          supabase.from('topic_documents').select('*').eq('topic_id', t.id).order('sort_order'),
        ])
        setItems(itemsRes.data ?? [])
        setImages(imagesRes.data ?? [])
        setDocuments(docsRes.data ?? [])
      }
      setLoading(false)
    }
    load()
  }, [sectionSlug, topicSlug])

  useEffect(() => {
    if (topic) document.title = `${topic.title} | Vrbovski`
  }, [topic])

  if (loading) {
    return (
      <main className="tp-page">
        <div className="container tp-loading">Učitavanje...</div>
      </main>
    )
  }

  if (!topic) {
    return (
      <main className="tp-page">
        <div className="container tp-not-found">
          <h1>Tema nije pronađena</h1>
          <Link to={`/${sectionSlug ?? 'odrzivi-razvoj'}`} className="tp-back-link">&larr; Nazad</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="tp-page">
      <div className="container">

        <Link to={`/${sectionSlug ?? 'odrzivi-razvoj'}`} className="tp-back-link">&larr; Nazad na pregled</Link>

        <div className="tp-hero">
          <div className="tp-hero-text">
            {topic.subtitle && <p className="tp-subtitle">{topic.subtitle}</p>}
            <h1 className="tp-title">{topic.title}</h1>
            {topic.body && <p className="tp-body">{topic.body}</p>}
            {topic.disclaimer && (
              <div className="tp-disclaimer">
                <img src="/EUzaTebe_logo png.png" alt="EU za Tebe" className="tp-disclaimer-logo" />
                <p>{topic.disclaimer}</p>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="tp-images">
              {images.map(img => (
                <img key={img.id} src={img.url} alt={img.alt} className="tp-image" />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="tp-items-section">
            <div className="tp-items-grid">
              {items.map(item => (
                <div key={item.id} className="tp-item">
                  <span className="tp-item-icon" aria-hidden="true">{item.icon}</span>
                  <div className="tp-item-body">
                    <strong className="tp-item-title">{item.title}</strong>
                    {item.description && <p className="tp-item-text">{item.description}</p>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="tp-item-link">
                        Saznaj više &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {documents.length > 0 && (
          <div className="tp-docs-section">
            <h2 className="tp-docs-heading">Dokumenti i linkovi</h2>
            <div className="tp-docs-grid">
              {documents.map(doc => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="tp-doc-card">
                  <div className="tp-doc-icon">
                    {doc.file_type === 'pdf' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    )}
                  </div>
                  <div>
                    <strong className="tp-doc-title">{doc.title}</strong>
                    <span className="tp-doc-type">{doc.file_type === 'pdf' ? 'PDF dokument' : 'Eksterni link'}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
