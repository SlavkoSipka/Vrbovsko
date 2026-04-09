import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, PROJECT_CATEGORIES, type Topic, type TopicItem, type TopicDocument, type Section, type ForumTopic, type ForumPost, type ForumReply, type SurveyPoll, type SurveyOption, type SurveyVote, type WallPost, type WallReply, type Project, type ProjectDocument, type Initiative, type InitiativeDocument, type Partner, type Fond, type Activity, type ActivityDocument, type ActivityGalleryImage, type ProjectPhase } from '../lib/supabase'
import { compressAndUpload } from '../lib/imageCompressor'

/* ======================================= */
/*  ADMIN PAGE                             */
/* ======================================= */

export default function AdminPage() {
  const navigate = useNavigate()
  const [authReady, setAuthReady] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isForumView = activeSection === '__forum__'
  const isAnketeView = activeSection === '__ankete__'
  const isPredloziView = activeSection === '__predlozi__'
  const isProblemiView = activeSection === '__problemi__'
  const isProjektiView = activeSection === '__projekti__'
  const isSaradnjaView = activeSection === '__saradnja__'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/login', { replace: true })
      } else {
        setAuthReady(true)
      }
    })
  }, [navigate])

  useEffect(() => {
    supabase.from('sections').select('*').order('sort_order').then(({ data }) => {
      if (data && data.length > 0) {
        setSections(data)
        setActiveSection(data[0].id)
      }
    })
  }, [])

  const loadTopics = useCallback(async () => {
    if (!activeSection || isForumView || isAnketeView || isPredloziView || isProblemiView || isProjektiView || isSaradnjaView) return
    setLoading(true)
    const { data } = await supabase
      .from('topics')
      .select('*')
      .eq('section_id', activeSection)
      .order('sort_order')
    setTopics(data ?? [])
    setLoading(false)
  }, [activeSection, isForumView, isAnketeView, isPredloziView, isProblemiView, isProjektiView, isSaradnjaView])

  useEffect(() => { loadTopics() }, [loadTopics])

  async function toggleVisibility(topic: Topic) {
    await supabase.from('topics').update({ visible: !topic.visible }).eq('id', topic.id)
    loadTopics()
  }

  async function deleteTopic(id: string) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu temu?')) return
    await supabase.from('topics').delete().eq('id', id)
    loadTopics()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function selectSection(id: string) {
    setActiveSection(id)
    setSidebarOpen(false)
  }

  if (!authReady) {
    return (
      <main className="adm-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#999' }}>Provera autentifikacije...</p>
      </main>
    )
  }

  return (
    <main className="adm-page">
      {/* Mobile top bar */}
      <div className="adm-mobile-bar">
        <button className="adm-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Meni">
          <span /><span /><span />
        </button>
        <span className="adm-mobile-title">Admin Panel</span>
        <button className="adm-mobile-logout" onClick={handleLogout}>Odjavi se</button>
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="adm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className={`adm-sidebar${sidebarOpen ? ' adm-sidebar--open' : ''}`}>
        <div className="adm-sidebar-top">
          <img src="/logo.webp" alt="Vrbovski" className="adm-logo" />
          <h2>Admin Panel</h2>
          <button className="adm-sidebar-close" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>
        <nav className="adm-nav">
          {/* Sections from DB (Održivi razvoj, etc.) */}
          {sections.map(s => (
            <button
              key={s.id}
              className={`adm-nav-item${activeSection === s.id ? ' active' : ''}`}
              onClick={() => selectSection(s.id)}
            >
              {s.title}
            </button>
          ))}

          <div className="adm-nav-divider" />

          {/* Naša Zajednica group */}
          <p className="adm-nav-group-label">Naša Zajednica</p>
          <button
            className={`adm-nav-item adm-nav-item--sub${isForumView ? ' active' : ''}`}
            onClick={() => selectSection('__forum__')}
          >
            Forum
          </button>
          <button
            className={`adm-nav-item adm-nav-item--sub${isAnketeView ? ' active' : ''}`}
            onClick={() => selectSection('__ankete__')}
          >
            Ankete
          </button>
          <button
            className={`adm-nav-item adm-nav-item--sub${isPredloziView ? ' active' : ''}`}
            onClick={() => selectSection('__predlozi__')}
          >
            Predlozi Ideja
          </button>
          <button
            className={`adm-nav-item adm-nav-item--sub${isProblemiView ? ' active' : ''}`}
            onClick={() => selectSection('__problemi__')}
          >
            Prijave Problema
          </button>

          <div className="adm-nav-divider" />

          {/* Projekti i Inicijative */}
          <button
            className={`adm-nav-item${isProjektiView ? ' active' : ''}`}
            onClick={() => selectSection('__projekti__')}
          >
            Projekti i Inicijative
          </button>
          <button
            className={`adm-nav-item${isSaradnjaView ? ' active' : ''}`}
            onClick={() => selectSection('__saradnja__')}
          >
            Saradnja i Partneri
          </button>
        </nav>
        <button className="adm-logout" onClick={handleLogout}>Odjavi se</button>
      </div>

      <div className="adm-main">
        {isSaradnjaView ? (
          <AdminSaradnjaPanel />
        ) : isProjektiView ? (
          <AdminProjektiPanel />
        ) : isForumView ? (
          <AdminForumPanel />
        ) : isAnketeView ? (
          <AdminAnketePanel />
        ) : isPredloziView ? (
          <AdminWallPanel wallType="predlozi" title="Predlozi Ideja" />
        ) : isProblemiView ? (
          <AdminWallPanel wallType="problemi" title="Prijave Problema" />
        ) : (
          <>
            <div className="adm-header">
              <h1>{sections.find(s => s.id === activeSection)?.title ?? 'Admin'}</h1>
              <button className="adm-add-btn" onClick={() => { setShowAdd(true); setEditingTopic(null) }}>
                + Dodaj temu
              </button>
            </div>

            {loading ? (
              <p className="adm-loading">Učitavanje...</p>
            ) : (
              <div className="adm-cards">
                {topics.map(t => (
                  <div key={t.id} className={`adm-card${!t.visible ? ' adm-card--hidden' : ''}`}>
                    <div className="adm-card-top">
                      <div className="adm-card-icon" dangerouslySetInnerHTML={{ __html: t.icon_svg }} />
                      <div className="adm-card-info">
                        <h3>{t.title}</h3>
                        <p>{t.short_desc}</p>
                      </div>
                    </div>
                    <div className="adm-card-actions">
                      <button className="adm-btn adm-btn--edit" onClick={() => { setEditingTopic(t); setShowAdd(false) }}>
                        Izmeni
                      </button>
                      <button
                        className={`adm-btn ${t.visible ? 'adm-btn--hide' : 'adm-btn--show'}`}
                        onClick={() => toggleVisibility(t)}
                      >
                        {t.visible ? 'Sakrij' : 'Prikaži'}
                      </button>
                      <button className="adm-btn adm-btn--delete" onClick={() => deleteTopic(t.id)}>
                        Obriši
                      </button>
                    </div>
                    {!t.visible && <span className="adm-card-badge">Skriveno</span>}
                  </div>
                ))}
              </div>
            )}

            {(editingTopic || showAdd) && (
              <TopicEditor
                topic={editingTopic}
                sectionId={activeSection}
                onSave={() => { setEditingTopic(null); setShowAdd(false); loadTopics() }}
                onCancel={() => { setEditingTopic(null); setShowAdd(false) }}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}

/* ======================================= */
/*  ADMIN SARADNJA I PARTNERI              */
/* ======================================= */

function AdminSaradnjaPanel() {
  const [subTab, setSubTab] = useState<'partneri' | 'fondovi'>('partneri')
  const [partners, setPartners] = useState<Partner[]>([])
  const [fondoviList, setFondoviList] = useState<Fond[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [showNewPartner, setShowNewPartner] = useState(false)
  const [editingFond, setEditingFond] = useState<Fond | null>(null)
  const [showNewFond, setShowNewFond] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data: pData }, { data: fData }] = await Promise.all([
      supabase.from('partners').select('*').order('sort_order'),
      supabase.from('fondovi').select('*').order('sort_order'),
    ])
    setPartners(pData ?? [])
    setFondoviList(fData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function deletePartner(id: string) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog partnera?')) return
    await supabase.from('partners').delete().eq('id', id)
    loadData()
  }

  async function togglePartnerVisibility(p: Partner) {
    await supabase.from('partners').update({ visible: !p.visible }).eq('id', p.id)
    loadData()
  }

  async function deleteFond(id: string) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj fond?')) return
    await supabase.from('fondovi').delete().eq('id', id)
    loadData()
  }

  async function toggleFondVisibility(f: Fond) {
    await supabase.from('fondovi').update({ visible: !f.visible }).eq('id', f.id)
    loadData()
  }

  return (
    <>
      <div className="adm-header">
        <h1>Saradnja i Partneri</h1>
      </div>

      <div className="adm-tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`adm-tab${subTab === 'partneri' ? ' active' : ''}`} onClick={() => setSubTab('partneri')}>
          Partneri ({partners.length})
        </button>
        <button className={`adm-tab${subTab === 'fondovi' ? ' active' : ''}`} onClick={() => setSubTab('fondovi')}>
          Fondovi ({fondoviList.length})
        </button>
      </div>

      {loading ? (
        <p className="adm-loading">Učitavanje...</p>
      ) : subTab === 'partneri' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="adm-add-btn" onClick={() => { setShowNewPartner(true); setEditingPartner(null) }}>
              + Dodaj partnera
            </button>
          </div>
          <div className="adm-cards">
            {partners.map(p => (
              <div key={p.id} className={`adm-card${!p.visible ? ' adm-card--hidden' : ''}`}>
                <div className="adm-card-top">
                  {p.logo_url && <img src={p.logo_url} alt="" className="adm-pi-thumb" style={{ objectFit: 'contain', background: '#f5f5f5' }} />}
                  <div className="adm-card-info">
                    <h3>{p.name}</h3>
                    {p.website_url && <p style={{ fontSize: '0.8rem', color: '#888' }}>{p.website_url}</p>}
                  </div>
                </div>
                <div className="adm-card-actions">
                  <button className="adm-btn adm-btn--edit" onClick={() => { setEditingPartner(p); setShowNewPartner(false) }}>Izmeni</button>
                  <button className={`adm-btn ${p.visible ? 'adm-btn--hide' : 'adm-btn--show'}`} onClick={() => togglePartnerVisibility(p)}>
                    {p.visible ? 'Sakrij' : 'Prikaži'}
                  </button>
                  <button className="adm-btn adm-btn--delete" onClick={() => deletePartner(p.id)}>Obriši</button>
                </div>
                {!p.visible && <span className="adm-card-badge">Skriveno</span>}
              </div>
            ))}
            {partners.length === 0 && <p className="adm-loading">Nema partnera. Dodajte novog partnera.</p>}
          </div>
          {(editingPartner || showNewPartner) && (
            <PartnerEditor
              partner={editingPartner}
              onSave={() => { setEditingPartner(null); setShowNewPartner(false); loadData() }}
              onCancel={() => { setEditingPartner(null); setShowNewPartner(false) }}
            />
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="adm-add-btn" onClick={() => { setShowNewFond(true); setEditingFond(null) }}>
              + Dodaj fond
            </button>
          </div>
          <div className="adm-cards">
            {fondoviList.map(f => (
              <div key={f.id} className={`adm-card${!f.visible ? ' adm-card--hidden' : ''}`}>
                <div className="adm-card-top">
                  <div className="adm-card-info">
                    <h3>{f.name}</h3>
                    <p>{f.description.slice(0, 120)}{f.description.length > 120 ? '...' : ''}</p>
                  </div>
                </div>
                <div className="adm-card-actions">
                  <button className="adm-btn adm-btn--edit" onClick={() => { setEditingFond(f); setShowNewFond(false) }}>Izmeni</button>
                  <button className={`adm-btn ${f.visible ? 'adm-btn--hide' : 'adm-btn--show'}`} onClick={() => toggleFondVisibility(f)}>
                    {f.visible ? 'Sakrij' : 'Prikaži'}
                  </button>
                  <button className="adm-btn adm-btn--delete" onClick={() => deleteFond(f.id)}>Obriši</button>
                </div>
                {!f.visible && <span className="adm-card-badge">Skriveno</span>}
              </div>
            ))}
            {fondoviList.length === 0 && <p className="adm-loading">Nema fondova. Dodajte novi fond.</p>}
          </div>
          {(editingFond || showNewFond) && (
            <FondEditor
              fond={editingFond}
              onSave={() => { setEditingFond(null); setShowNewFond(false); loadData() }}
              onCancel={() => { setEditingFond(null); setShowNewFond(false) }}
            />
          )}
        </>
      )}
    </>
  )
}

function PartnerEditor({ partner, onSave, onCancel }: {
  partner: Partner | null; onSave: () => void; onCancel: () => void
}) {
  const isNew = !partner
  const [name, setName] = useState(partner?.name ?? '')
  const [logoUrl, setLogoUrl] = useState(partner?.logo_url ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(partner?.website_url ?? '')
  const [sortOrder, setSortOrder] = useState(partner?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  async function handleLogoSelect(file: File) {
    setUploadingLogo(true)
    try { setLogoUrl(await compressAndUpload(file)) } catch { alert('Greška pri uploadu logoa.') }
    setUploadingLogo(false)
  }

  async function handleSave() {
    if (!name.trim()) return alert('Unesite ime partnera.')
    setSaving(true)
    const payload = { name: name.trim(), logo_url: logoUrl, website_url: websiteUrl, sort_order: sortOrder, ...(isNew ? { visible: true as const } : {}) }
    if (isNew) {
      await supabase.from('partners').insert(payload)
    } else {
      await supabase.from('partners').update(payload).eq('id', partner!.id)
    }
    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={onCancel}>
      <div className="adm-editor" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Novi Partner' : `Izmeni: ${partner!.name}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="adm-editor-body">
          <div className="adm-field">
            <label>Ime partnera</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Naziv firme / donatora" />
          </div>
          <div className="adm-field">
            <label>Website URL</label>
            <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="adm-field">
            <label>Redosled</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(+e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Logotip</label>
            {logoUrl && <img src={logoUrl} alt="" style={{ width: 100, height: 100, objectFit: 'contain', background: '#f5f5f5', borderRadius: 10, marginBottom: 8 }} />}
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleLogoSelect(e.target.files[0])} />
            {uploadingLogo && <span style={{ fontSize: '0.8rem', color: '#888' }}>Uploadujem...</span>}
          </div>
        </div>
        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving}>
            {saving ? 'Čuvam...' : isNew ? 'Dodaj partnera' : 'Sačuvaj izmene'}
          </button>
          <button className="adm-btn" onClick={onCancel}>Otkaži</button>
        </div>
      </div>
    </div>
  )
}

function FondEditor({ fond, onSave, onCancel }: {
  fond: Fond | null; onSave: () => void; onCancel: () => void
}) {
  const isNew = !fond
  const [name, setName] = useState(fond?.name ?? '')
  const [description, setDescription] = useState(fond?.description ?? '')
  const [sortOrder, setSortOrder] = useState(fond?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) return alert('Unesite naziv fonda.')
    setSaving(true)
    const payload = { name: name.trim(), description: description.trim(), sort_order: sortOrder, ...(isNew ? { visible: true as const } : {}) }
    if (isNew) {
      await supabase.from('fondovi').insert(payload)
    } else {
      await supabase.from('fondovi').update(payload).eq('id', fond!.id)
    }
    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={onCancel}>
      <div className="adm-editor" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Novi Fond' : `Izmeni: ${fond!.name}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="adm-editor-body">
          <div className="adm-field">
            <label>Naziv fonda</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Npr. Kohezijski fond" />
          </div>
          <div className="adm-field">
            <label>Opis</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Kratak opis fonda..." />
          </div>
          <div className="adm-field">
            <label>Redosled</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(+e.target.value)} />
          </div>
        </div>
        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving}>
            {saving ? 'Čuvam...' : isNew ? 'Dodaj fond' : 'Sačuvaj izmene'}
          </button>
          <button className="adm-btn" onClick={onCancel}>Otkaži</button>
        </div>
      </div>
    </div>
  )
}

/* ======================================= */
/*  ADMIN PROJEKTI & INICIJATIVE PANEL     */
/* ======================================= */

function AdminProjektiPanel() {
  const [subTab, setSubTab] = useState<'projekti' | 'inicijative'>('inicijative')
  const [projects, setProjects] = useState<Project[]>([])
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewInitiative, setShowNewInitiative] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data: projData }, { data: initData }] = await Promise.all([
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('initiatives').select('*').order('sort_order'),
    ])
    setProjects(projData ?? [])
    setInitiatives(initData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function toggleProjectVisibility(p: Project) {
    await supabase.from('projects').update({ visible: !p.visible }).eq('id', p.id)
    loadData()
  }

  async function deleteProject(id: string) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj projekat?')) return
    await supabase.from('projects').delete().eq('id', id)
    loadData()
  }

  async function toggleInitiativeVisibility(i: Initiative) {
    await supabase.from('initiatives').update({ visible: !i.visible }).eq('id', i.id)
    loadData()
  }

  async function deleteInitiative(id: string) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu inicijativu?')) return
    await supabase.from('initiatives').delete().eq('id', id)
    loadData()
  }

  const statusLabel = (s: string) => {
    if (s === 'aktivan') return 'Aktivan'
    if (s === 'zavrsen') return 'Završen'
    if (s === 'planiran') return 'Planiran'
    return s
  }

  const statusClass = (s: string) => {
    if (s === 'aktivan') return 'adm-pi-status--active'
    if (s === 'zavrsen') return 'adm-pi-status--done'
    return 'adm-pi-status--planned'
  }

  return (
    <>
      <div className="adm-header">
        <h1>Projekti i Inicijative</h1>
      </div>

      <div className="adm-tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`adm-tab${subTab === 'projekti' ? ' active' : ''}`} onClick={() => setSubTab('projekti')}>
          Projekti ({projects.length})
        </button>
        <button className={`adm-tab${subTab === 'inicijative' ? ' active' : ''}`} onClick={() => setSubTab('inicijative')}>
          Inicijative ({initiatives.length})
        </button>
      </div>

      {loading ? (
        <p className="adm-loading">Učitavanje...</p>
      ) : subTab === 'projekti' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="adm-add-btn" onClick={() => { setShowNewProject(true); setEditingProject(null) }}>
              + Dodaj projekat
            </button>
          </div>
          <div className="adm-cards">
            {projects.map(p => (
              <div key={p.id} className={`adm-card${!p.visible ? ' adm-card--hidden' : ''}`}>
                <div className="adm-card-top">
                  {p.cover_image && <img src={p.cover_image} alt="" className="adm-pi-thumb" />}
                  <div className="adm-card-info">
                    <h3>{p.title}</h3>
                    <p>{p.description.slice(0, 100)}...</p>
                    <span className={`adm-pi-status ${statusClass(p.status)}`}>{statusLabel(p.status)}</span>
                  </div>
                </div>
                <div className="adm-card-actions">
                  <button className="adm-btn adm-btn--edit" onClick={() => { setEditingProject(p); setShowNewProject(false) }}>Izmeni</button>
                  <button className={`adm-btn ${p.visible ? 'adm-btn--hide' : 'adm-btn--show'}`} onClick={() => toggleProjectVisibility(p)}>
                    {p.visible ? 'Sakrij' : 'Prikaži'}
                  </button>
                  <button className="adm-btn adm-btn--delete" onClick={() => deleteProject(p.id)}>Obriši</button>
                </div>
                {!p.visible && <span className="adm-card-badge">Skriveno</span>}
              </div>
            ))}
            {projects.length === 0 && <p className="adm-loading">Nema projekata. Dodajte novi projekat.</p>}
          </div>
          {(editingProject || showNewProject) && (
            <ProjectEditor
              project={editingProject}
              onSave={() => { setEditingProject(null); setShowNewProject(false); loadData() }}
              onCancel={() => { setEditingProject(null); setShowNewProject(false) }}
            />
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="adm-add-btn" onClick={() => { setShowNewInitiative(true); setEditingInitiative(null) }}>
              + Dodaj inicijativu
            </button>
          </div>
          <div className="adm-cards">
            {initiatives.map(i => (
              <div key={i.id} className={`adm-card${!i.visible ? ' adm-card--hidden' : ''}`}>
                <div className="adm-card-top">
                  {i.cover_image && <img src={i.cover_image} alt="" className="adm-pi-thumb" />}
                  <div className="adm-card-info">
                    <h3>{i.title}</h3>
                    <p>{i.description.slice(0, 100)}...</p>
                    <span className={`adm-pi-status ${statusClass(i.status)}`}>{statusLabel(i.status)}</span>
                    {i.date_text && <span className="adm-pi-date">{i.date_text}</span>}
                  </div>
                </div>
                <div className="adm-card-actions">
                  <button className="adm-btn adm-btn--edit" onClick={() => { setEditingInitiative(i); setShowNewInitiative(false) }}>Izmeni</button>
                  <button className={`adm-btn ${i.visible ? 'adm-btn--hide' : 'adm-btn--show'}`} onClick={() => toggleInitiativeVisibility(i)}>
                    {i.visible ? 'Sakrij' : 'Prikaži'}
                  </button>
                  <button className="adm-btn adm-btn--delete" onClick={() => deleteInitiative(i.id)}>Obriši</button>
                </div>
                {!i.visible && <span className="adm-card-badge">Skriveno</span>}
              </div>
            ))}
            {initiatives.length === 0 && <p className="adm-loading">Nema inicijativa. Dodajte novu inicijativu.</p>}
          </div>
          {(editingInitiative || showNewInitiative) && (
            <InitiativeEditor
              initiative={editingInitiative}
              onSave={() => { setEditingInitiative(null); setShowNewInitiative(false); loadData() }}
              onCancel={() => { setEditingInitiative(null); setShowNewInitiative(false) }}
            />
          )}
        </>
      )}
    </>
  )
}

