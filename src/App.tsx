import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProposalModal } from './components/ProposalModal';
import { HomePage } from './pages/HomePage';

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const SustainabilityPage = lazy(() =>
  import('./pages/SustainabilityPage').then((m) => ({ default: m.SustainabilityPage }))
);
const NewsPage = lazy(() =>
  import('./pages/NewsPage').then((m) => ({ default: m.NewsPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8 bg-white dark:bg-[#081410]">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1B6B4A]/25 border-t-[#1B6B4A] dark:border-[#7FD1A8]/25 dark:border-t-[#7FD1A8] animate-spin" />
        <p className="text-xs font-medium text-[#1B6B4A] dark:text-[#7FD1A8]">
          BIOSFERA – A carregar secção...
        </p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <SiteProvider>
            <ScrollToTop />
            <Layout quotaExceeded={quotaExceeded}>
              <ErrorBoundary>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/quem-somos" element={<AboutPage />} />
                    <Route path="/servicos" element={<ServicesPage />} />
                    <Route path="/projectos" element={<ProjectsPage />} />
                    <Route path="/galeria" element={<GalleryPage />} />
                    <Route path="/sustentabilidade" element={<SustainabilityPage />} />
                    <Route path="/noticias" element={<NewsPage />} />
                    <Route path="/contactos" element={<ContactPage />} />
                    <Route path="/acesso/:accessKey" element={<AdminPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </Layout>
            <ProposalModal />
          </SiteProvider>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}
