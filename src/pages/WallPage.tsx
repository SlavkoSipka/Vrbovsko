import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type WallPost, type WallReply } from '../lib/supabase'
import { compressAndUpload } from '../lib/imageCompressor'

const GUEST_NAME_KEY = 'vrbovski_wall_guest_name'
function getStoredName() { try { return localStorage.getItem(GUEST_NAME_KEY) ?? '' } catch { return '' } }
function storeName(n: string) { try { localStorage.setItem(GUEST_NAME_KEY, n) } catch { /* */ } }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'upravo'
  if (mins < 60) return `pre ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `pre ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `pre ${days} dana`
  return new Date(dateStr).toLocaleDateString('sr-Latn')
}

const WALL_CONFIG: Record<string, { title: string; heroTitle: string; highlight: string; disclaimer: string; placeholder: string }> = {
  predlozi: {
    title: 'Predlozi Ideja | Naša Zajednica | Vrbovski',
    heroTitle: 'Predlozi',
    highlight: 'Ideja',
    disclaimer: 'Ovaj prostor je namenjen za deljenje opštih predloga i zapažanja koja se odnose na život u zajednici. Predlozi koje ovde ostavite imaju isključivo informativni karakter i ne predstavljaju zvaničnu inicijativu niti obavezu postupanja. Sve formalne inicijative i zvanični postupci i dalje se sprovode kroz nadležne institucije i propisane procedure.',
    placeholder: 'Podelite svoju ideju ili predlog za unapređenje zajednice...',
  },
  problemi: {
    title: 'Prijava Problema | Naša Zajednica | Vrbovski',
    heroTitle: 'Prijava',
    highlight: 'Problema',
    disclaimer: 'Prijave koje ovde ostavite nemaju karakter zvanične prijave i ne stvaraju obavezu postupanja. Za sve hitne, tehničke ili formalne prijave molimo vas da se obratite nadležnim komunalnim službama i institucijama.',
    placeholder: 'Opišite problem koji ste primetili u naselju...',
  },
}