/* ======================================= */
/*  PROJECT EDITOR                         */
/* ======================================= */

function ProjectEditor({ project, onSave, onCancel }: {
  project: Project | null; onSave: () => void; onCancel: () => void
}) {
  const isNew = !project
  const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'activities' | 'phases'>('info')
  const [title, setTitle] = useState(project?.title ?? '')
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [status, setStatus] = useState(project?.status ?? 'aktivan')
  const [coverImage, setCoverImage] = useState(project?.cover_image ?? '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [dateText, setDateText] = useState(project?.date_text ?? '')
  const [partner, setPartner] = useState(project?.partner ?? '')
  const [category, setCategory] = useState(project?.category ?? '')
  const [goals, setGoals] = useState((project as unknown as Record<string, string>)?.goals ?? '')
  const [progressPct, setProgressPct] = useState(project?.progress_pct ?? 0)
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)

  const [docs, setDocs] = useState<ProjectDocument[]>([])
  const [docsLoaded, setDocsLoaded] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [showNewActivity, setShowNewActivity] = useState(false)
  const [phases, setPhases] = useState<ProjectPhase[]>([])
  const [editingPhase, setEditingPhase] = useState<ProjectPhase | null>(null)
  const [showNewPhase, setShowNewPhase] = useState(false)

  useEffect(() => {
    if (!project) { setDocsLoaded(true); return }
    Promise.all([
      supabase.from('project_documents').select('*').eq('project_id', project.id).order('sort_order'),
      supabase.from('project_activities').select('*').eq('parent_type', 'project').eq('parent_id', project.id).order('activity_date', { ascending: false }),
      supabase.from('project_phases').select('*').eq('project_id', project.id).order('sort_order'),
    ]).then(([{ data: d }, { data: a }, { data: p }]) => {
      setDocs(d ?? [])
      setActivities(a ?? [])
      setPhases(p ?? [])
      setDocsLoaded(true)
    })
  }, [project])

  function loadActivities() {
    if (!project) return
    supabase.from('project_activities').select('*').eq('parent_type', 'project').eq('parent_id', project.id)
      .order('activity_date', { ascending: false })
      .then(({ data }) => setActivities(data ?? []))
  }

  function loadPhases() {
    if (!project) return
    supabase.from('project_phases').select('*').eq('project_id', project.id).order('sort_order')
      .then(({ data }) => setPhases(data ?? []))
  }

  function makeSlug(text: string) {
    return text.toLowerCase()
      .replace(/[čć]/g, 'c').replace(/[šś]/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleCoverSelect(file: File) {
    setUploadingCover(true)
    try { setCoverImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingCover(false)
  }

  function addDoc() {
    setDocs(prev => [...prev, { id: `new-${Date.now()}`, project_id: project?.id ?? '', title: '', url: '', file_type: 'link', sort_order: prev.length + 1 }])
  }

  function updateDoc(idx: number, updated: ProjectDocument) { setDocs(prev => prev.map((d, i) => i === idx ? updated : d)) }
  function removeDoc(idx: number) { setDocs(prev => prev.filter((_, i) => i !== idx)) }

  async function deleteActivity(id: string) {
    if (!confirm('Obrisati ovu aktivnost i sve njene dokumente i fotografije?')) return
    await supabase.from('project_activities').delete().eq('id', id)
    loadActivities()
  }

  async function changeActivityStatus(id: string, newStatus: string) {
    await supabase.from('project_activities').update({ status: newStatus }).eq('id', id)
    loadActivities()
  }

  async function deletePhase(id: string) {
    if (!confirm('Obrisati ovu fazu?')) return
    await supabase.from('project_phases').delete().eq('id', id)
    loadPhases()
  }

  async function changePhaseStatus(id: string, newStatus: string) {
    await supabase.from('project_phases').update({ status: newStatus }).eq('id', id)
    loadPhases()
  }

  async function handleSave() {
    if (!title.trim()) { alert('Unesite naslov projekta.'); return }
    setSaving(true)
    const finalSlug = slug || makeSlug(title)
    const payload: Record<string, unknown> = {
      title: title.trim(), slug: finalSlug, description, status,
      cover_image: coverImage, date_text: dateText, partner, category,
      progress_pct: progressPct, sort_order: sortOrder,
      ...(isNew ? { visible: true as const } : {}),
    }

    let projectId = project?.id

    if (isNew) {
      const { data, error } = await supabase.from('projects').insert(payload).select('id').single()
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
      projectId = data.id
    } else {
      const { error } = await supabase.from('projects').update(payload).eq('id', project!.id)
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
    }

    if (projectId) {
      await supabase.from('project_documents').delete().eq('project_id', projectId)
      if (docs.length > 0) {
        const docPayloads = docs.map((d, idx) => ({
          project_id: projectId!, title: d.title, url: d.url, file_type: d.file_type, sort_order: idx + 1,
        }))
        const { error: docErr } = await supabase.from('project_documents').insert(docPayloads)
        if (docErr) { alert('Greška pri čuvanju dokumenata: ' + docErr.message); setSaving(false); return }
      }
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={onCancel}>
      <div className="adm-editor adm-editor--wide" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Novi projekat' : `Izmeni: ${project?.title}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>

        <div className="adm-tabs">
          <button className={`adm-tab${activeTab === 'info' ? ' active' : ''}`} onClick={() => setActiveTab('info')}>Podaci</button>
          <button className={`adm-tab${activeTab === 'activities' ? ' active' : ''}`} onClick={() => setActiveTab('activities')}>Aktivnosti ({activities.length})</button>
          <button className={`adm-tab${activeTab === 'phases' ? ' active' : ''}`} onClick={() => setActiveTab('phases')}>Faze ({phases.length})</button>
          <button className={`adm-tab${activeTab === 'docs' ? ' active' : ''}`} onClick={() => setActiveTab('docs')}>Dokumenti ({docs.length})</button>
        </div>

        <div className="adm-editor-body">
          {!docsLoaded ? (
            <p className="adm-loading">Učitavanje...</p>
          ) : activeTab === 'info' ? (
            <>
              <div className="adm-field">
                <label>Naslov</label>
                <input value={title} onChange={e => { setTitle(e.target.value); if (isNew) setSlug(makeSlug(e.target.value)) }} />
              </div>
              <div className="adm-field">
                <label>Slug (URL)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Opis / Tekst</label>
                <textarea rows={8} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Ciljevi (svaki cilj u novom redu)</label>
                <textarea rows={4} value={goals} onChange={e => setGoals(e.target.value)} placeholder="Cilj 1&#10;Cilj 2&#10;Cilj 3" />
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as Project['status'])}>
                    <option value="aktivan">Aktivan</option>
                    <option value="zavrsen">Završen</option>
                    <option value="planiran">Planiran</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label>Datum</label>
                  <input value={dateText} onChange={e => setDateText(e.target.value)} placeholder="npr. Q2 2025 — Q4 2025" />
                </div>
              </div>
              <div className="adm-field">
                <label>Partner / Donator</label>
                <input value={partner} onChange={e => setPartner(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Tematska kategorija</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">— Bez kategorije —</option>
                  {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label>Napredak (%)</label>
                  <input type="number" min={0} max={100} value={progressPct} onChange={e => setProgressPct(Number(e.target.value))} style={{ maxWidth: 100 }} />
                </div>
                <div className="adm-field">
                  <label>Redosled</label>
                  <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={{ maxWidth: 100 }} />
                </div>
              </div>
              <div className="adm-field">
                <label>Cover slika</label>
                <AdminImageBtn imageUrl={coverImage} uploading={uploadingCover} onSelect={handleCoverSelect} onRemove={() => setCoverImage('')} />
              </div>
            </>
          ) : activeTab === 'activities' ? (
            <div className="adm-items-list">
              <p className="adm-items-hint">Aktivnosti se prikazuju kao timeline na stranici projekta. Svaka aktivnost ima svoju podstranicu.</p>
              {!project ? (
                <p className="adm-loading">Sačuvajte projekat prvo, pa dodajte aktivnosti.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button className="adm-btn adm-btn--save" onClick={() => { setShowNewActivity(true); setEditingActivity(null) }}>+ Nova aktivnost</button>
                  </div>
                  {activities.map(act => (
                    <div key={act.id} className="adm-act-row">
                      <div className="adm-act-row-info">
                        <time className="adm-act-row-date">{new Date(act.activity_date).toLocaleDateString('sr-Latn')}</time>
                        <select
                          className={`adm-status-select adm-status-select--${act.status === 'zavrseno' ? 'done' : act.status === 'u_toku' ? 'active' : 'planned'}`}
                          value={act.status}
                          onChange={e => changeActivityStatus(act.id, e.target.value)}
                        >
                          <option value="planirano">Planirano</option>
                          <option value="u_toku">U toku</option>
                          <option value="zavrseno">Završeno</option>
                        </select>
                        <strong>{act.title}</strong>
                      </div>
                      <div className="adm-card-actions" style={{ flexShrink: 0 }}>
                        <button className="adm-btn adm-btn--edit" onClick={() => { setEditingActivity(act); setShowNewActivity(false) }}>Izmeni</button>
                        <button className="adm-btn adm-btn--delete" onClick={() => deleteActivity(act.id)}>Obriši</button>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && <p className="adm-loading">Nema aktivnosti. Dodajte prvu aktivnost.</p>}
                </>
              )}
            </div>
          ) : activeTab === 'phases' ? (
            <div className="adm-items-list">
              <p className="adm-items-hint">Faze projekta prikazuju se kao kartice na stranici projekta.</p>
              {!project ? (
                <p className="adm-loading">Sačuvajte projekat prvo, pa dodajte faze.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button className="adm-btn adm-btn--save" onClick={() => { setShowNewPhase(true); setEditingPhase(null) }}>+ Nova faza</button>
                  </div>
                  {phases.map((ph, idx) => (
                    <div key={ph.id} className="adm-act-row">
                      <div className="adm-act-row-info">
                        <span style={{ color: '#999', fontWeight: 600, fontSize: '0.8rem' }}>Faza {idx + 1}</span>
                        <select
                          className={`adm-status-select adm-status-select--${ph.status === 'zavrseno' ? 'done' : ph.status === 'u_toku' ? 'active' : 'planned'}`}
                          value={ph.status}
                          onChange={e => changePhaseStatus(ph.id, e.target.value)}
                        >
                          <option value="planirano">Planirano</option>
                          <option value="u_toku">U toku</option>
                          <option value="zavrseno">Završeno</option>
                        </select>
                        <strong>{ph.title}</strong>
                      </div>
                      <div className="adm-card-actions" style={{ flexShrink: 0 }}>
                        <button className="adm-btn adm-btn--edit" onClick={() => { setEditingPhase(ph); setShowNewPhase(false) }}>Izmeni</button>
                        <button className="adm-btn adm-btn--delete" onClick={() => deletePhase(ph.id)}>Obriši</button>
                      </div>
                    </div>
                  ))}
                  {phases.length === 0 && <p className="adm-loading">Nema faza. Dodajte prvu fazu.</p>}
                </>
              )}
            </div>
          ) : (
            <div className="adm-items-list">
              <p className="adm-items-hint">Opšti dokumenti vezani za ceo projekat (ugovor, izveštaji, prezentacije).</p>
              {docs.map((doc, idx) => (
                <DocRow
                  key={doc.id}
                  doc={{ ...doc, topic_id: doc.project_id } as TopicDocument}
                  onChange={updated => updateDoc(idx, { ...updated, project_id: doc.project_id } as unknown as ProjectDocument)}
                  onDelete={() => removeDoc(idx)}
                />
              ))}
              <button className="adm-btn adm-btn--add-item" onClick={addDoc}>+ Dodaj dokument</button>
            </div>
          )}
        </div>

        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--cancel" onClick={onCancel}>Otkaži</button>
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving || uploadingCover}>
            {saving ? 'Čuvanje...' : (isNew ? 'Kreiraj' : 'Sačuvaj')}
          </button>
        </div>
      </div>

      {/* Activity editor popup */}
      {(editingActivity || showNewActivity) && project && (
        <ActivityEditor
          activity={editingActivity}
          parentType="project"
          parentId={project.id}
          onSave={() => { setEditingActivity(null); setShowNewActivity(false); loadActivities() }}
          onCancel={() => { setEditingActivity(null); setShowNewActivity(false) }}
        />
      )}

      {/* Phase editor popup */}
      {(editingPhase || showNewPhase) && project && (
        <PhaseEditor
          phase={editingPhase}
          projectId={project.id}
          onSave={() => { setEditingPhase(null); setShowNewPhase(false); loadPhases() }}
          onCancel={() => { setEditingPhase(null); setShowNewPhase(false) }}
        />
      )}
    </div>
  )
}

/* ======================================= */
/*  INITIATIVE EDITOR                      */
/* ======================================= */

function InitiativeEditor({ initiative, onSave, onCancel }: {
  initiative: Initiative | null; onSave: () => void; onCancel: () => void
}) {
  const isNew = !initiative
  const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'activities'>('info')
  const [title, setTitle] = useState(initiative?.title ?? '')
  const [slug, setSlug] = useState(initiative?.slug ?? '')
  const [description, setDescription] = useState(initiative?.description ?? '')
  const [status, setStatus] = useState(initiative?.status ?? 'aktivan')
  const [coverImage, setCoverImage] = useState(initiative?.cover_image ?? '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [dateText, setDateText] = useState(initiative?.date_text ?? '')
  const [category, setCategory] = useState(initiative?.category ?? '')
  const [goals, setGoals] = useState((initiative as unknown as Record<string, string>)?.goals ?? '')
  const [sortOrder, setSortOrder] = useState(initiative?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)

  const [docs, setDocs] = useState<InitiativeDocument[]>([])
  const [docsLoaded, setDocsLoaded] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [showNewActivity, setShowNewActivity] = useState(false)

  useEffect(() => {
    if (!initiative) { setDocsLoaded(true); return }
    Promise.all([
      supabase.from('initiative_documents').select('*').eq('initiative_id', initiative.id).order('sort_order'),
      supabase.from('project_activities').select('*').eq('parent_type', 'initiative').eq('parent_id', initiative.id).order('activity_date', { ascending: false }),
    ]).then(([{ data: d }, { data: a }]) => {
      setDocs(d ?? [])
      setActivities(a ?? [])
      setDocsLoaded(true)
    })
  }, [initiative])

  function loadActivities() {
    if (!initiative) return
    supabase.from('project_activities').select('*').eq('parent_type', 'initiative').eq('parent_id', initiative.id)
      .order('activity_date', { ascending: false })
      .then(({ data }) => setActivities(data ?? []))
  }

  function makeSlug(text: string) {
    return text.toLowerCase()
      .replace(/[čć]/g, 'c').replace(/[šś]/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleCoverSelect(file: File) {
    setUploadingCover(true)
    try { setCoverImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingCover(false)
  }

  function addDoc() {
    setDocs(prev => [...prev, { id: `new-${Date.now()}`, initiative_id: initiative?.id ?? '', title: '', url: '', file_type: 'link', sort_order: prev.length + 1 }])
  }
  function updateDoc(idx: number, updated: InitiativeDocument) { setDocs(prev => prev.map((d, i) => i === idx ? updated : d)) }
  function removeDoc(idx: number) { setDocs(prev => prev.filter((_, i) => i !== idx)) }

  async function deleteActivity(id: string) {
    if (!confirm('Obrisati ovu aktivnost i sve njene dokumente i fotografije?')) return
    await supabase.from('project_activities').delete().eq('id', id)
    loadActivities()
  }

  async function changeActivityStatus(id: string, newStatus: string) {
    await supabase.from('project_activities').update({ status: newStatus }).eq('id', id)
    loadActivities()
  }

  async function handleSave() {
    if (!title.trim()) { alert('Unesite naslov inicijative.'); return }
    setSaving(true)
    const finalSlug = slug || makeSlug(title)
    const payload: Record<string, unknown> = {
      title: title.trim(), slug: finalSlug, description, status,
      cover_image: coverImage, date_text: dateText, category, sort_order: sortOrder,
      ...(isNew ? { visible: true as const } : {}),
    }

    let initiativeId = initiative?.id

    if (isNew) {
      const { data, error } = await supabase.from('initiatives').insert(payload).select('id').single()
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
      initiativeId = data.id
    } else {
      const { error } = await supabase.from('initiatives').update(payload).eq('id', initiative!.id)
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
    }

    if (initiativeId) {
      await supabase.from('initiative_documents').delete().eq('initiative_id', initiativeId)
      if (docs.length > 0) {
        const docPayloads = docs.map((d, idx) => ({
          initiative_id: initiativeId!, title: d.title, url: d.url, file_type: d.file_type, sort_order: idx + 1,
        }))
        const { error: docErr } = await supabase.from('initiative_documents').insert(docPayloads)
        if (docErr) { alert('Greška pri čuvanju dokumenata: ' + docErr.message); setSaving(false); return }
      }
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={onCancel}>
      <div className="adm-editor adm-editor--wide" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Nova inicijativa' : `Izmeni: ${initiative?.title}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>

        <div className="adm-tabs">
          <button className={`adm-tab${activeTab === 'info' ? ' active' : ''}`} onClick={() => setActiveTab('info')}>Podaci</button>
          <button className={`adm-tab${activeTab === 'activities' ? ' active' : ''}`} onClick={() => setActiveTab('activities')}>Aktivnosti ({activities.length})</button>
          <button className={`adm-tab${activeTab === 'docs' ? ' active' : ''}`} onClick={() => setActiveTab('docs')}>Dokumenti ({docs.length})</button>
        </div>

        <div className="adm-editor-body">
          {!docsLoaded ? (
            <p className="adm-loading">Učitavanje...</p>
          ) : activeTab === 'info' ? (
            <>
              <div className="adm-field">
                <label>Naslov</label>
                <input value={title} onChange={e => { setTitle(e.target.value); if (isNew) setSlug(makeSlug(e.target.value)) }} />
              </div>
              <div className="adm-field">
                <label>Slug (URL)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Tekst / Saopštenje</label>
                <textarea rows={10} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Ciljevi (svaki cilj u novom redu)</label>
                <textarea rows={4} value={goals} onChange={e => setGoals(e.target.value)} placeholder="Cilj 1&#10;Cilj 2&#10;Cilj 3" />
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as Initiative['status'])}>
                    <option value="aktivan">Aktivan</option>
                    <option value="zavrsen">Završen</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label>Datum</label>
                  <input value={dateText} onChange={e => setDateText(e.target.value)} placeholder="npr. 22.8.2025." />
                </div>
                <div className="adm-field">
                  <label>Redosled</label>
                  <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={{ maxWidth: 120 }} />
                </div>
              </div>
              <div className="adm-field">
                <label>Tematska kategorija</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">— Bez kategorije —</option>
                  {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-field">
                <label>Cover slika</label>
                <AdminImageBtn imageUrl={coverImage} uploading={uploadingCover} onSelect={handleCoverSelect} onRemove={() => setCoverImage('')} />
              </div>
            </>
          ) : activeTab === 'activities' ? (
            <div className="adm-items-list">
              <p className="adm-items-hint">Aktivnosti se prikazuju kao timeline na stranici inicijative. Svaka aktivnost ima svoju podstranicu.</p>
              {!initiative ? (
                <p className="adm-loading">Sačuvajte inicijativu prvo, pa dodajte aktivnosti.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button className="adm-btn adm-btn--save" onClick={() => { setShowNewActivity(true); setEditingActivity(null) }}>+ Nova aktivnost</button>
                  </div>
                  {activities.map(act => (
                    <div key={act.id} className="adm-act-row">
                      <div className="adm-act-row-info">
                        <time className="adm-act-row-date">{new Date(act.activity_date).toLocaleDateString('sr-Latn')}</time>
                        <select
                          className={`adm-status-select adm-status-select--${act.status === 'zavrseno' ? 'done' : act.status === 'u_toku' ? 'active' : 'planned'}`}
                          value={act.status}
                          onChange={e => changeActivityStatus(act.id, e.target.value)}
                        >
                          <option value="planirano">Planirano</option>
                          <option value="u_toku">U toku</option>
                          <option value="zavrseno">Završeno</option>
                        </select>
                        <strong>{act.title}</strong>
                      </div>
                      <div className="adm-card-actions" style={{ flexShrink: 0 }}>
                        <button className="adm-btn adm-btn--edit" onClick={() => { setEditingActivity(act); setShowNewActivity(false) }}>Izmeni</button>
                        <button className="adm-btn adm-btn--delete" onClick={() => deleteActivity(act.id)}>Obriši</button>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && <p className="adm-loading">Nema aktivnosti. Dodajte prvu aktivnost.</p>}
                </>
              )}
            </div>
          ) : (
            <div className="adm-items-list">
              <p className="adm-items-hint">Opšti dokumenti vezani za celu inicijativu.</p>
              {docs.map((doc, idx) => (
                <DocRow
                  key={doc.id}
                  doc={{ ...doc, topic_id: doc.initiative_id } as TopicDocument}
                  onChange={updated => updateDoc(idx, { ...updated, initiative_id: doc.initiative_id } as unknown as InitiativeDocument)}
                  onDelete={() => removeDoc(idx)}
                />
              ))}
              <button className="adm-btn adm-btn--add-item" onClick={addDoc}>+ Dodaj dokument</button>
            </div>
          )}
        </div>

        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--cancel" onClick={onCancel}>Otkaži</button>
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving || uploadingCover}>
            {saving ? 'Čuvanje...' : (isNew ? 'Kreiraj' : 'Sačuvaj')}
          </button>
        </div>
      </div>

      {/* Activity editor popup */}
      {(editingActivity || showNewActivity) && initiative && (
        <ActivityEditor
          activity={editingActivity}
          parentType="initiative"
          parentId={initiative.id}
          onSave={() => { setEditingActivity(null); setShowNewActivity(false); loadActivities() }}
          onCancel={() => { setEditingActivity(null); setShowNewActivity(false) }}
        />
      )}
    </div>
  )
}

/* ======================================= */
/*  ACTIVITY EDITOR                        */
/* ======================================= */

function ActivityEditor({ activity, parentType, parentId, onSave, onCancel }: {
  activity: Activity | null; parentType: 'project' | 'initiative'; parentId: string; onSave: () => void; onCancel: () => void
}) {
  const isNew = !activity
  const [activeTab, setActiveTab] = useState<'info' | 'docs' | 'gallery'>('info')
  const [title, setTitle] = useState(activity?.title ?? '')
  const [slug, setSlug] = useState(activity?.slug ?? '')
  const [activityDate, setActivityDate] = useState(activity?.activity_date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10))
  const [shortDesc, setShortDesc] = useState(activity?.short_desc ?? '')
  const [description, setDescription] = useState(activity?.description ?? '')
  const [goals, setGoals] = useState(activity?.goals ?? '')
  const [status, setStatus] = useState(activity?.status ?? 'planirano')
  const [coverImage, setCoverImage] = useState(activity?.cover_image ?? '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [partners, setPartners] = useState(activity?.partners ?? '')
  const [saving, setSaving] = useState(false)

  const [docs, setDocs] = useState<ActivityDocument[]>([])
  const [gallery, setGallery] = useState<ActivityGalleryImage[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  useEffect(() => {
    if (!activity) { setDataLoaded(true); return }
    Promise.all([
      supabase.from('activity_documents').select('*').eq('activity_id', activity.id).order('sort_order'),
      supabase.from('activity_gallery').select('*').eq('activity_id', activity.id).order('sort_order'),
    ]).then(([{ data: d }, { data: g }]) => {
      setDocs(d ?? [])
      setGallery(g ?? [])
      setDataLoaded(true)
    })
  }, [activity])

  function makeSlug(text: string) {
    return text.toLowerCase()
      .replace(/[čć]/g, 'c').replace(/[šś]/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleCoverSelect(file: File) {
    setUploadingCover(true)
    try { setCoverImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingCover(false)
  }

  function addDoc() {
    setDocs(prev => [...prev, { id: `new-${Date.now()}`, activity_id: activity?.id ?? '', title: '', url: '', file_type: 'pdf', sort_order: prev.length + 1 }])
  }

  async function handleDocFileUpload(idx: number, file: File) {
    const ext = file.name.split('.').pop()
    const path = `forum/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
    if (error) { alert('Greška pri uploadu fajla: ' + error.message); return }
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path)
    const isPdf = ext?.toLowerCase() === 'pdf'
    const updatedDoc = { ...docs[idx], url: urlData.publicUrl, file_type: isPdf ? 'pdf' : 'file', title: docs[idx].title || file.name }
    setDocs(prev => prev.map((d, i) => i === idx ? updatedDoc : d))
  }

  async function handleGalleryUpload(files: FileList) {
    setUploadingGallery(true)
    const newImages: ActivityGalleryImage[] = []
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await compressAndUpload(files[i])
        newImages.push({ id: `new-${Date.now()}-${i}`, activity_id: activity?.id ?? '', url, alt: '', sort_order: gallery.length + newImages.length + 1 })
      } catch { alert(`Greška pri uploadu slike ${files[i].name}`) }
    }
    setGallery(prev => [...prev, ...newImages])
    setUploadingGallery(false)
  }

  function removeGalleryImage(idx: number) {
    setGallery(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    if (!title.trim()) { alert('Unesite naziv aktivnosti.'); return }
    setSaving(true)
    const finalSlug = slug || makeSlug(title)
    const payload: Record<string, unknown> = {
      parent_type: parentType, parent_id: parentId,
      title: title.trim(), slug: finalSlug, activity_date: activityDate,
      short_desc: shortDesc, description, goals, status,
      cover_image: coverImage, partners,
      visible: true,
    }

    let activityId = activity?.id

    if (isNew) {
      const { data, error } = await supabase.from('project_activities').insert(payload).select('id').single()
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
      activityId = data.id
    } else {
      const { error } = await supabase.from('project_activities').update(payload).eq('id', activity!.id)
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
    }

    if (activityId) {
      await supabase.from('activity_documents').delete().eq('activity_id', activityId)
      if (docs.length > 0) {
        const docPayloads = docs.filter(d => d.title || d.url).map((d, idx) => ({
          activity_id: activityId!, title: d.title, url: d.url, file_type: d.file_type, sort_order: idx + 1,
        }))
        if (docPayloads.length > 0) await supabase.from('activity_documents').insert(docPayloads)
      }

      await supabase.from('activity_gallery').delete().eq('activity_id', activityId)
      if (gallery.length > 0) {
        const galPayloads = gallery.map((g, idx) => ({
          activity_id: activityId!, url: g.url, alt: g.alt, sort_order: idx + 1,
        }))
        await supabase.from('activity_gallery').insert(galPayloads)
      }
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={e => { e.stopPropagation(); onCancel() }} style={{ zIndex: 1100 }}>
      <div className="adm-editor adm-editor--wide" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Nova aktivnost' : `Izmeni: ${activity?.title}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>

        <div className="adm-tabs">
          <button className={`adm-tab${activeTab === 'info' ? ' active' : ''}`} onClick={() => setActiveTab('info')}>Podaci</button>
          <button className={`adm-tab${activeTab === 'docs' ? ' active' : ''}`} onClick={() => setActiveTab('docs')}>Dokumenti ({docs.length})</button>
          <button className={`adm-tab${activeTab === 'gallery' ? ' active' : ''}`} onClick={() => setActiveTab('gallery')}>Galerija ({gallery.length})</button>
        </div>

        <div className="adm-editor-body">
          {!dataLoaded ? (
            <p className="adm-loading">Učitavanje...</p>
          ) : activeTab === 'info' ? (
            <>
              <div className="adm-field">
                <label>Naziv aktivnosti</label>
                <input value={title} onChange={e => { setTitle(e.target.value); if (isNew) setSlug(makeSlug(e.target.value)) }} placeholder="npr. Saopštenje za javnost od 1.4.2026." />
              </div>
              <div className="adm-field">
                <label>Slug (URL)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} />
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label>Datum aktivnosti</label>
                  <input type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} />
                </div>
                <div className="adm-field">
                  <label>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as Activity['status'])}>
                    <option value="planirano">Planirano</option>
                    <option value="u_toku">U toku</option>
                    <option value="zavrseno">Završeno</option>
                  </select>
                </div>
              </div>
              <div className="adm-field">
                <label>Kratak opis (prikazuje se u timeline-u)</label>
                <input value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Kratka rečenica o aktivnosti" />
              </div>
              <div className="adm-field">
                <label>Detaljan opis</label>
                <textarea rows={6} value={description} onChange={e => setDescription(e.target.value)} placeholder="Šta je urađeno, zašto, u kom kontekstu..." />
              </div>
              <div className="adm-field">
                <label>Ciljevi aktivnosti (svaki cilj u novom redu)</label>
                <textarea rows={4} value={goals} onChange={e => setGoals(e.target.value)} placeholder="Informisanje javnosti&#10;Pritisak na institucije&#10;Dokumentovanje stanja" />
              </div>
              <div className="adm-field">
                <label>Partneri (razdvojeni zarezom)</label>
                <input value={partners} onChange={e => setPartners(e.target.value)} placeholder="Lokalna zajednica, Stručni saradnici" />
              </div>
              <div className="adm-field">
                <label>Cover slika</label>
                <AdminImageBtn imageUrl={coverImage} uploading={uploadingCover} onSelect={handleCoverSelect} onRemove={() => setCoverImage('')} />
              </div>
            </>
          ) : activeTab === 'docs' ? (
            <div className="adm-items-list">
              <p className="adm-items-hint">Dokumenti vezani za ovu aktivnost (saopštenja, dopisi, zapisnici — sve u PDF formatu).</p>
              {docs.map((doc, idx) => (
                <div key={doc.id} className="adm-item-row">
                  <div className="adm-doc-fields">
                    <div className="adm-item-field">
                      <label>Naziv</label>
                      <input value={doc.title} onChange={e => setDocs(prev => prev.map((d, i) => i === idx ? { ...d, title: e.target.value } : d))} />
                    </div>
                    <div className="adm-item-field">
                      <label>URL</label>
                      <input value={doc.url} onChange={e => setDocs(prev => prev.map((d, i) => i === idx ? { ...d, url: e.target.value } : d))} />
                    </div>
                    <div className="adm-item-field">
                      <label>Upload PDF</label>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files?.[0] && handleDocFileUpload(idx, e.target.files[0])} />
                    </div>
                  </div>
                  <button className="adm-item-delete" onClick={() => setDocs(prev => prev.filter((_, i) => i !== idx))}>&times;</button>
                </div>
              ))}
              <button className="adm-btn adm-btn--add-item" onClick={addDoc}>+ Dodaj dokument</button>
            </div>
          ) : (
            <div className="adm-items-list">
              <p className="adm-items-hint">Fotografije vezane za ovu aktivnost. Možete dodati više odjednom.</p>
              <div className="adm-gallery-grid">
                {gallery.map((img, idx) => (
                  <div key={img.id} className="adm-gallery-thumb">
                    <img src={img.url} alt="" />
                    <button className="adm-gallery-remove" onClick={() => removeGalleryImage(idx)}>&times;</button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label className="adm-doc-upload-btn" style={{ cursor: 'pointer' }}>
                  {uploadingGallery ? 'Uploadujem...' : '+ Dodaj fotografije'}
                  <input type="file" accept="image/*" multiple hidden onChange={e => e.target.files && handleGalleryUpload(e.target.files)} />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--cancel" onClick={onCancel}>Otkaži</button>
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving || uploadingCover || uploadingGallery}>
            {saving ? 'Čuvanje...' : (isNew ? 'Kreiraj aktivnost' : 'Sačuvaj')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ======================================= */
/*  PHASE EDITOR                           */
/* ======================================= */

function PhaseEditor({ phase, projectId, onSave, onCancel }: {
  phase: ProjectPhase | null; projectId: string; onSave: () => void; onCancel: () => void
}) {
  const isNew = !phase
  const [title, setTitle] = useState(phase?.title ?? '')
  const [description, setDescription] = useState(phase?.description ?? '')
  const [status, setStatus] = useState(phase?.status ?? 'planirano')
  const [coverImage, setCoverImage] = useState(phase?.cover_image ?? '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [sortOrder, setSortOrder] = useState(phase?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)

  async function handleCoverSelect(file: File) {
    setUploadingCover(true)
    try { setCoverImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingCover(false)
  }

  async function handleSave() {
    if (!title.trim()) { alert('Unesite naziv faze.'); return }
    setSaving(true)
    const payload = {
      project_id: projectId, title: title.trim(), description,
      status, cover_image: coverImage, sort_order: sortOrder,
    }

    if (isNew) {
      const { error } = await supabase.from('project_phases').insert(payload)
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('project_phases').update(payload).eq('id', phase!.id)
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={e => { e.stopPropagation(); onCancel() }} style={{ zIndex: 1100 }}>
      <div className="adm-editor" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Nova faza' : `Izmeni: ${phase?.title}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="adm-editor-body">
          <div className="adm-field">
            <label>Naziv faze</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="npr. Pripremna faza" />
          </div>
          <div className="adm-field">
            <label>Opis</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="adm-field-row">
            <div className="adm-field">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as ProjectPhase['status'])}>
                <option value="planirano">Planirano</option>
                <option value="u_toku">U toku</option>
                <option value="zavrseno">Završeno</option>
              </select>
            </div>
            <div className="adm-field">
              <label>Redosled</label>
              <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={{ maxWidth: 100 }} />
            </div>
          </div>
          <div className="adm-field">
            <label>Slika (opciono)</label>
            <AdminImageBtn imageUrl={coverImage} uploading={uploadingCover} onSelect={handleCoverSelect} onRemove={() => setCoverImage('')} />
          </div>
        </div>
        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--cancel" onClick={onCancel}>Otkaži</button>
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving || uploadingCover}>
            {saving ? 'Čuvanje...' : (isNew ? 'Kreiraj fazu' : 'Sačuvaj')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ======================================= */
/*  ADMIN WALL PANEL (Predlozi / Problemi) */
/* ======================================= */

type WallPostWithReplies = WallPost & { replies: WallReply[] }

function AdminWallPanel({ wallType, title }: { wallType: 'predlozi' | 'problemi'; title: string }) {
  const [posts, setPosts] = useState<WallPostWithReplies[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxSrc, setLightboxSrc] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyImage, setReplyImage] = useState('')
  const [uploadingReplyImg, setUploadingReplyImg] = useState(false)

  const loadPosts = useCallback(async () => {
    setLoading(true)
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

  useEffect(() => { loadPosts() }, [loadPosts])

  async function deletePost(postId: string) {
    if (!confirm('Obrisati ovu objavu i sve odgovore?')) return
    const { error } = await supabase.from('wall_posts').delete().eq('id', postId)
    if (error) { alert('Greška: ' + error.message); return }
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  async function deleteReply(replyId: string) {
    if (!confirm('Obrisati ovaj odgovor?')) return
    const { error } = await supabase.from('wall_replies').delete().eq('id', replyId)
    if (error) { alert('Greška: ' + error.message); return }
    setPosts(prev => prev.map(p => ({ ...p, replies: p.replies.filter(r => r.id !== replyId) })))
  }

  async function handleReplyImgSelect(file: File) {
    setUploadingReplyImg(true)
    try { setReplyImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingReplyImg(false)
  }

  async function submitReply(postId: string) {
    if (!replyContent.trim()) return
    const payload: Record<string, unknown> = {
      post_id: postId,
      content: replyContent.trim(),
    }
    if (replyImage) payload.image_url = replyImage

    const { error } = await supabase.from('wall_replies').insert(payload)
    if (error) { alert('Greška pri slanju odgovora: ' + error.message); return }
    setReplyContent('')
    setReplyImage('')
    setReplyingTo(null)
    loadPosts()
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

  return (
    <>
      <div className="adm-header">
        <h1>{title}</h1>
      </div>
      <p className="adm-wall-subtitle">Pregled svih objava na zidu. Možete odgovoriti ili obrisati neprimerene objave.</p>

      {loading ? (
        <p className="adm-loading">Učitavanje objava...</p>
      ) : posts.length === 0 ? (
        <p className="adm-loading">Nema objava na ovom zidu.</p>
      ) : (
        <div className="adm-wall-posts">
          <p className="adm-wall-count">Ukupno objava: <strong>{posts.length}</strong></p>
          {posts.map(post => (
            <div key={post.id} className="adm-wall-post">
              <div className="adm-forum-post-header">
                <div className="adm-forum-post-author">
                  <span className="adm-forum-avatar">
                    {post.author_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                  <span className="adm-forum-post-name">{post.author_name}</span>
                </div>
                <div className="adm-forum-post-meta">
                  <time>{timeAgo(post.created_at)}</time>
                  <button className="adm-btn adm-btn--delete adm-btn--sm" onClick={() => deletePost(post.id)}>Obriši</button>
                </div>
              </div>
              <div className="adm-forum-post-body">
                {post.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
              {post.image_url && (
                <button className="adm-forum-thumb" onClick={() => setLightboxSrc(post.image_url)}>
                  <img src={post.image_url} alt="Priložena slika" />
                </button>
              )}

              {/* Existing replies */}
              {post.replies.length > 0 && (
                <div className="adm-forum-replies">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="adm-forum-reply">
                      <div className="adm-forum-post-header">
                        <div className="adm-forum-post-author">
                          <span className="adm-forum-avatar adm-forum-avatar--admin adm-forum-avatar--sm">A</span>
                          <span className="adm-forum-post-name">Admin <span className="adm-forum-admin-tag">ADMIN</span></span>
                        </div>
                        <div className="adm-forum-post-meta">
                          <time>{timeAgo(reply.created_at)}</time>
                          <button className="adm-btn adm-btn--delete adm-btn--sm" onClick={() => deleteReply(reply.id)}>Obriši</button>
                        </div>
                      </div>
                      <div className="adm-forum-reply-body">
                        {reply.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                      </div>
                      {reply.image_url && (
                        <button className="adm-forum-thumb adm-forum-thumb--sm" onClick={() => setLightboxSrc(reply.image_url)}>
                          <img src={reply.image_url} alt="Priložena slika" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reply action */}
              <div className="adm-forum-post-actions">
                <button
                  className="adm-forum-reply-btn"
                  onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReplyContent(''); setReplyImage('') }}
                >
                  Odgovori kao Admin {post.replies.length > 0 && `(${post.replies.length})`}
                </button>
              </div>

              {/* Reply form */}
              {replyingTo === post.id && (
                <div className="adm-forum-reply-form">
                  <textarea
                    placeholder="Napišite odgovor kao Admin..."
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    rows={3}
                    maxLength={1000}
                  />
                  <AdminImageBtn imageUrl={replyImage} uploading={uploadingReplyImg} onSelect={handleReplyImgSelect} onRemove={() => setReplyImage('')} />
                  <div className="adm-forum-reply-form-actions">
                    <button className="adm-btn adm-btn--cancel" onClick={() => { setReplyingTo(null); setReplyImage('') }}>Otkaži</button>
                    <button
                      className="adm-btn adm-btn--save"
                      disabled={!replyContent.trim() || uploadingReplyImg}
                      onClick={() => submitReply(post.id)}
                    >
                      Odgovori
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightboxSrc && (
        <div className="fp-lightbox" onClick={() => setLightboxSrc('')}>
          <button className="fp-lightbox-close" onClick={() => setLightboxSrc('')}>&times;</button>
          <img src={lightboxSrc} alt="Uvećana slika" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}

/* ======================================= */
/*  ADMIN ANKETE PANEL                     */
/* ======================================= */

type PollWithOptions = SurveyPoll & { options: SurveyOption[] }

function AdminAnketePanel() {
  const [polls, setPolls] = useState<PollWithOptions[]>([])
  const [loadingPolls, setLoadingPolls] = useState(true)
  const [editingPoll, setEditingPoll] = useState<PollWithOptions | null>(null)
  const [showNewPoll, setShowNewPoll] = useState(false)
  const [viewingResults, setViewingResults] = useState<PollWithOptions | null>(null)
  const [votes, setVotes] = useState<SurveyVote[]>([])
  const [loadingVotes, setLoadingVotes] = useState(false)

  async function loadPolls() {
    setLoadingPolls(true)
    const { data: pollData } = await supabase.from('survey_polls').select('*').order('sort_order')
    if (!pollData) { setPolls([]); setLoadingPolls(false); return }
    const { data: optData } = await supabase.from('survey_options').select('*').order('sort_order')
    const allOpts = optData ?? []
    setPolls(pollData.map(p => ({ ...p, options: allOpts.filter(o => o.poll_id === p.id) })))
    setLoadingPolls(false)
  }

  useEffect(() => { loadPolls() }, [])

  async function toggleClose(poll: SurveyPoll) {
    await supabase.from('survey_polls').update({ is_closed: !poll.is_closed }).eq('id', poll.id)
    loadPolls()
  }

  async function deletePoll(poll: SurveyPoll) {
    if (!confirm(`Da li ste sigurni da želite da obrišete anketu "${poll.title}"?\n\nSvi glasovi će biti trajno obrisani.`)) return
    const { error } = await supabase.from('survey_polls').delete().eq('id', poll.id)
    if (error) { alert('Greška: ' + error.message); return }
    loadPolls()
  }

  async function viewResults(poll: PollWithOptions) {
    setViewingResults(poll)
    setLoadingVotes(true)
    const { data } = await supabase.from('survey_votes').select('*').eq('poll_id', poll.id).order('created_at', { ascending: false })
    setVotes(data ?? [])
    setLoadingVotes(false)
  }

  if (loadingPolls) return <p className="adm-loading">Učitavanje anketa...</p>

  async function deleteVote(voteId: string, voterName: string) {
    if (!confirm(`Obrisati glas od "${voterName}"?`)) return
    const { error } = await supabase.from('survey_votes').delete().eq('id', voteId)
    if (error) { alert('Greška: ' + error.message); return }
    setVotes(prev => prev.filter(v => v.id !== voteId))
  }

  if (viewingResults) {
    const poll = viewingResults
    const optionMap = Object.fromEntries(poll.options.map(o => [o.id, o.label]))
    const countByOption: Record<string, number> = {}
    for (const v of votes) countByOption[v.option_id] = (countByOption[v.option_id] ?? 0) + 1

    return (
      <>
        <div className="adm-header">
          <div>
            <button className="adm-forum-back" onClick={() => setViewingResults(null)}>&larr; Sve ankete</button>
            <h1>Rezultati: {poll.title}</h1>
          </div>
        </div>
        <div className="adm-ankete-results">
          <p className="adm-ankete-results-q">{poll.question}</p>
          <p className="adm-ankete-results-total">Ukupno glasova: <strong>{votes.length}</strong></p>

          <div className="adm-ankete-results-bars">
            {poll.options.map(opt => {
              const count = countByOption[opt.id] ?? 0
              const pct = votes.length > 0 ? Math.round((count / votes.length) * 100) : 0
              return (
                <div key={opt.id} className="adm-ankete-result-row">
                  <div className="adm-ankete-result-label">
                    <span>{opt.label}</span>
                    <span className="adm-ankete-result-pct">{pct}% ({count})</span>
                  </div>
                  <div className="adm-ankete-result-bar">
                    <div className="adm-ankete-result-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <h3 className="adm-ankete-voters-title">Lista glasača ({votes.length})</h3>
          {loadingVotes ? <p className="adm-loading">Učitavanje...</p> : (
            <table className="adm-ankete-voters-table">
              <thead>
                <tr><th>Ime i prezime</th><th>Odgovor</th><th>Datum</th><th></th></tr>
              </thead>
              <tbody>
                {votes.map(v => (
                  <tr key={v.id}>
                    <td>{v.voter_name}</td>
                    <td>{optionMap[v.option_id] ?? '—'}</td>
                    <td>{new Date(v.created_at).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td><button className="adm-btn adm-btn--delete adm-btn--sm" onClick={() => deleteVote(v.id, v.voter_name)}>Obriši</button></td>
                  </tr>
                ))}
                {votes.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center' }}>Nema glasova.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="adm-header">
        <h1>Ankete</h1>
        <button className="adm-add-btn" onClick={() => { setShowNewPoll(true); setEditingPoll(null) }}>+ Nova anketa</button>
      </div>
      <div className="adm-ankete-list">
        {polls.map(poll => {
          const expired = poll.is_closed || (poll.expires_at && new Date(poll.expires_at) < new Date())
          return (
            <div key={poll.id} className={`adm-ankete-card ${expired ? 'adm-ankete-card--closed' : ''}`}>
              <div className="adm-ankete-card-header">
                <h3>{poll.title}</h3>
                <span className={`ankete-badge ${expired ? 'ankete-badge--closed' : 'ankete-badge--active'}`}>
                  {expired ? 'Završena' : 'Aktivna'}
                </span>
              </div>
              <p className="adm-ankete-card-q">{poll.question}</p>
              <p className="adm-ankete-card-opts">
                {poll.options.map(o => o.label).join(' · ')}
              </p>
              {poll.expires_at && (
                <p className="adm-ankete-card-expires">
                  Ističe: {new Date(poll.expires_at).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              <div className="adm-ankete-card-actions">
                <button className="adm-btn adm-btn--edit" onClick={() => { setEditingPoll(poll); setShowNewPoll(false) }}>Izmeni</button>
                <button className="adm-forum-topic-open" onClick={() => viewResults(poll)}>Rezultati</button>
                <button className={`adm-btn ${expired ? 'adm-btn--show' : 'adm-btn--hide'}`} onClick={() => toggleClose(poll)}>
                  {expired ? 'Ponovo otvori' : 'Zatvori anketu'}
                </button>
                <button className="adm-btn adm-btn--delete" onClick={() => deletePoll(poll)}>Obriši</button>
              </div>
            </div>
          )
        })}
        {polls.length === 0 && <p className="adm-loading">Nema anketa. Pokrenite ankete-schema.sql u Supabase.</p>}
      </div>

      {(editingPoll || showNewPoll) && (
        <PollEditor
          poll={editingPoll}
          onSave={() => { setEditingPoll(null); setShowNewPoll(false); loadPolls() }}
          onCancel={() => { setEditingPoll(null); setShowNewPoll(false) }}
        />
      )}
    </>
  )
}

/* ======================================= */
/*  POLL EDITOR                            */
/* ======================================= */
function PollEditor({ poll, onSave, onCancel }: {
  poll: PollWithOptions | null; onSave: () => void; onCancel: () => void
}) {
  const isNew = !poll
  const [title, setTitle] = useState(poll?.title ?? '')
  const [question, setQuestion] = useState(poll?.question ?? '')
  const [options, setOptions] = useState<{ id: string; label: string }[]>(
    poll?.options.map(o => ({ id: o.id, label: o.label })) ?? [{ id: 'n1', label: '' }, { id: 'n2', label: '' }]
  )
  const [expiresAt, setExpiresAt] = useState(poll?.expires_at ? poll.expires_at.slice(0, 10) : '')
  const [sortOrder, setSortOrder] = useState(poll?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)

  function addOption() {
    setOptions(prev => [...prev, { id: `n${Date.now()}`, label: '' }])
  }

  function removeOption(idx: number) {
    if (options.length <= 2) return
    setOptions(prev => prev.filter((_, i) => i !== idx))
  }

  function updateOptionLabel(idx: number, label: string) {
    setOptions(prev => prev.map((o, i) => i === idx ? { ...o, label } : o))
  }

  async function handleSave() {
    if (!title.trim()) { alert('Unesite naslov ankete.'); return }
    if (!question.trim()) { alert('Unesite pitanje.'); return }
    const validOpts = options.filter(o => o.label.trim())
    if (validOpts.length < 2) { alert('Potrebno je barem 2 opcije za odgovor.'); return }

    setSaving(true)
    const payload: Record<string, unknown> = {
      title: title.trim(),
      question: question.trim(),
      expires_at: expiresAt ? new Date(expiresAt + 'T23:59:59').toISOString() : null,
      sort_order: sortOrder,
    }

    let pollId = poll?.id

    if (isNew) {
      const { data, error } = await supabase.from('survey_polls').insert(payload).select('id').single()
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
      pollId = data.id
    } else {
      const { error } = await supabase.from('survey_polls').update(payload).eq('id', poll!.id)
      if (error) { alert('Greška: ' + error.message); setSaving(false); return }
    }

    if (pollId) {
      await supabase.from('survey_options').delete().eq('poll_id', pollId)
      const optPayloads = validOpts.map((o, idx) => ({
        poll_id: pollId!,
        label: o.label.trim(),
        sort_order: idx + 1,
      }))
      const { error: optErr } = await supabase.from('survey_options').insert(optPayloads)
      if (optErr) { alert('Greška pri čuvanju opcija: ' + optErr.message); setSaving(false); return }
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={onCancel}>
      <div className="adm-editor" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Nova anketa' : `Izmeni: ${poll?.title}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="adm-editor-body">
          <div className="adm-field">
            <label>Naslov ankete</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="npr. Javno / Zajedničko" />
          </div>
          <div className="adm-field">
            <label>Pitanje</label>
            <textarea rows={3} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Koje pitanje želite da postavite?" />
          </div>

          <div className="adm-field">
            <label>Opcije za odgovor</label>
            <div className="adm-ankete-options-editor">
              {options.map((opt, idx) => (
                <div key={opt.id} className="adm-ankete-opt-row">
                  <span className="adm-ankete-opt-num">{idx + 1}.</span>
                  <input
                    value={opt.label}
                    onChange={e => updateOptionLabel(idx, e.target.value)}
                    placeholder={`Opcija ${idx + 1}`}
                  />
                  {options.length > 2 && (
                    <button className="adm-ankete-opt-remove" onClick={() => removeOption(idx)}>&times;</button>
                  )}
                </div>
              ))}
              <button className="adm-btn adm-btn--add-item" onClick={addOption}>+ Dodaj opciju</button>
            </div>
          </div>

          <div className="adm-field-row">
            <div className="adm-field">
              <label>Datum isteka (opciono)</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
              <small style={{ color: 'var(--clr-muted)', display: 'block', marginTop: 4 }}>
                Ostavite prazno za anketu bez vremenskog ograničenja (zatvorite ručno).
              </small>
            </div>
            <div className="adm-field">
              <label>Redosled</label>
              <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={{ maxWidth: 120 }} />
            </div>
          </div>
        </div>
        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--cancel" onClick={onCancel}>Otkaži</button>
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving}>
            {saving ? 'Čuvanje...' : (isNew ? 'Kreiraj' : 'Sačuvaj')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ======================================= */
/*  ADMIN FORUM PANEL                      */
/* ======================================= */

type PostWithReplies = ForumPost & { replies: ForumReply[] }

function AdminImageBtn({ imageUrl, uploading, onSelect, onRemove }: {
  imageUrl: string; uploading: boolean; onSelect: (f: File) => void; onRemove: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="adm-forum-img-upload">
      {imageUrl ? (
        <div className="adm-forum-img-preview-wrap">
          <img src={imageUrl} alt="" className="adm-forum-img-preview" />
          <button className="adm-forum-img-remove" onClick={onRemove}>&times;</button>
        </div>
      ) : (
        <button type="button" className="adm-forum-img-btn" disabled={uploading} onClick={() => ref.current?.click()}>
          {uploading ? 'Kompresija...' : '📷 Dodaj sliku'}
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) { onSelect(e.target.files[0]); e.target.value = '' } }} />
    </div>
  )
}

function AdminForumPanel() {
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([])
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null)
  const [posts, setPosts] = useState<PostWithReplies[]>([])
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(false)

  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState('')
  const [uploadingPostImg, setUploadingPostImg] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyImage, setReplyImage] = useState('')
  const [uploadingReplyImg, setUploadingReplyImg] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState('')

  const [editingForumTopic, setEditingForumTopic] = useState<ForumTopic | null>(null)
  const [showNewTopic, setShowNewTopic] = useState(false)

  function loadForumTopics() {
    supabase.from('forum_topics').select('*').order('sort_order').then(({ data }) => {
      setForumTopics(data ?? [])
      setLoadingTopics(false)
    })
  }

  useEffect(() => { loadForumTopics() }, [])

  const loadPosts = useCallback(async (topicId: string) => {
    setLoadingPosts(true)
    const { data: postsData } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })

    if (!postsData) { setPosts([]); setLoadingPosts(false); return }

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
    setLoadingPosts(false)
  }, [])

  function openTopic(topic: ForumTopic) {
    setActiveTopic(topic)
    loadPosts(topic.id)
  }

  async function handlePostImgSelect(file: File) {
    setUploadingPostImg(true)
    try { setNewPostImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingPostImg(false)
  }

  async function handleReplyImgSelect(file: File) {
    setUploadingReplyImg(true)
    try { setReplyImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingReplyImg(false)
  }

  async function submitAdminPost() {
    if (!activeTopic || !newPostContent.trim()) return
    const payload: Record<string, unknown> = {
      topic_id: activeTopic.id,
      author_name: 'Admin',
      is_admin: true,
      content: newPostContent.trim(),
    }
    if (newPostImage) payload.image_url = newPostImage

    const { error } = await supabase.from('forum_posts').insert(payload)
    if (error) {
      console.error('Admin post error:', error)
      alert('Greška pri slanju objave.')
      return
    }
    setNewPostContent('')
    setNewPostImage('')
    loadPosts(activeTopic.id)
  }

  async function submitAdminReply(postId: string) {
    if (!replyContent.trim()) return
    const payload: Record<string, unknown> = {
      post_id: postId,
      author_name: 'Admin',
      is_admin: true,
      content: replyContent.trim(),
    }
    if (replyImage) payload.image_url = replyImage

    const { error } = await supabase.from('forum_replies').insert(payload)
    if (error) {
      console.error('Admin reply error:', error)
      alert('Greška pri slanju odgovora.')
      return
    }
    setReplyContent('')
    setReplyImage('')
    setReplyingTo(null)
    if (activeTopic) loadPosts(activeTopic.id)
  }

  async function deletePost(postId: string) {
    if (!confirm('Obrisati ovu objavu i sve odgovore?')) return
    await supabase.from('forum_posts').delete().eq('id', postId)
    if (activeTopic) loadPosts(activeTopic.id)
  }

  async function deleteReply(replyId: string) {
    if (!confirm('Obrisati ovaj odgovor?')) return
    await supabase.from('forum_replies').delete().eq('id', replyId)
    if (activeTopic) loadPosts(activeTopic.id)
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

  if (loadingTopics) return <p className="adm-loading">Učitavanje forum tema...</p>

  if (!activeTopic) {
    return (
      <>
        <div className="adm-header">
          <h1>Forum — Teme</h1>
          <button className="adm-add-btn" onClick={() => { setShowNewTopic(true); setEditingForumTopic(null) }}>+ Nova tema</button>
        </div>
        <div className="adm-forum-topics">
          {forumTopics.map(ft => (
            <div key={ft.id} className="adm-forum-topic-card">
              {ft.cover_image && <img src={ft.cover_image} alt="" className="adm-forum-topic-cover" />}
              <h3>{ft.title}</h3>
              <p>{ft.intro.slice(0, 120)}...</p>
              <div className="adm-forum-topic-actions">
                <button className="adm-btn adm-btn--edit" onClick={() => { setEditingForumTopic(ft); setShowNewTopic(false) }}>Izmeni</button>
                <button className="adm-forum-topic-open" onClick={() => openTopic(ft)}>Objave &rarr;</button>
                <button className="adm-btn adm-btn--delete" onClick={async () => {
                  if (!confirm(`Da li ste sigurni da želite da obrišete temu "${ft.title}"?\n\nSve objave i odgovori u ovoj temi će biti trajno obrisani.`)) return
                  const { error } = await supabase.from('forum_topics').delete().eq('id', ft.id)
                  if (error) { alert('Greška: ' + error.message); return }
                  loadForumTopics()
                }}>Obriši</button>
              </div>
            </div>
          ))}
          {forumTopics.length === 0 && (
            <p className="adm-loading">Nema forum tema. Pokrenite forum-schema.sql u Supabase.</p>
          )}
        </div>

        {(editingForumTopic || showNewTopic) && (
          <ForumTopicEditor
            topic={editingForumTopic}
            onSave={() => { setEditingForumTopic(null); setShowNewTopic(false); loadForumTopics() }}
            onCancel={() => { setEditingForumTopic(null); setShowNewTopic(false) }}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="adm-header">
        <div>
          <button className="adm-forum-back" onClick={() => setActiveTopic(null)}>&larr; Sve teme</button>
          <h1>{activeTopic.title}</h1>
        </div>
      </div>

      {/* Admin post form */}
      <div className="adm-forum-compose">
        <h3>Objavite kao Admin</h3>
        <textarea
          placeholder="Napišite objavu koja će biti prikazana sa Admin bedžom..."
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
          rows={4}
          maxLength={2000}
        />
        <AdminImageBtn imageUrl={newPostImage} uploading={uploadingPostImg} onSelect={handlePostImgSelect} onRemove={() => setNewPostImage('')} />
        <div className="adm-forum-compose-footer">
          <span className="adm-forum-charcount">{newPostContent.length}/2000</span>
          <button
            className="adm-btn adm-btn--save"
            disabled={!newPostContent.trim() || uploadingPostImg}
            onClick={submitAdminPost}
          >
            Objavi kao Admin
          </button>
        </div>
      </div>

      {/* Posts list */}
      {loadingPosts ? (
        <p className="adm-loading">Učitavanje objava...</p>
      ) : (
        <div className="adm-forum-posts">
          <h3 className="adm-forum-posts-title">
            {posts.length === 0 ? 'Još nema objava u ovoj temi.' : `Objave (${posts.length})`}
          </h3>

          {posts.map(post => (
            <div key={post.id} className="adm-forum-post">
              <div className="adm-forum-post-header">
                <div className="adm-forum-post-author">
                  <span className={`adm-forum-avatar ${post.is_admin ? 'adm-forum-avatar--admin' : ''}`}>
                    {post.is_admin ? 'A' : post.author_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                  <span className="adm-forum-post-name">
                    {post.is_admin ? 'Admin' : post.author_name}
                    {post.is_admin && <span className="adm-forum-admin-tag">ADMIN</span>}
                  </span>
                </div>
                <div className="adm-forum-post-meta">
                  <time>{timeAgo(post.created_at)}</time>
                  <button className="adm-btn adm-btn--delete adm-btn--sm" onClick={() => deletePost(post.id)}>Obriši</button>
                </div>
              </div>
              <div className="adm-forum-post-body">
                {post.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
              {post.image_url && (
                <button className="adm-forum-thumb" onClick={() => setLightboxSrc(post.image_url)}>
                  <img src={post.image_url} alt="Priložena slika" />
                </button>
              )}
              <div className="adm-forum-post-actions">
                <button
                  className="adm-forum-reply-btn"
                  onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReplyContent('') }}
                >
                  Odgovori kao Admin {post.replies.length > 0 && `(${post.replies.length})`}
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="adm-forum-replies">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="adm-forum-reply">
                      <div className="adm-forum-post-header">
                        <div className="adm-forum-post-author">
                          <span className={`adm-forum-avatar adm-forum-avatar--sm ${reply.is_admin ? 'adm-forum-avatar--admin' : ''}`}>
                            {reply.is_admin ? 'A' : reply.author_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                          <span className="adm-forum-post-name">
                            {reply.is_admin ? 'Admin' : reply.author_name}
                            {reply.is_admin && <span className="adm-forum-admin-tag">ADMIN</span>}
                          </span>
                        </div>
                        <div className="adm-forum-post-meta">
                          <time>{timeAgo(reply.created_at)}</time>
                          <button className="adm-btn adm-btn--delete adm-btn--sm" onClick={() => deleteReply(reply.id)}>Obriši</button>
                        </div>
                      </div>
                      <div className="adm-forum-reply-body">
                        {reply.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                      </div>
                      {reply.image_url && (
                        <button className="adm-forum-thumb adm-forum-thumb--sm" onClick={() => setLightboxSrc(reply.image_url)}>
                          <img src={reply.image_url} alt="Priložena slika" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyingTo === post.id && (
                <div className="adm-forum-reply-form">
                  <textarea
                    placeholder="Napišite odgovor kao Admin..."
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    rows={3}
                    maxLength={1000}
                  />
                  <AdminImageBtn imageUrl={replyImage} uploading={uploadingReplyImg} onSelect={handleReplyImgSelect} onRemove={() => setReplyImage('')} />
                  <div className="adm-forum-reply-form-actions">
                    <button className="adm-btn adm-btn--cancel" onClick={() => { setReplyingTo(null); setReplyImage('') }}>Otkaži</button>
                    <button
                      className="adm-btn adm-btn--save"
                      disabled={!replyContent.trim() || uploadingReplyImg}
                      onClick={() => submitAdminReply(post.id)}
                    >
                      Odgovori
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightboxSrc && (
        <div className="fp-lightbox" onClick={() => setLightboxSrc('')}>
          <button className="fp-lightbox-close" onClick={() => setLightboxSrc('')}>&times;</button>
          <img src={lightboxSrc} alt="Uvećana slika" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}

/* ======================================= */
/*  FORUM TOPIC EDITOR                     */
/* ======================================= */
function ForumTopicEditor({ topic, onSave, onCancel }: {
  topic: ForumTopic | null; onSave: () => void; onCancel: () => void
}) {
  const isNew = !topic
  const [title, setTitle] = useState(topic?.title ?? '')
  const [slug, setSlug] = useState(topic?.slug ?? '')
  const [intro, setIntro] = useState(topic?.intro ?? '')
  const [callToAction, setCallToAction] = useState(topic?.call_to_action ?? '')
  const [coverImage, setCoverImage] = useState(topic?.cover_image ?? '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [sortOrder, setSortOrder] = useState(topic?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)

  function makeSlug(text: string) {
    return text.toLowerCase()
      .replace(/[čć]/g, 'c').replace(/[šś]/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleCoverSelect(file: File) {
    setUploadingCover(true)
    try { setCoverImage(await compressAndUpload(file)) } catch { alert('Greška pri uploadu slike.') }
    setUploadingCover(false)
  }

  async function handleSave() {
    if (!title.trim()) { alert('Unesite naslov teme.'); return }
    setSaving(true)
    const finalSlug = slug || makeSlug(title)
    const payload: Record<string, unknown> = {
      title, slug: finalSlug, intro, call_to_action: callToAction, sort_order: sortOrder,
    }

    async function tryWithCover(p: Record<string, unknown>, isInsert: boolean) {
      p.cover_image = coverImage || ''
      const res = isInsert
        ? await supabase.from('forum_topics').insert(p)
        : await supabase.from('forum_topics').update(p).eq('id', topic!.id)
      if (res.error?.message?.includes('cover_image')) {
        delete p.cover_image
        return isInsert
          ? await supabase.from('forum_topics').insert(p)
          : await supabase.from('forum_topics').update(p).eq('id', topic!.id)
      }
      return res
    }

    const { error } = await tryWithCover(payload, isNew)
    if (error) {
      console.error('Forum topic save error:', error)
      alert('Greška: ' + error.message)
      setSaving(false)
      return
    }
    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={onCancel}>
      <div className="adm-editor" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Nova forum tema' : `Izmeni: ${topic?.title}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="adm-editor-body">
          <div className="adm-field">
            <label>Naslov teme</label>
            <input value={title} onChange={e => { setTitle(e.target.value); if (isNew) setSlug(makeSlug(e.target.value)) }} />
          </div>
          <div className="adm-field">
            <label>Slug (URL)</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Uvod / Opis teme</label>
            <textarea rows={4} value={intro} onChange={e => setIntro(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Poziv na učešće</label>
            <textarea rows={2} value={callToAction} onChange={e => setCallToAction(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Hero slika (pozadina naslovne sekcije)</label>
            <AdminImageBtn imageUrl={coverImage} uploading={uploadingCover} onSelect={handleCoverSelect} onRemove={() => setCoverImage('')} />
          </div>
          <div className="adm-field">
            <label>Redosled</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={{ maxWidth: 120 }} />
          </div>
        </div>
        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--cancel" onClick={onCancel}>Otkaži</button>
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving || uploadingCover}>
            {saving ? 'Čuvanje...' : (isNew ? 'Kreiraj' : 'Sačuvaj')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ======================================= */
/*  ITEM EDITOR (single card row)          */
/* ======================================= */
function ItemRow({
  item,
  onChange,
  onDelete,
}: {
  item: TopicItem
  onChange: (updated: TopicItem) => void
  onDelete: () => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `forum/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
    if (error) { alert('Greška pri uploadu: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path)
    onChange({ ...item, link: urlData.publicUrl, title: item.title || file.name })
    setUploading(false)
  }

  return (
    <div className="adm-item-row">
      <div className="adm-item-fields">
        <div className="adm-item-field adm-item-field--icon">
          <label>Ikona</label>
          <input value={item.icon} onChange={e => onChange({ ...item, icon: e.target.value })} placeholder="🌳" />
        </div>
        <div className="adm-item-field adm-item-field--title">
          <label>Naslov</label>
          <input value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} />
        </div>
        <div className="adm-item-field adm-item-field--desc">
          <label>Opis</label>
          <input value={item.description} onChange={e => onChange({ ...item, description: e.target.value })} />
        </div>
        <div className="adm-item-field adm-item-field--link">
          <label>Link / Fajl</label>
          <input value={item.link} onChange={e => onChange({ ...item, link: e.target.value })} placeholder="https://..." />
          <div className="adm-doc-upload" style={{ marginTop: 4 }}>
            <label className="adm-doc-upload-btn" style={{ cursor: 'pointer' }}>
              {uploading ? 'Upload...' : '📎 Upload PDF / sliku'}
              <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.svg" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} hidden />
            </label>
          </div>
        </div>
      </div>
      <button className="adm-item-delete" onClick={onDelete} title="Obriši stavku">&times;</button>
    </div>
  )
}

/* ======================================= */
/*  DOCUMENT EDITOR (single doc row)       */
/* ======================================= */
function DocRow({
  doc,
  onChange,
  onDelete,
}: {
  doc: TopicDocument
  onChange: (updated: TopicDocument) => void
  onDelete: () => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `forum/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
    if (error) { alert('Greška pri uploadu fajla: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path)
    const isPdf = ext?.toLowerCase() === 'pdf'
    onChange({ ...doc, url: urlData.publicUrl, file_type: isPdf ? 'pdf' : 'file', title: doc.title || file.name })
    setUploading(false)
  }

  return (
    <div className="adm-item-row">
      <div className="adm-doc-fields">
        <div className="adm-item-field">
          <label>Naziv dokumenta</label>
          <input value={doc.title} onChange={e => onChange({ ...doc, title: e.target.value })} />
        </div>
        <div className="adm-item-field">
          <label>Tip</label>
          <select value={doc.file_type} onChange={e => onChange({ ...doc, file_type: e.target.value })}>
            <option value="link">Link</option>
            <option value="pdf">PDF</option>
            <option value="file">Fajl</option>
          </select>
        </div>
        <div className="adm-item-field">
          <label>URL / Link</label>
          <input value={doc.url} onChange={e => onChange({ ...doc, url: e.target.value })} placeholder="https://..." />
        </div>
        <div className="adm-item-field">
          <label>Ili upload fajl</label>
          <div className="adm-doc-upload">
            <label className="adm-doc-upload-btn">
              {uploading ? 'Upload...' : 'Izaberi fajl'}
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.jpg,.png,.webp" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} hidden />
            </label>
            {doc.url && <span className="adm-doc-uploaded">Postavljeno</span>}
          </div>
        </div>
      </div>
      <button className="adm-item-delete" onClick={onDelete} title="Obriši dokument">&times;</button>
    </div>
  )
}

/* ======================================= */
/*  FULL TOPIC EDITOR                      */
/* ======================================= */
function TopicEditor({
  topic,
  sectionId,
  onSave,
  onCancel,
}: {
  topic: Topic | null
  sectionId: string
  onSave: () => void
  onCancel: () => void
}) {
  const isNew = !topic
  const [title, setTitle] = useState(topic?.title ?? '')
  const [slug, setSlug] = useState(topic?.slug ?? '')
  const [shortDesc, setShortDesc] = useState(topic?.short_desc ?? '')
  const [subtitle, setSubtitle] = useState(topic?.subtitle ?? '')
  const [body, setBody] = useState(topic?.body ?? '')
  const [disclaimer, setDisclaimer] = useState(topic?.disclaimer ?? '')
  const [coverImage, setCoverImage] = useState(topic?.cover_image ?? '')
  const [iconSvg, setIconSvg] = useState(topic?.icon_svg ?? '')
  const [sortOrder, setSortOrder] = useState(topic?.sort_order ?? 0)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'items' | 'docs'>('info')

  const [items, setItems] = useState<TopicItem[]>([])
  const [docs, setDocs] = useState<TopicDocument[]>([])
  const [itemsLoaded, setItemsLoaded] = useState(false)

  useEffect(() => {
    if (!topic) { setItemsLoaded(true); return }
    Promise.all([
      supabase.from('topic_items').select('*').eq('topic_id', topic.id).order('sort_order'),
      supabase.from('topic_documents').select('*').eq('topic_id', topic.id).order('sort_order'),
    ]).then(([itemsRes, docsRes]) => {
      setItems(itemsRes.data ?? [])
      setDocs(docsRes.data ?? [])
      setItemsLoaded(true)
    })
  }, [topic])

  function makeSlug(text: string) {
    return text.toLowerCase()
      .replace(/[čć]/g, 'c').replace(/[šś]/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleImageUpload(file: File) {
    const ext = file.name.split('.').pop()
    const path = `forum/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
    if (error) { alert('Greška pri uploadu slike: ' + error.message); return }
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path)
    setCoverImage(urlData.publicUrl)
  }

  function addItem() {
    setItems(prev => [...prev, {
      id: `new-${Date.now()}`,
      topic_id: topic?.id ?? '',
      icon: '',
      title: '',
      description: '',
      link: '',
      sort_order: prev.length + 1,
    }])
  }

  function updateItem(idx: number, updated: TopicItem) {
    setItems(prev => prev.map((it, i) => i === idx ? updated : it))
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  function addDoc() {
    setDocs(prev => [...prev, {
      id: `new-${Date.now()}`,
      topic_id: topic?.id ?? '',
      title: '',
      url: '',
      file_type: 'link',
      sort_order: prev.length + 1,
    }])
  }

  function updateDoc(idx: number, updated: TopicDocument) {
    setDocs(prev => prev.map((d, i) => i === idx ? updated : d))
  }

  function removeDoc(idx: number) {
    setDocs(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    const finalSlug = slug || makeSlug(title)
    const payload = {
      section_id: sectionId,
      title,
      slug: finalSlug,
      short_desc: shortDesc,
      subtitle,
      body,
      disclaimer,
      cover_image: coverImage,
      icon_svg: iconSvg,
      sort_order: sortOrder,
    }

    let topicId = topic?.id

    if (isNew) {
      const { data } = await supabase.from('topics').insert(payload).select('id').single()
      topicId = data?.id
    } else {
      await supabase.from('topics').update(payload).eq('id', topic.id)
    }

    if (topicId) {
      await supabase.from('topic_items').delete().eq('topic_id', topicId)
      if (items.length > 0) {
        const itemPayloads = items.map((it, idx) => ({
          topic_id: topicId!,
          icon: it.icon,
          title: it.title,
          description: it.description,
          link: it.link,
          sort_order: idx + 1,
        }))
        await supabase.from('topic_items').insert(itemPayloads)
      }

      await supabase.from('topic_documents').delete().eq('topic_id', topicId)
      if (docs.length > 0) {
        const docPayloads = docs.map((d, idx) => ({
          topic_id: topicId!,
          title: d.title,
          url: d.url,
          file_type: d.file_type,
          sort_order: idx + 1,
        }))
        await supabase.from('topic_documents').insert(docPayloads)
      }
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="adm-editor-overlay" onClick={onCancel}>
      <div className="adm-editor adm-editor--wide" onClick={e => e.stopPropagation()}>
        <div className="adm-editor-header">
          <h2>{isNew ? 'Nova tema' : `Izmeni: ${topic?.title}`}</h2>
          <button className="adm-editor-close" onClick={onCancel}>&times;</button>
        </div>

        {/* Tabs */}
        <div className="adm-tabs">
          <button className={`adm-tab${activeTab === 'info' ? ' active' : ''}`} onClick={() => setActiveTab('info')}>
            Osnovni podaci
          </button>
          <button className={`adm-tab${activeTab === 'items' ? ' active' : ''}`} onClick={() => setActiveTab('items')}>
            Kartice ({items.length})
          </button>
          <button className={`adm-tab${activeTab === 'docs' ? ' active' : ''}`} onClick={() => setActiveTab('docs')}>
            Dokumenti ({docs.length})
          </button>
        </div>

        <div className="adm-editor-body">
          {!itemsLoaded ? (
            <p className="adm-loading">Učitavanje...</p>
          ) : activeTab === 'info' ? (
            <>
              <div className="adm-field-row">
                <div className="adm-field adm-field--icon-pick">
                  <label>Ikonica na kartici</label>
                  <div className="adm-icon-preview">
                    <span className="adm-icon-preview-box">{iconSvg && iconSvg.trim().length <= 8 ? iconSvg : iconSvg ? '🖼' : '?'}</span>
                    <input
                      className="adm-icon-input"
                      value={iconSvg && iconSvg.trim().length <= 8 ? iconSvg : ''}
                      onChange={e => setIconSvg(e.target.value)}
                      placeholder="Unesite emoji: 🌳"
                      maxLength={8}
                    />
                  </div>
                  <div className="adm-emoji-suggestions">
                    {['🌳','🌍','🏛️','♻️','⚡','💧','🌡️','🌱','🎯','🔗','🧭','🏙️','📄','🌿','🔄','🧩','🛠️'].map(e => (
                      <button key={e} type="button" className={`adm-emoji-opt${iconSvg === e ? ' selected' : ''}`} onClick={() => setIconSvg(e)}>{e}</button>
                    ))}
                  </div>
                </div>
                <div className="adm-field" style={{ flex: 3 }}>
                  <label>Naslov</label>
                  <input value={title} onChange={e => { setTitle(e.target.value); if (isNew) setSlug(makeSlug(e.target.value)) }} />
                </div>
              </div>
              <div className="adm-field">
                <label>Slug (URL)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Kratak opis (za karticu)</label>
                <input value={shortDesc} onChange={e => setShortDesc(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Podnaslov</label>
                <input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Tekst (body)</label>
                <textarea rows={6} value={body} onChange={e => setBody(e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Disclaimer (opciono)</label>
                <textarea rows={3} value={disclaimer} onChange={e => setDisclaimer(e.target.value)} />
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label>Cover slika</label>
                  <div className="adm-image-upload">
                    {coverImage && <img src={coverImage} alt="" className="adm-image-preview" />}
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Redosled</label>
                  <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
                </div>
              </div>
            </>
          ) : activeTab === 'items' ? (
            <div className="adm-items-list">
              <p className="adm-items-hint">Ove kartice se prikazuju na stranici teme. Svaka kartica ima ikonu (emoji), naslov, opis i opcioni link.</p>
              {items.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onChange={updated => updateItem(idx, updated)}
                  onDelete={() => removeItem(idx)}
                />
              ))}
              <button className="adm-btn adm-btn--add-item" onClick={addItem}>+ Dodaj karticu</button>
            </div>
          ) : (
            <div className="adm-items-list">
              <p className="adm-items-hint">Linkovi i dokumenti koji će se prikazivati na dnu stranice teme.</p>
              {docs.map((doc, idx) => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  onChange={updated => updateDoc(idx, updated)}
                  onDelete={() => removeDoc(idx)}
                />
              ))}
              <button className="adm-btn adm-btn--add-item" onClick={addDoc}>+ Dodaj dokument</button>
            </div>
          )}
        </div>

        <div className="adm-editor-footer">
          <button className="adm-btn adm-btn--cancel" onClick={onCancel}>Otkaži</button>
          <button className="adm-btn adm-btn--save" onClick={handleSave} disabled={saving}>
            {saving ? 'Čuvanje...' : (isNew ? 'Kreiraj' : 'Sačuvaj')}
          </button>
        </div>
      </div>
    </div>
  )
}
