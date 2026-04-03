import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type ForumTopic, type ForumPost, type ForumReply } from '../lib/supabase'
import { compressAndUpload } from '../lib/imageCompressor'

const GUEST_NAME_KEY = 'vrbovski_forum_guest_name'

function getStoredName() {
  try { return localStorage.getItem(GUEST_NAME_KEY) ?? '' } catch { return '' }
}
function storeName(name: string) {
  try { localStorage.setItem(GUEST_NAME_KEY, name) } catch { /* noop */ }
}

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

function AuthorBadge({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className={`fp-author ${isAdmin ? 'fp-author--admin' : ''}`}>
      <span className="fp-author-avatar">{isAdmin ? 'A' : initials}</span>
      <span className="fp-author-name">
        {isAdmin ? 'Admin' : name}
        {isAdmin && <span className="fp-admin-badge">ADMIN</span>}
      </span>
    </div>
  )
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fp-lightbox" onClick={onClose}>
      <button className="fp-lightbox-close" onClick={onClose}>&times;</button>
      <img src={src} alt="Uvećana slika" onClick={e => e.stopPropagation()} />
    </div>
  )
}

function ImageUploadBtn({
  imageUrl,
  uploading,
  onFileSelect,
  onRemove,
}: {
  imageUrl: string
  uploading: boolean
  onFileSelect: (file: File) => void
  onRemove: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="fp-img-upload">
      {imageUrl ? (
        <div className="fp-img-preview-wrap">
          <img src={imageUrl} alt="Priložena slika" className="fp-img-preview" />
          <button className="fp-img-remove" onClick={onRemove} title="Ukloni sliku">&times;</button>
        </div>
      ) : (
        <button
          type="button"
          className="fp-img-upload-btn"
          disabled={uploading}
          onClick={() => ref.current?.click()}
        >
          {uploading ? (
            <><span className="fp-img-spinner" />Kompresija...</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Dodaj sliku
            </>
          )}
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={e => { if (e.target.files?.[0]) { onFileSelect(e.target.files[0]); e.target.value = '' } }}
      />
    </div>
  )
}

interface NameModalProps {
  open: boolean
  initialName: string
  onConfirm: (name: string) => void
  onCancel: () => void
}

function NameModal({ open, initialName, onConfirm, onCancel }: NameModalProps) {
  const [name, setName] = useState(initialName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(initialName)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, initialName])

  if (!open) return null

  return (
    <div className="fp-modal-overlay" onClick={onCancel}>
      <div className="fp-modal" onClick={e => e.stopPropagation()}>
        <h3 className="fp-modal-title">Kako se zovete?</h3>
        <p className="fp-modal-desc">Vaše ime i prezime će biti prikazano uz vašu objavu.</p>
        <input
          ref={inputRef}
          className="fp-modal-input"
          type="text"
          placeholder="Ime i prezime"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onConfirm(name.trim()) }}
          maxLength={60}
        />
        <div className="fp-modal-actions">
          <button className="fp-modal-cancel" onClick={onCancel}>Otkaži</button>
          <button
            className="fp-modal-confirm"
            disabled={!name.trim()}
            onClick={() => onConfirm(name.trim())}
          >
            Objavi
          </button>
        </div>
      </div>
    </div>
  )
}

type PostWithReplies = ForumPost & { replies: ForumReply[] }

