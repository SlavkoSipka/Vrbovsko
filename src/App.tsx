import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLoader from './components/PageLoader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ONamaPage from './pages/ONamaPage'
import OdrzivRazvojPage from './pages/OdrzivRazvojPage'
import NasaZajednicaPage from './pages/NasaZajednicaPage'
import ProjektiAktivnostiPage from './pages/ProjektiAktivnostiPage'
import InicijativaPage from './pages/InicijativaPage'
import SaradnjaPartneriPage from './pages/SaradnjaPartneriPage'
import TopicPage from './pages/TopicPage'
import ForumPage from './pages/ForumPage'
import ForumTopicPage from './pages/ForumTopicPage'
import AnketePage from './pages/AnketePage'
import AnketePollPage from './pages/AnketePollPage'
import WallPage from './pages/WallPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin routes (no navbar/footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Public routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/o-nama" element={<PublicLayout><ONamaPage /></PublicLayout>} />
        <Route path="/odrzivi-razvoj" element={<PublicLayout><OdrzivRazvojPage /></PublicLayout>} />
        <Route path="/:sectionSlug/:topicSlug" element={<PublicLayout><TopicPage /></PublicLayout>} />
        <Route path="/nasa-zajednica" element={<PublicLayout><NasaZajednicaPage /></PublicLayout>} />
        <Route path="/nasa-zajednica/forum" element={<PublicLayout><ForumPage /></PublicLayout>} />
        <Route path="/nasa-zajednica/forum/:slug" element={<PublicLayout><ForumTopicPage /></PublicLayout>} />
        <Route path="/nasa-zajednica/ankete" element={<PublicLayout><AnketePage /></PublicLayout>} />
        <Route path="/nasa-zajednica/ankete/:id" element={<PublicLayout><AnketePollPage /></PublicLayout>} />
        <Route path="/nasa-zajednica/zid/:wallType" element={<PublicLayout><WallPage /></PublicLayout>} />
        <Route path="/projekti-i-aktivnosti" element={<PublicLayout><ProjektiAktivnostiPage /></PublicLayout>} />
        <Route path="/projekti-i-aktivnosti/:type/:slug" element={<PublicLayout><InicijativaPage /></PublicLayout>} />
        <Route path="/saradnja-partneri" element={<PublicLayout><SaradnjaPartneriPage /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