export default function WallPage() {
  const { wallType } = useParams<{ wallType: string }>()
  const config = WALL_CONFIG[wallType ?? '']

  type PostWithReplies = WallPost & { replies: WallReply[] }
  const [posts, setPosts] = useState<PostWithReplies[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [guestName, setGuestName] = useState(getStoredName())
  const [lightboxSrc, setLightboxSrc] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const loadPosts = useCallback(async () => {
    if (!wallType) return
    const { data: postsData } = await supabase
      .from('wall_posts')
      .select('*')
      .eq('wall_type', wallType)
      .order('created_at', { ascending: false })

    if (!postsData) { setPosts([]); setLoading(false); return }

    const postIds = postsData.map(p => p.id)
    let allReplies: WallReply[] = []
    if (postIds.length > 0) {
      const { data: repliesData } = await supabase
        .from('wall_replies')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true })
      allReplies = repliesData ?? []
    }

    setPosts(postsData.map(p => ({ ...p, replies: allReplies.filter(r => r.post_id === p.id) })))
    setLoading(false)
  }, [wallType])

  useEffect(() => {
    if (config) document.title = config.title
    loadPosts()
  }, [config, loadPosts])

  async function handleImageSelect(file: File) {
    setUploading(true)
    try { setImageUrl(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploading(false)
  }

  function handleSubmitClick() {
    if (!content.trim() && !imageUrl) return
    const stored = getStoredName()
    if (stored) {
      setGuestName(stored)
      doSubmit(stored)
    } else {
      setShowNameModal(true)
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }

  function handleNameConfirm() {
    if (!guestName.trim()) return
    storeName(guestName.trim())
    setShowNameModal(false)
    doSubmit(guestName.trim())
  }

  async function doSubmit(authorName: string) {
    if (!wallType) return
    const payload: Record<string, unknown> = {
      wall_type: wallType,
      author_name: authorName,
      content: content.trim(),
    }
    if (imageUrl) payload.image_url = imageUrl

    try {
      const { error } = await supabase.from('wall_posts').insert(payload)
      if (error) throw error
      setContent('')
      setImageUrl('')
      loadPosts()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Nepoznata greška'
      alert('Greška pri slanju: ' + msg)
    }
  }

  if (!config) {
    return (
      <main className="wall-page"><div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p>Stranica nije pronađena.</p>
        <Link to="/nasa-zajednica" className="forum-back-link">Nazad</Link>
      </div></main>
    )
  }

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img src="/hero-nasa-zajednica.webp" alt="" loading="eager" style={{ objectPosition: 'center 40%' }} />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">{config.heroTitle} <span className="highlight">{config.highlight}</span></h1>
            </div>
          </div>
        </div>
      </header>

      <main className="wall-page">
        <div className="container">

          <Link to="/nasa-zajednica" className="forum-back-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Nazad na Naša Zajednica
          </Link>

          {/* Disclaimer */}
          <div className="wall-disclaimer">
            <svg className="wall-disclaimer-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{config.disclaimer}</p>
          </div>

          {/* New post form */}
          <div className="wall-compose">
            <textarea
              className="wall-compose-input"
              placeholder={config.placeholder}
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              maxLength={2000}
            />

            {/* Image upload */}
            <div className="wall-compose-extras">
              {imageUrl ? (
                <div className="fp-img-preview-wrap">
                  <img src={imageUrl} alt="" className="fp-img-preview" />
                  <button className="fp-img-remove" onClick={() => setImageUrl('')}>&times;</button>
                </div>
              ) : (
                <button type="button" className="wall-img-btn" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? 'Kompresija...' : '📷 Dodaj sliku'}
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) { handleImageSelect(e.target.files[0]); e.target.value = '' } }} />
            </div>

            <div className="wall-compose-footer">
              <span className="wall-char-count">{content.length}/2000</span>
              {guestName && <span className="wall-posting-as">Objavljujete kao: <strong>{guestName}</strong> <button className="wall-change-name" onClick={() => { storeName(''); setGuestName('') }}>promeni</button></span>}
              <button
                className="wall-submit-btn"
                disabled={(!content.trim() && !imageUrl) || uploading}
                onClick={handleSubmitClick}
              >
                Objavi
              </button>
            </div>
          </div>

          {/* Posts feed */}
          {loading ? (
            <div className="forum-loading"><div className="forum-loading-spinner" /><p>Učitavanje...</p></div>
          ) : posts.length === 0 ? (
            <p className="wall-empty">Još nema objava. Budite prvi koji će podeliti nešto!</p>
          ) : (
            <div className="wall-feed">
              {posts.map(post => (
                <div key={post.id} className="wall-post">
                  <div className="wall-post-header">
                    <div className="wall-post-author">
                      <span className="wall-post-avatar">
                        {post.author_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                      <span className="wall-post-name">{post.author_name}</span>
                    </div>
                    <time className="wall-post-time">{timeAgo(post.created_at)}</time>
                  </div>
                  {post.content && (
                    <div className="wall-post-content">
                      {post.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  )}
                  {post.image_url && (
                    <button className="fp-post-thumb" onClick={() => setLightboxSrc(post.image_url)}>
                      <img src={post.image_url} alt="Priložena slika" />
                    </button>
                  )}

                  {/* Admin replies */}
                  {post.replies.length > 0 && (
                    <div className="wall-replies">
                      {post.replies.map(reply => (
                        <div key={reply.id} className="wall-reply">
                          <div className="wall-reply-header">
                            <div className="wall-post-author">
                              <span className="wall-post-avatar wall-post-avatar--admin">A</span>
                              <span className="wall-post-name">Admin <span className="wall-admin-badge">ADMIN</span></span>
                            </div>
                            <time className="wall-post-time">{timeAgo(reply.created_at)}</time>
                          </div>
                          <div className="wall-post-content">
                            {reply.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                          </div>
                          {reply.image_url && (
                            <button className="fp-post-thumb fp-post-thumb--sm" onClick={() => setLightboxSrc(reply.image_url)}>
                              <img src={reply.image_url} alt="Priložena slika" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Name modal */}
      {showNameModal && (
        <div className="fp-modal-overlay" onClick={() => setShowNameModal(false)}>
          <div className="fp-modal" onClick={e => e.stopPropagation()}>
            <h3>Vaše ime i prezime</h3>
            <p>Unesite ime i prezime koje će biti prikazano uz vašu objavu.</p>
            <input
              ref={nameInputRef}
              className="fp-modal-input"
              type="text"
              placeholder="Ime i prezime"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              maxLength={60}
              onKeyDown={e => e.key === 'Enter' && handleNameConfirm()}
            />
            <div className="fp-modal-actions">
              <button className="fp-modal-cancel" onClick={() => setShowNameModal(false)}>Otkaži</button>
              <button className="fp-modal-confirm" disabled={!guestName.trim()} onClick={handleNameConfirm}>Potvrdi i objavi</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="fp-lightbox" onClick={() => setLightboxSrc('')}>
          <button className="fp-lightbox-close" onClick={() => setLightboxSrc('')}>&times;</button>
          <img src={lightboxSrc} alt="Uvećana slika" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