export default function ForumTopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const [topic, setTopic] = useState<ForumTopic | null>(null)
  const [posts, setPosts] = useState<PostWithReplies[]>([])
  const [loading, setLoading] = useState(true)

  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState('')
  const [uploadingPostImg, setUploadingPostImg] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<null | { type: 'post' } | { type: 'reply'; postId: string }>(null)

  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyImage, setReplyImage] = useState('')
  const [uploadingReplyImg, setUploadingReplyImg] = useState(false)
  const replyRef = useRef<HTMLTextAreaElement>(null)

  const [lightboxSrc, setLightboxSrc] = useState('')

  const loadPosts = useCallback(async (topicId: string) => {
    const { data: postsData } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })

    if (!postsData) { setPosts([]); return }

    const postIds = postsData.map(p => p.id)
    let allReplies: ForumReply[] = []
    if (postIds.length > 0) {
      const { data: repliesData } = await supabase
        .from('forum_replies')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true })
      allReplies = repliesData ?? []
    }

    setPosts(postsData.map(p => ({ ...p, replies: allReplies.filter(r => r.post_id === p.id) })))
  }, [])

  useEffect(() => {
    if (!slug) return
    async function load() {
      const { data } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setTopic(data)
        document.title = `${data.title} | Forum | Vrbovski`
        await loadPosts(data.id)
      }
      setLoading(false)
    }
    load()
  }, [slug, loadPosts])

  async function handlePostImageSelect(file: File) {
    setUploadingPostImg(true)
    try {
      const url = await compressAndUpload(file)
      setNewPostImage(url)
    } catch { alert('Greška pri uploadu slike.') }
    setUploadingPostImg(false)
  }

  async function handleReplyImageSelect(file: File) {
    setUploadingReplyImg(true)
    try {
      const url = await compressAndUpload(file)
      setReplyImage(url)
    } catch { alert('Greška pri uploadu slike.') }
    setUploadingReplyImg(false)
  }

  async function submitPost(authorName: string) {
    if (!topic || !newPostContent.trim()) return
    const payload: Record<string, unknown> = {
      topic_id: topic.id,
      author_name: authorName,
      is_admin: false,
      content: newPostContent.trim(),
    }
    if (newPostImage) payload.image_url = newPostImage

    const { error } = await supabase.from('forum_posts').insert(payload)
    if (error) {
      console.error('Forum post error:', error)
      alert('Greška pri slanju objave. Pokušajte ponovo.')
      return
    }
    setNewPostContent('')
    setNewPostImage('')
    await loadPosts(topic.id)
  }

  async function submitReply(postId: string, authorName: string) {
    if (!replyContent.trim()) return
    const payload: Record<string, unknown> = {
      post_id: postId,
      author_name: authorName,
      is_admin: false,
      content: replyContent.trim(),
    }
    if (replyImage) payload.image_url = replyImage

    const { error } = await supabase.from('forum_replies').insert(payload)
    if (error) {
      console.error('Forum reply error:', error)
      alert('Greška pri slanju odgovora. Pokušajte ponovo.')
      return
    }
    setReplyContent('')
    setReplyImage('')
    setReplyingTo(null)
    if (topic) await loadPosts(topic.id)
  }

  function handlePostSubmit() {
    if (!newPostContent.trim()) return
    setPendingAction({ type: 'post' })
    setShowNameModal(true)
  }

  function handleReplySubmit(postId: string) {
    if (!replyContent.trim()) return
    setPendingAction({ type: 'reply', postId })
    setShowNameModal(true)
  }

  function handleNameConfirm(name: string) {
    storeName(name)
    setShowNameModal(false)
    if (pendingAction?.type === 'post') submitPost(name)
    else if (pendingAction?.type === 'reply') submitReply(pendingAction.postId, name)
    setPendingAction(null)
  }

  function openReply(postId: string) {
    setReplyingTo(postId)
    setReplyContent('')
    setReplyImage('')
    setTimeout(() => replyRef.current?.focus(), 100)
  }

  if (loading) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image">
            <img src="/hero-nasa-zajednica.webp" alt="" loading="eager" style={{ objectPosition: 'center 40%' }} />
            <div className="hero-overlay" aria-hidden="true"></div>
          </div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Forum</h1></div></div></div>
        </header>
        <main className="forum-topic-page">
          <div className="container">
            <div className="forum-loading"><div className="forum-loading-spinner" /><p>Učitavanje...</p></div>
          </div>
        </main>
      </>
    )
  }

  if (!topic) {
    return (
      <>
        <header className="hero hero-page" role="banner">
          <div className="hero-image">
            <img src="/hero-nasa-zajednica.webp" alt="" loading="eager" style={{ objectPosition: 'center 40%' }} />
            <div className="hero-overlay" aria-hidden="true"></div>
          </div>
          <div className="hero-content"><div className="container"><div className="hero-page-text"><h1 className="hero-page-title">Tema nije pronađena</h1></div></div></div>
        </header>
        <main className="forum-topic-page">
          <div className="container">
            <p style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Link to="/nasa-zajednica/forum" className="forum-back-link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Nazad na forum
              </Link>
            </p>
          </div>
        </main>
      </>
    )
  }

  const heroImg = topic.cover_image || '/hero-nasa-zajednica.webp'

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img src={heroImg} alt={topic.title} loading="eager" style={{ objectPosition: 'center 40%' }} />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">{topic.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="forum-topic-page">
        <div className="container">

          <Link to="/nasa-zajednica/forum" className="forum-back-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Sve teme
          </Link>

          <div className="fp-topic-header">
            <p className="fp-topic-intro">{topic.intro}</p>
            <div className="fp-topic-cta">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              <span>{topic.call_to_action}</span>
            </div>
          </div>

          {/* New post form */}
          <div className="fp-new-post">
            <h3 className="fp-new-post-title">Napišite svoju objavu</h3>
            <textarea
              className="fp-new-post-input"
              placeholder="Podelite vaše mišljenje, iskustvo ili predlog..."
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              rows={4}
              maxLength={2000}
            />
            <ImageUploadBtn
              imageUrl={newPostImage}
              uploading={uploadingPostImg}
              onFileSelect={handlePostImageSelect}
              onRemove={() => setNewPostImage('')}
            />
            <div className="fp-new-post-footer">
              <span className="fp-char-count">{newPostContent.length}/2000</span>
              <button
                className="fp-submit-btn"
                disabled={!newPostContent.trim() || uploadingPostImg}
                onClick={handlePostSubmit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Objavi
              </button>
            </div>
          </div>

          {/* Posts feed */}
          <div className="fp-feed">
            <h3 className="fp-feed-title">
              {posts.length === 0 ? 'Još nema objava — budite prvi!' : `Objave (${posts.length})`}
            </h3>

            {posts.map(post => (
              <article key={post.id} className="fp-post">
                <div className="fp-post-header">
                  <AuthorBadge name={post.author_name} isAdmin={post.is_admin} />
                  <time className="fp-post-time">{timeAgo(post.created_at)}</time>
                </div>
                <div className="fp-post-content">
                  {post.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
                {post.image_url && (
                  <button className="fp-post-thumb" onClick={() => setLightboxSrc(post.image_url)}>
                    <img src={post.image_url} alt="Priložena slika" />
                  </button>
                )}
                <div className="fp-post-actions">
                  <button className="fp-reply-btn" onClick={() => openReply(post.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    Odgovori {post.replies.length > 0 && `(${post.replies.length})`}
                  </button>
                </div>

                {post.replies.length > 0 && (
                  <div className="fp-replies">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="fp-reply">
                        <div className="fp-reply-header">
                          <AuthorBadge name={reply.author_name} isAdmin={reply.is_admin} />
                          <time className="fp-post-time">{timeAgo(reply.created_at)}</time>
                        </div>
                        <div className="fp-reply-content">
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

                {replyingTo === post.id && (
                  <div className="fp-reply-form">
                    <textarea
                      ref={replyRef}
                      className="fp-reply-input"
                      placeholder="Napišite odgovor..."
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      rows={3}
                      maxLength={1000}
                    />
                    <ImageUploadBtn
                      imageUrl={replyImage}
                      uploading={uploadingReplyImg}
                      onFileSelect={handleReplyImageSelect}
                      onRemove={() => setReplyImage('')}
                    />
                    <div className="fp-reply-form-actions">
                      <button className="fp-reply-cancel" onClick={() => setReplyingTo(null)}>Otkaži</button>
                      <button
                        className="fp-reply-submit"
                        disabled={!replyContent.trim() || uploadingReplyImg}
                        onClick={() => handleReplySubmit(post.id)}
                      >
                        Odgovori
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

        </div>
      </main>

      <NameModal
        open={showNameModal}
        initialName={getStoredName()}
        onConfirm={handleNameConfirm}
        onCancel={() => { setShowNameModal(false); setPendingAction(null) }}
      />

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc('')} />}
    </>
  )
}
