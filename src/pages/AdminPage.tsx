import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  ArrowLeft,
  BellRing,
  Briefcase,
  Building2,
  CheckCircle2,
  Copy,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MessageSquarePlus,
  Newspaper,
  Plus,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  UploadCloud,
  Wrench,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Layout } from '../components/Layout';
import { HomePage } from './HomePage';
import { useSite } from '../context/SiteContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { sanitizeHref } from '../utils/safeUrl';
import {
  DEFAULT_GALLERY,
  DEFAULT_NEWS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
  GALLERY_CATEGORIES,
  IMG_HERO,
  NEWS_CATEGORIES,
  PROJECT_CATEGORIES,
} from '../data/defaults';
import type {
  ContactMessage,
  GalleryCategory,
  GalleryItem,
  MediaAsset,
  NewsArticle,
  NewsCategory,
  NewsletterSubscriber,
  PartnerItem,
  ProjectCategory,
  ProjectItem,
  ProposalRequest,
  ServiceItem,
  SiteSettings,
  TestimonialItem,
} from '../types';

type AdminTab =
  | 'overview'
  | 'settings'
  | 'proposals'
  | 'contacts'
  | 'newsletter'
  | 'testimonials'
  | 'services'
  | 'projects'
  | 'gallery'
  | 'news'
  | 'partners'
  | 'media'
  | 'access';

const MENU_ITEMS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Painel Geral', icon: LayoutDashboard },
  { id: 'proposals', label: 'Pedidos de Proposta', icon: Inbox },
  { id: 'contacts', label: 'Mensagens Recebidas', icon: Mail },
  { id: 'newsletter', label: 'Subscritores Newsletter', icon: BellRing },
  { id: 'testimonials', label: 'Testemunhos & Comentários', icon: MessageSquarePlus },
  { id: 'settings', label: 'Início, Indicadores & Contactos', icon: Settings },
  { id: 'services', label: 'Serviços', icon: Wrench },
  { id: 'projects', label: 'Projectos & Portfólio', icon: Briefcase },
  { id: 'gallery', label: 'Galeria Fotográfica', icon: ImageIcon },
  { id: 'news', label: 'Notícias & Publicações', icon: Newspaper },
  { id: 'partners', label: 'Parceiros & Clientes', icon: Building2 },
  { id: 'media', label: 'Imagens & Documentos', icon: FolderOpen },
  { id: 'access', label: 'Acesso & Credenciais', icon: KeyRound },
];

export const AdminPage: React.FC = () => {
  const { accessKey = '' } = useParams<{ accessKey: string }>();
  const navigate = useNavigate();
  const { user, authReady, isAdmin, loginWithGoogle, logout, settings } = useSite();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toast, setToast] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');

  // Hidden portal access & in-memory Bearer token state (never persisted in Web Storage)
  const [linkStatus, setLinkStatus] = useState<'checking' | 'invalid' | 'ready'>('checking');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [envManaged, setEnvManaged] = useState(false);
  const [accessKeyEnvManaged, setAccessKeyEnvManaged] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [activeAccessKey, setActiveAccessKey] = useState(accessKey);

  // Login / Claim form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginPassConfirm, setLoginPassConfirm] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Access & credentials management state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwdUser, setNewPwdUser] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdConfirm, setNewPwdConfirm] = useState('');
  const [rotatingLink, setRotatingLink] = useState(false);
  const [updatingCreds, setUpdatingCreds] = useState(false);

  // Admin full collections state (only loaded when isAdmin === true)
  const [proposals, setProposals] = useState<ProposalRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<NewsletterSubscriber[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [partnersList, setPartnersList] = useState<PartnerItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);

  // Selected proposal for detail/notes
  const [selectedProposal, setSelectedProposal] = useState<ProposalRequest | null>(null);
  const [proposalNotes, setProposalNotes] = useState('');
  const [proposalStatus, setProposalStatus] = useState<ProposalRequest['status']>('novo');

  // New Service form
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceCode, setNewServiceCode] = useState('');
  const [newServiceShort, setNewServiceShort] = useState('');
  const [newServiceFull, setNewServiceFull] = useState('');
  const [newServiceImage, setNewServiceImage] = useState(IMG_HERO);

  // New Project form
  const [projTitle, setProjTitle] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projLocation, setProjLocation] = useState('');
  const [projSector, setProjSector] = useState('Indústria e Transformação');
  const [projCategory, setProjCategory] = useState<ProjectCategory>(PROJECT_CATEGORIES[0]);
  const [projDesc, setProjDesc] = useState('');
  const [projServices, setProjServices] = useState('');
  const [projResults, setProjResults] = useState('');
  const [projImage, setProjImage] = useState(IMG_HERO);
  const [projConfirmed, setProjConfirmed] = useState(true);

  // New Gallery form
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryCategory>(GALLERY_CATEGORIES[0]);
  const [galCaption, setGalCaption] = useState('');
  const [galLocation, setGalLocation] = useState('Luanda, Angola');
  const [galImage, setGalImage] = useState(IMG_HERO);
  const [galDate, setGalDate] = useState('2026');

  // New News form
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsCategory>(NEWS_CATEGORIES[0]);
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState(IMG_HERO);
  const [newsDate, setNewsDate] = useState(new Date().toISOString().slice(0, 10));
  const [newsPublished, setNewsPublished] = useState(true);

  // New Partner form
  const [partName, setPartName] = useState('');
  const [partSector, setPartSector] = useState('');
  const [partLogo, setPartLogo] = useState('');
  const [partWebsite, setPartWebsite] = useState('');
  const [partAuthorized, setPartAuthorized] = useState(true);

  // Media upload state
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Geral');
  const [mediaUploading, setMediaUploading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    let cancelled = false;
    if (sessionToken && accessKey === activeAccessKey) {
      setLinkStatus('ready');
      return;
    }

    setLinkStatus('checking');
    fetch(`/api/admin/entry-status?key=${encodeURIComponent(accessKey)}`)
      .then((res) => res.json())
      .then((data: { validLink?: boolean; needsSetup?: boolean; envManaged?: boolean }) => {
        if (cancelled) return;
        if (!data.validLink) {
          setLinkStatus('invalid');
          return;
        }
        setActiveAccessKey(accessKey);
        setNeedsSetup(Boolean(data.needsSetup));
        setEnvManaged(Boolean(data.envManaged));
        setLinkStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setLinkStatus('invalid');
      });

    return () => {
      cancelled = true;
    };
  }, [accessKey, sessionToken, activeAccessKey]);

  useEffect(() => {
    if (!sessionToken) return;
    fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${sessionToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: {
            username?: string;
            accessKey?: string;
            envManaged?: boolean;
            accessKeyEnvManaged?: boolean;
          } | null
        ) => {
          if (!data) return;
          if (data.username) {
            setAdminUsername(data.username);
            setNewPwdUser((prev) => prev || data.username || '');
          }
          if (data.accessKey) setActiveAccessKey(data.accessKey);
          setEnvManaged(Boolean(data.envManaged));
          setAccessKeyEnvManaged(Boolean(data.accessKeyEnvManaged));
        }
      )
      .catch(() => {});
  }, [sessionToken]);

  useEffect(() => {
    if (!sessionToken || !authReady || !isAdmin) return;

    const u1 = onSnapshot(
      collection(db, 'proposals'),
      (snap) => setProposals(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProposalRequest, 'id'>) }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'proposals')
    );
    const u2 = onSnapshot(
      collection(db, 'contacts'),
      (snap) => setContacts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'contacts')
    );
    const u3 = onSnapshot(
      collection(db, 'services'),
      (snap) =>
        setServicesList(
          snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<ServiceItem, 'id'>) }))
            .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'services')
    );
    const u4 = onSnapshot(
      collection(db, 'projects'),
      (snap) => setProjectsList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProjectItem, 'id'>) }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'projects')
    );
    const u5 = onSnapshot(
      collection(db, 'gallery'),
      (snap) => setGalleryList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'gallery')
    );
    const u6 = onSnapshot(
      collection(db, 'news'),
      (snap) => setNewsList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NewsArticle, 'id'>) }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'news')
    );
    const u7 = onSnapshot(
      collection(db, 'partners'),
      (snap) => setPartnersList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PartnerItem, 'id'>) }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'partners')
    );
    const u8 = onSnapshot(
      collection(db, 'media'),
      (snap) => setMediaList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MediaAsset, 'id'>) }))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'media')
    );
    const u9 = onSnapshot(
      collection(db, 'newsletterSubscribers'),
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NewsletterSubscriber, 'id'>),
        }));
        rows.sort((a, b) => {
          const aTime = (a.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
          const bTime = (b.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        setNewsletterSubs(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'newsletterSubscribers')
    );
    const u10 = onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<TestimonialItem, 'id'>),
        }));
        rows.sort((a, b) => {
          const aTime = (a.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
          const bTime = (b.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        setTestimonialsList(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'testimonials')
    );

    return () => {
      u1();
      u2();
      u3();
      u4();
      u5();
      u6();
      u7();
      u8();
      u9();
      u10();
    };
  }, [sessionToken, authReady, isAdmin]);

  const handleGoogleConnect = async () => {
    setAuthError('');
    try {
      await loginWithGoogle();
    } catch {
      setAuthError('Não foi possível iniciar sessão com a conta Google.');
    }
  };

  const handleClaimAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (loginPass !== loginPassConfirm) {
      setAuthError('As palavras-passe não coincidem.');
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessKey,
          username: loginUser.trim(),
          password: loginPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Não foi possível criar as credenciais.');
        return;
      }
      setSessionToken(data.token);
      setAdminUsername(data.username);
      setNewPwdUser(data.username);
      setActiveAccessKey(data.accessKey || accessKey);
      setNeedsSetup(false);
      setLoginPass('');
      setLoginPassConfirm('');
    } catch {
      setAuthError('Erro de comunicação com o servidor.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessKey,
          username: loginUser.trim(),
          password: loginPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Utilizador ou palavra-passe inválidos.');
        return;
      }
      setSessionToken(data.token);
      setAdminUsername(data.username);
      setNewPwdUser(data.username);
      setActiveAccessKey(data.accessKey || accessKey);
      setEnvManaged(Boolean(data.envManaged));
      setLoginPass('');
    } catch {
      setAuthError('Erro de comunicação com o servidor.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleFullLogout = async () => {
    setSessionToken(null);
    setAdminUsername('');
    if (user) {
      await logout();
    }
  };

  const handleRotateAccessLink = async () => {
    if (!sessionToken) return;
    setRotatingLink(true);
    try {
      const res = await fetch('/api/admin/rotate-link', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Não foi possível gerar novo link.');
        return;
      }
      setActiveAccessKey(data.accessKey);
      navigate(`/acesso/${data.accessKey}`, { replace: true });
      showToast('Novo link privado de acesso gerado e activado.');
    } catch {
      showToast('Erro ao gerar novo link de acesso.');
    } finally {
      setRotatingLink(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken) return;
    if (newPwd !== newPwdConfirm) {
      showToast('A nova palavra-passe e a confirmação não coincidem.');
      return;
    }
    setUpdatingCreds(true);
    try {
      const res = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          currentPassword: currentPwd,
          newUsername: newPwdUser.trim(),
          newPassword: newPwd,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Não foi possível actualizar as credenciais.');
        return;
      }
      setSessionToken(data.token);
      setAdminUsername(data.username);
      setCurrentPwd('');
      setNewPwd('');
      setNewPwdConfirm('');
      showToast('Utilizador e palavra-passe actualizados com sucesso.');
    } catch {
      showToast('Erro de comunicação ao actualizar credenciais.');
    } finally {
      setUpdatingCreds(false);
    }
  };

  // Unrecognized access link silently renders the public HomePage inside Layout
  if (linkStatus === 'invalid') {
    return (
      <Layout>
        <HomePage />
      </Layout>
    );
  }

  if (linkStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#081410] flex items-center justify-center p-6">
        <p className="text-sm text-[#29332F]/70 dark:text-[#C5DFD1]">A validar acesso...</p>
      </div>
    );
  }

  if (!sessionToken) {
    return (
      <>
        <SeoHead
          title="Área Reservada"
          description="Acesso privado institucional."
          path={`/acesso/${accessKey}`}
          noIndex
        />
        <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#081410] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] p-8 space-y-5 shadow-sm">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#1B6B4A]/10 dark:bg-[#163127] text-[#1B6B4A] dark:text-[#7FD1A8] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#1B6B4A] dark:text-[#7FD1A8]">
                {needsSetup ? 'Configurar Acesso Privado' : 'Área Reservada à Administração'}
              </h1>
              <p className="text-sm text-[#29332F]/75 dark:text-[#C5DFD1]">
                {needsSetup
                  ? 'Defina o nome de utilizador e a palavra-passe inicial para proteger a gestão institucional da BIOSFERA.'
                  : 'Introduza o seu utilizador e palavra-passe para aceder ao painel privado.'}
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-xs text-red-800 dark:text-red-200 text-center">
                {authError}
              </div>
            )}

            {needsSetup ? (
              <form onSubmit={handleClaimAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] mb-1">
                    Nome de Utilizador *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={64}
                    autoComplete="username"
                    placeholder="Ex.: biosfera.admin"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] mb-1">
                    Palavra-passe (mín. 8 caracteres) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] mb-1">
                    Confirmar Palavra-passe *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={loginPassConfirm}
                    onChange={(e) => setLoginPassConfirm(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors disabled:opacity-60"
                >
                  {authSubmitting ? 'A Configurar...' : 'Criar Utilizador e Entrar'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCredentialLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] mb-1">
                    Utilizador *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Nome de utilizador"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] mb-1">
                    Palavra-passe *
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors disabled:opacity-60"
                >
                  {authSubmitting ? 'A Validar...' : 'Entrar na Área Reservada'}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#29332F]/70 dark:text-[#A8CBB9] hover:text-[#1B6B4A] dark:hover:text-[#7FD1A8]"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Voltar ao Website Institucional</span>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const requireCloudSync = () => {
    if (!isAdmin) {
      showToast('Ligue a conta Google autorizada no banner acima para guardar alterações na nuvem.');
      return false;
    }
    return true;
  };

  // --- Admin Mutations ---
  const saveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCloudSync()) return;
    setSavingSettings(true);
    try {
      await setDoc(
        doc(db, 'siteSettings', 'main'),
        {
          heroTitle: settingsForm.heroTitle.trim(),
          heroSubtitle: settingsForm.heroSubtitle.trim(),
          institutionalTitle: settingsForm.institutionalTitle.trim(),
          institutionalDescription: settingsForm.institutionalDescription.trim(),
          yearsExperience: settingsForm.yearsExperience.trim(),
          projectsCompleted: settingsForm.projectsCompleted.trim(),
          studiesDeveloped: settingsForm.studiesDeveloped.trim(),
          licensesSupported: settingsForm.licensesSupported.trim(),
          indicatorsConfirmed: Boolean(settingsForm.indicatorsConfirmed),
          address: settingsForm.address.trim(),
          generalEmail: settingsForm.generalEmail.trim(),
          recruitmentEmail: settingsForm.recruitmentEmail.trim(),
          phonePrimary: settingsForm.phonePrimary.trim(),
          phoneSecondary: settingsForm.phoneSecondary.trim(),
          whatsappNumber: settingsForm.whatsappNumber.trim(),
          missionText: settingsForm.missionText.trim(),
          visionText: settingsForm.visionText.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ).catch((err) => handleFirestoreError(err, OperationType.WRITE, 'siteSettings/main'));
      showToast('Configurações institucionais guardadas com sucesso.');
    } finally {
      setSavingSettings(false);
    }
  };

  const seedDefaultServices = async () => {
    if (!requireCloudSync()) return;
    for (const srv of DEFAULT_SERVICES) {
      await setDoc(doc(db, 'services', srv.id), {
        code: srv.code,
        slug: srv.slug,
        title: srv.title,
        shortDescription: srv.shortDescription,
        fullDescription: srv.fullDescription,
        objectives: srv.objectives,
        benefits: srv.benefits,
        methodology: srv.methodology,
        imageUrl: srv.imageUrl,
        iconName: srv.iconName,
        order: srv.order,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `services/${srv.id}`));
    }
    showToast('Catálogo inicial de 9 serviços importado para a base de dados.');
  };

  const createService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCloudSync()) return;
    if (!newServiceTitle.trim() || !newServiceShort.trim()) return;
    const slug = newServiceTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 75);

    await addDoc(collection(db, 'services'), {
      code: (newServiceCode || 'S').slice(0, 4),
      slug: slug || `servico-${Date.now()}`,
      title: newServiceTitle.trim(),
      shortDescription: newServiceShort.trim(),
      fullDescription: (newServiceFull || newServiceShort).trim(),
      objectives: ['Levantamento e avaliação técnica especializada'],
      benefits: ['Conformidade legal e redução de riscos ambientais'],
      methodology: ['Diagnóstico, análise de campo e relatório técnico'],
      imageUrl: newServiceImage.trim() || IMG_HERO,
      iconName: 'Leaf',
      order: servicesList.length + 1,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => handleFirestoreError(err, OperationType.CREATE, 'services'));

    setNewServiceTitle('');
    setNewServiceCode('');
    setNewServiceShort('');
    setNewServiceFull('');
    showToast('Serviço adicionado.');
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCloudSync()) return;
    if (!projTitle.trim() || !projDesc.trim() || !projLocation.trim()) return;

    await addDoc(collection(db, 'projects'), {
      title: projTitle.trim(),
      client: projClient.trim(),
      location: projLocation.trim(),
      sector: projSector.trim(),
      category: projCategory,
      description: projDesc.trim(),
      servicesProvided: projServices
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10),
      results: projResults.trim(),
      imageUrl: projImage.trim() || IMG_HERO,
      confirmed: projConfirmed,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => handleFirestoreError(err, OperationType.CREATE, 'projects'));

    setProjTitle('');
    setProjClient('');
    setProjLocation('');
    setProjDesc('');
    setProjServices('');
    setProjResults('');
    showToast('Projecto registado no portfólio.');
  };

  const seedDefaultGallery = async () => {
    if (!requireCloudSync()) return;
    for (const item of DEFAULT_GALLERY) {
      await setDoc(doc(db, 'gallery', item.id), {
        title: item.title,
        category: item.category,
        caption: item.caption,
        location: item.location,
        imageUrl: item.imageUrl,
        capturedAt: item.capturedAt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `gallery/${item.id}`));
    }
    showToast('Galeria base sincronizada.');
  };

  const seedDefaultTestimonials = async () => {
    if (!requireCloudSync()) return;
    for (const item of DEFAULT_TESTIMONIALS) {
      await setDoc(doc(db, 'testimonials', item.id), {
        authorName: item.authorName,
        organization: item.organization,
        role: item.role,
        rating: item.rating,
        comment: item.comment,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `testimonials/${item.id}`));
    }
    showToast('Testemunhos iniciais sincronizados na base de dados.');
  };

  const createGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCloudSync()) return;
    if (!galTitle.trim() || !galCaption.trim() || !galImage.trim()) return;

    await addDoc(collection(db, 'gallery'), {
      title: galTitle.trim(),
      category: galCategory,
      caption: galCaption.trim(),
      location: galLocation.trim(),
      imageUrl: galImage.trim(),
      capturedAt: galDate.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => handleFirestoreError(err, OperationType.CREATE, 'gallery'));

    setGalTitle('');
    setGalCaption('');
    showToast('Fotografia adicionada à galeria.');
  };

  const seedDefaultNews = async () => {
    if (!requireCloudSync()) return;
    for (const art of DEFAULT_NEWS) {
      await setDoc(doc(db, 'news', art.id), {
        title: art.title,
        slug: art.slug,
        category: art.category,
        summary: art.summary,
        content: art.content,
        imageUrl: art.imageUrl,
        publishedDate: art.publishedDate,
        published: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `news/${art.id}`));
    }
    showToast('Publicações iniciais importadas.');
  };

  const createNewsArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCloudSync()) return;
    if (!newsTitle.trim() || !newsSummary.trim() || newsContent.trim().length < 20) return;
    const slug = newsTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 100);

    await addDoc(collection(db, 'news'), {
      title: newsTitle.trim(),
      slug: slug || `noticia-${Date.now()}`,
      category: newsCategory,
      summary: newsSummary.trim(),
      content: newsContent.trim(),
      imageUrl: newsImage.trim() || IMG_HERO,
      publishedDate: newsDate,
      published: newsPublished,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => handleFirestoreError(err, OperationType.CREATE, 'news'));

    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    showToast('Publicação criada.');
  };

  const createPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCloudSync()) return;
    if (!partName.trim() || !partLogo.trim()) return;

    await addDoc(collection(db, 'partners'), {
      name: partName.trim(),
      sector: partSector.trim(),
      logoUrl: partLogo.trim(),
      websiteUrl: partWebsite.trim(),
      authorized: partAuthorized,
      order: partnersList.length + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((err) => handleFirestoreError(err, OperationType.CREATE, 'partners'));

    setPartName('');
    setPartSector('');
    setPartLogo('');
    setPartWebsite('');
    showToast('Parceiro registado.');
  };

  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('O ficheiro excede o limite de 5 MB.');
      return;
    }

    setMediaUploading(true);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Erro ao ler ficheiro'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          base64Data,
        }),
      });
      if (!res.ok) throw new Error('Falha no upload');
      const uploaded = await res.json();

      await addDoc(collection(db, 'media'), {
        title: (mediaTitle || file.name).trim().slice(0, 160),
        type: file.type.startsWith('image/') ? 'image' : 'document',
        category: mediaCategory.trim() || 'Geral',
        url: uploaded.url,
        fileName: uploaded.fileName,
        mimeType: uploaded.mimeType,
        sizeLabel: uploaded.sizeLabel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, 'media'));

      setMediaTitle('');
      showToast('Ficheiro carregado e registado na biblioteca.');
    } catch {
      showToast('Não foi possível carregar o ficheiro.');
    } finally {
      setMediaUploading(false);
    }
  };

  const updateProposal = async () => {
    if (!selectedProposal || !requireCloudSync()) return;
    await updateDoc(doc(db, 'proposals', selectedProposal.id), {
      status: proposalStatus,
      adminNotes: proposalNotes.slice(0, 1500),
      updatedAt: serverTimestamp(),
    }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `proposals/${selectedProposal.id}`));
    showToast('Estado da proposta actualizado.');
    setSelectedProposal(null);
  };

  const deleteRecord = async (col: string, id: string) => {
    if (!requireCloudSync()) return;
    await deleteDoc(doc(db, col, id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `${col}/${id}`)
    );
    showToast('Registo eliminado.');
  };

  const newProposalsCount = proposals.filter((p) => p.status === 'novo').length;
  const newContactsCount = contacts.filter((c) => c.status === 'novo').length;

  const privateAccessUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/acesso/${activeAccessKey}` : '';

  return (
    <>
      <SeoHead
        title="Painel Administrativo | BIOSFERA"
        description="Gestão institucional privada da BIOSFERA."
        path={`/acesso/${activeAccessKey}`}
        noIndex
      />

      <div className="min-h-screen bg-[#F4F7F5] text-[#29332F] flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-[270px] bg-[#1B6B4A] text-white shrink-0 flex flex-col">
          <div className="p-6 border-b border-white/15">
            <p className="text-xs font-semibold tracking-wider text-[#BCE87D] uppercase">
              BIOSFERA CMS
            </p>
            <h1 className="font-display text-lg font-bold mt-1">Painel Administrativo</h1>
            <p className="text-xs text-white/80 truncate mt-0.5">
              Utilizador: <span className="font-semibold">{adminUsername || 'Admin'}</span>
            </p>
            {user?.email && (
              <p className="text-[11px] text-white/65 truncate mt-0.5">{user.email}</p>
            )}
          </div>

          <nav className="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Menu Administrativo">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const badge =
                item.id === 'proposals' && newProposalsCount > 0
                  ? newProposalsCount
                  : item.id === 'contacts' && newContactsCount > 0
                  ? newContactsCount
                  : null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-medium rounded-lg transition-colors text-left ${
                    activeTab === item.id
                      ? 'bg-white text-[#1B6B4A] font-semibold'
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {badge !== null && (
                    <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#8BC53F] text-[#182C61] tabular-nums">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/15 space-y-2">
            <Link
              to="/"
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white/85 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Ver Website Público</span>
            </Link>
            <button
              type="button"
              onClick={handleFullLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white/85 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </aside>

        {/* Main Viewport */}
        <div className="flex-1 min-w-0">
          <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#29332F]/60">
                Administração / {MENU_ITEMS.find((m) => m.id === activeTab)?.label}
              </p>
            </div>
            {toast && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1E7E54]/15 text-[#1B6B4A] text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>{toast}</span>
              </div>
            )}
          </header>

          <div className="p-6 lg:p-8 max-w-6xl space-y-8">
            {(!user || !isAdmin) && (
              <div className="bg-white rounded-xl border border-[#1D5E9C]/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#182C61] font-display font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#1E7E54]" aria-hidden="true" />
                    <span>Sincronização Cloud Firestore</span>
                  </div>
                  <p className="text-xs text-[#29332F]/75">
                    {user && !isAdmin
                      ? `A conta Google ligada (${user.email}) não possui permissões de administrador na base de dados.`
                      : 'Para consultar pedidos de proposta, mensagens e gravar alterações no website, ligue a conta Google autorizada.'}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {!user ? (
                    <button
                      type="button"
                      onClick={handleGoogleConnect}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Conectar Base de Dados (Google)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={logout}
                      className="px-4 py-2 text-xs font-semibold text-[#182C61] bg-[#EEF3FA] hover:bg-[#DCE6F5] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Trocar Conta Google
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                  Resumo Operacional do Website
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-xs text-[#29332F]/65">Pedidos de Proposta</p>
                    <p className="font-display text-3xl font-bold text-[#1B6B4A] mt-1 tabular-nums">
                      {proposals.length}
                    </p>
                    <p className="text-xs text-[#1E7E54] mt-1 font-medium">
                      {newProposalsCount} por analisar
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-xs text-[#29332F]/65">Mensagens de Contacto</p>
                    <p className="font-display text-3xl font-bold text-[#1B6B4A] mt-1 tabular-nums">
                      {contacts.length}
                    </p>
                    <p className="text-xs text-[#1E7E54] mt-1 font-medium">
                      {newContactsCount} novas
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-xs text-[#29332F]/65">Subscritores Newsletter</p>
                    <p className="font-display text-3xl font-bold text-[#1B6B4A] mt-1 tabular-nums">
                      {newsletterSubs.filter((s) => s.status === 'ativo').length}
                    </p>
                    <p className="text-xs text-[#29332F]/65 mt-1">
                      {newsletterSubs.length} registos totais
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-xs text-[#29332F]/65">Testemunhos &amp; Comentários</p>
                    <p className="font-display text-3xl font-bold text-[#1B6B4A] mt-1 tabular-nums">
                      {testimonialsList.filter((t) => t.published).length}
                    </p>
                    <p className="text-xs text-[#29332F]/65 mt-1">
                      {testimonialsList.length} submetidos no portal
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-xs text-[#29332F]/65">Projectos no Portfólio</p>
                    <p className="font-display text-3xl font-bold text-[#1B6B4A] mt-1 tabular-nums">
                      {projectsList.length}
                    </p>
                    <p className="text-xs text-[#29332F]/65 mt-1">
                      {projectsList.filter((p) => p.confirmed).length} confirmados no site
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <p className="text-xs text-[#29332F]/65">Parceiros Autorizados</p>
                    <p className="font-display text-3xl font-bold text-[#1B6B4A] mt-1 tabular-nums">
                      {partnersList.filter((p) => p.authorized).length}
                    </p>
                    <p className="text-xs text-[#29332F]/65 mt-1">
                      {newsList.filter((n) => n.published).length} notícias publicadas
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                  <h3 className="font-display text-base font-bold text-[#1B6B4A] mb-3">
                    Estado dos Indicadores Institucionais na Home Page
                  </h3>
                  <p className="text-sm text-[#29332F]/80">
                    {settingsForm.indicatorsConfirmed
                      ? 'Os indicadores institucionais estão confirmados e visíveis com animação numérica na página inicial.'
                      : 'Os indicadores quantitativos (projectos, estudos, licenças) encontram-se ocultos sob "Sob confirmação institucional" até serem preenchidos e confirmados em "Início, Indicadores & Contactos".'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <form
                onSubmit={saveSiteSettings}
                className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#1B6B4A]">
                      Conteúdos da Página Inicial, Indicadores e Contactos
                    </h2>
                    <p className="text-xs text-[#29332F]/65 mt-0.5">
                      Qualquer alteração é reflectida imediatamente no website público.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" aria-hidden="true" />
                    <span>{savingSettings ? 'A Guardar...' : 'Guardar Alterações'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">
                      Título Principal do Banner (Hero)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroTitle}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">
                      Subtítulo do Banner (Hero)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.heroSubtitle}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">
                      Título da Secção Institucional
                    </label>
                    <input
                      type="text"
                      value={settingsForm.institutionalTitle}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, institutionalTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">
                      Texto Institucional
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.institutionalDescription}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          institutionalDescription: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>

                  {/* Indicators */}
                  <div className="md:col-span-2 pt-4 border-t border-neutral-200">
                    <h3 className="font-display text-base font-bold text-[#1B6B4A] mb-3">
                      Indicadores Institucionais Confirmados
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Anos de experiência
                        </label>
                        <input
                          type="text"
                          value={settingsForm.yearsExperience}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, yearsExperience: e.target.value })
                          }
                          placeholder="+10"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Projectos realizados
                        </label>
                        <input
                          type="text"
                          value={settingsForm.projectsCompleted}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, projectsCompleted: e.target.value })
                          }
                          placeholder="Ex.: +120"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Estudos e relatórios
                        </label>
                        <input
                          type="text"
                          value={settingsForm.studiesDeveloped}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, studiesDeveloped: e.target.value })
                          }
                          placeholder="Ex.: +250"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Licenças acompanhadas
                        </label>
                        <input
                          type="text"
                          value={settingsForm.licensesSupported}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, licensesSupported: e.target.value })
                          }
                          placeholder="Ex.: +85"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                        />
                      </div>
                    </div>
                    <label className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#29332F]">
                      <input
                        type="checkbox"
                        checked={settingsForm.indicatorsConfirmed}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            indicatorsConfirmed: e.target.checked,
                          })
                        }
                        className="rounded border-neutral-300"
                      />
                      <span>
                        Confirmar publicação dos números de projectos, estudos e licenças no site
                      </span>
                    </label>
                  </div>

                  {/* Contacts */}
                  <div className="md:col-span-2 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold mb-1">Endereço</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, address: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">E-mail Geral</label>
                      <input
                        type="email"
                        value={settingsForm.generalEmail}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, generalEmail: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        E-mail de Recrutamento
                      </label>
                      <input
                        type="email"
                        value={settingsForm.recruitmentEmail}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, recruitmentEmail: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Telefone Principal</label>
                      <input
                        type="text"
                        value={settingsForm.phonePrimary}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Telefone Secundário</label>
                      <input
                        type="text"
                        value={settingsForm.phoneSecondary}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Número WhatsApp (apenas dígitos com código país)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* TAB: PROPOSALS */}
            {activeTab === 'proposals' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                  Pedidos de Proposta Recebidos ({proposals.length})
                </h2>

                {proposals.length === 0 ? (
                  <div className="bg-white rounded-xl border border-neutral-200 p-10 text-center text-sm text-[#29332F]/70">
                    Ainda não foram recebidos pedidos de proposta através do website.
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-neutral-200 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#F4F7F5] border-b border-neutral-200 text-xs font-semibold text-[#1B6B4A]">
                        <tr>
                          <th className="px-4 py-3">Empresa / Responsável</th>
                          <th className="px-4 py-3">Serviço / Sector</th>
                          <th className="px-4 py-3">Localização</th>
                          <th className="px-4 py-3">Estado</th>
                          <th className="px-4 py-3 text-right">Acções</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {proposals.map((prop) => (
                          <tr key={prop.id} className="hover:bg-[#F4F7F5]/50">
                            <td className="px-4 py-3.5">
                              <p className="font-semibold text-[#1B6B4A]">{prop.companyName}</p>
                              <p className="text-xs text-[#29332F]/75">
                                {prop.contactName} · {prop.email} ·{' '}
                                <span className="font-mono tabular-nums">{prop.phone}</span>
                              </p>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="font-medium text-xs text-[#29332F]">
                                {prop.serviceRequested}
                              </p>
                              <p className="text-xs text-[#29332F]/65">{prop.sector}</p>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-[#29332F]/80">
                              {prop.projectLocation}
                            </td>
                            <td className="px-4 py-3.5 text-xs font-semibold uppercase text-[#1E7E54]">
                              {prop.status.replace('_', ' ')}
                            </td>
                            <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProposal(prop);
                                  setProposalNotes(prop.adminNotes || '');
                                  setProposalStatus(prop.status);
                                }}
                                className="px-3 py-1.5 text-xs font-semibold bg-[#F4F7F5] text-[#1B6B4A] rounded-md hover:bg-neutral-200"
                              >
                                Gerir
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteRecord('proposals', prop.id)}
                                aria-label="Eliminar pedido"
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedProposal && (
                  <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg font-bold text-[#1B6B4A]">
                          {selectedProposal.companyName} — {selectedProposal.serviceRequested}
                        </h3>
                        <p className="text-xs text-[#29332F]/70 mt-1">
                          {selectedProposal.contactName} ({selectedProposal.email} /{' '}
                          {selectedProposal.phone})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedProposal(null)}
                        className="text-xs text-[#29332F]/60 hover:text-[#1B6B4A]"
                      >
                        Fechar
                      </button>
                    </div>
                    <p className="text-sm text-[#29332F]/85 bg-[#F4F7F5] p-4 rounded-lg whitespace-pre-line">
                      {selectedProposal.description}
                    </p>
                    {selectedProposal.attachmentName && (
                      <div className="text-xs flex items-center gap-2 text-[#1B6B4A]">
                        <FileText className="w-4 h-4" />
                        <span>Documento anexo: {selectedProposal.attachmentName}</span>
                        {sanitizeHref(selectedProposal.attachmentUrl) && (
                          <a
                            href={sanitizeHref(selectedProposal.attachmentUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold"
                          >
                            Descarregar
                          </a>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Estado</label>
                        <select
                          value={proposalStatus}
                          onChange={(e) =>
                            setProposalStatus(e.target.value as ProposalRequest['status'])
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300"
                        >
                          <option value="novo">Novo</option>
                          <option value="em_analise">Em Análise</option>
                          <option value="respondido">Respondido</option>
                          <option value="arquivado">Arquivado</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold mb-1">
                          Notas Internas
                        </label>
                        <input
                          type="text"
                          value={proposalNotes}
                          onChange={(e) => setProposalNotes(e.target.value)}
                          placeholder="Observações da equipa técnica..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={updateProposal}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] rounded-lg"
                    >
                      Actualizar Proposta
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CONTACTS */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                  Mensagens do Formulário de Contacto ({contacts.length})
                </h2>
                {contacts.length === 0 ? (
                  <div className="bg-white rounded-xl border border-neutral-200 p-10 text-center text-sm text-[#29332F]/70">
                    Nenhuma mensagem recebida até ao momento.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold uppercase text-[#1E7E54]">
                            {msg.status} · {msg.email} {msg.phone ? `· ${msg.phone}` : ''}
                          </p>
                          <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                            {msg.subject} — {msg.name}
                          </h3>
                          <p className="text-sm text-[#29332F]/85 whitespace-pre-line">
                            {msg.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={msg.status}
                            onChange={(e) =>
                              updateDoc(doc(db, 'contacts', msg.id), {
                                status: e.target.value,
                                updatedAt: serverTimestamp(),
                              }).catch((err) =>
                                handleFirestoreError(err, OperationType.UPDATE, `contacts/${msg.id}`)
                              )
                            }
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                          >
                            <option value="novo">Novo</option>
                            <option value="lido">Lido</option>
                            <option value="respondido">Respondido</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteRecord('contacts', msg.id)}
                            aria-label="Eliminar mensagem"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: NEWSLETTER SUBSCRIBERS */}
            {activeTab === 'newsletter' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                      Subscritores da Newsletter ({newsletterSubs.length})
                    </h2>
                    <p className="text-xs text-[#29332F]/65 mt-0.5">
                      E-mails captados na página inicial e em Notícias &amp; Publicações (armazenados no Cloud Firestore).
                    </p>
                  </div>
                  {newsletterSubs.some((s) => s.status === 'ativo') && (
                    <button
                      type="button"
                      onClick={() => {
                        const emails = newsletterSubs
                          .filter((s) => s.status === 'ativo')
                          .map((s) => s.email)
                          .join(', ');
                        navigator.clipboard?.writeText(emails);
                        showToast('Lista de e-mails activos copiada para a área de transferência.');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#182C61] bg-[#EEF3FA] hover:bg-[#DCE6F5] rounded-lg transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copiar E-mails Activos</span>
                    </button>
                  )}
                </div>

                {newsletterSubs.length === 0 ? (
                  <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-sm text-[#29332F]/65">
                    Ainda não existem subscrições de newsletter registadas.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newsletterSubs.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                                sub.status === 'ativo'
                                  ? 'bg-[#E6F4EC] text-[#1B6B4A]'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {sub.status}
                            </span>
                            <span className="text-xs text-[#29332F]/60">
                              Origem: {sub.sourcePage}
                            </span>
                          </div>
                          <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                            {sub.email}
                            {sub.name ? (
                              <span className="font-normal text-sm text-[#29332F]/75">
                                {' '}
                                — {sub.name}
                              </span>
                            ) : null}
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {sub.topics.map((topic) => (
                              <span
                                key={topic}
                                className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F4F7F5] text-[#182C61] border border-neutral-200"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            aria-label={`Estado de ${sub.email}`}
                            value={sub.status}
                            onChange={(e) => {
                              if (!requireCloudSync()) return;
                              updateDoc(doc(db, 'newsletterSubscribers', sub.id), {
                                status: e.target.value,
                                updatedAt: serverTimestamp(),
                              })
                                .then(() => showToast('Estado da subscrição actualizado.'))
                                .catch((err) =>
                                  handleFirestoreError(
                                    err,
                                    OperationType.UPDATE,
                                    `newsletterSubscribers/${sub.id}`
                                  )
                                );
                            }}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                          >
                            <option value="ativo">Activo</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteRecord('newsletterSubscribers', sub.id)}
                            aria-label="Eliminar subscritor"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: TESTIMONIALS & FEEDBACK */}
            {activeTab === 'testimonials' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                      Testemunhos &amp; Comentários ({testimonialsList.length})
                    </h2>
                    <p className="text-xs text-[#29332F]/65 mt-0.5">
                      Avaliações e comentários submetidos pelos visitantes. Pode ocultar ou eliminar registos inadequados.
                    </p>
                  </div>
                  {testimonialsList.length === 0 && (
                    <button
                      type="button"
                      onClick={seedDefaultTestimonials}
                      className="px-4 py-2 text-xs font-semibold bg-[#1E7E54] text-white rounded-lg hover:bg-[#1B6B4A]"
                    >
                      Importar 4 Testemunhos Base para Base de Dados
                    </button>
                  )}
                </div>

                {testimonialsList.length === 0 ? (
                  <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-sm text-[#29332F]/65">
                    Nenhum testemunho ou comentário submetido até ao momento.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testimonialsList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span
                              className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                                item.published
                                  ? 'bg-[#E6F4EC] text-[#1B6B4A]'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {item.published ? 'Publicado' : 'Oculto'}
                            </span>
                            <div
                              className="flex items-center gap-0.5"
                              aria-label={`Classificação: ${item.rating} de 5`}
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= item.rating
                                      ? 'fill-[#1E7E54] text-[#1E7E54]'
                                      : 'text-neutral-300'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                          </div>
                          <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                            {item.authorName}
                            {item.role || item.organization ? (
                              <span className="font-normal text-xs text-[#29332F]/70">
                                {' '}
                                — {[item.role, item.organization].filter(Boolean).join(' · ')}
                              </span>
                            ) : null}
                          </h3>
                          <p className="text-sm text-[#29332F]/85 whitespace-pre-line leading-relaxed">
                            “{item.comment}”
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (!requireCloudSync()) return;
                              updateDoc(doc(db, 'testimonials', item.id), {
                                published: !item.published,
                                updatedAt: serverTimestamp(),
                              })
                                .then(() =>
                                  showToast(
                                    !item.published
                                      ? 'Testemunho publicado no website.'
                                      : 'Testemunho ocultado do website.'
                                  )
                                )
                                .catch((err) =>
                                  handleFirestoreError(
                                    err,
                                    OperationType.UPDATE,
                                    `testimonials/${item.id}`
                                  )
                                );
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                              item.published
                                ? 'border-neutral-300 text-[#29332F] hover:bg-neutral-50'
                                : 'border-[#1E7E54] bg-[#1E7E54] text-white hover:bg-[#1B6B4A]'
                            }`}
                          >
                            {item.published ? 'Ocultar' : 'Publicar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRecord('testimonials', item.id)}
                            aria-label="Eliminar testemunho"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                    Gestão de Serviços ({servicesList.length})
                  </h2>
                  {servicesList.length === 0 && (
                    <button
                      type="button"
                      onClick={seedDefaultServices}
                      className="px-4 py-2 text-xs font-semibold bg-[#1E7E54] text-white rounded-lg hover:bg-[#1B6B4A]"
                    >
                      Importar 9 Serviços Base para Base de Dados
                    </button>
                  )}
                </div>

                <form
                  onSubmit={createService}
                  className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4"
                >
                  <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                    Adicionar Novo Serviço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Código (ex: J)"
                      value={newServiceCode}
                      onChange={(e) => setNewServiceCode(e.target.value)}
                      className="px-3 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Título do Serviço *"
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      className="md:col-span-2 px-3 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      placeholder="URL da Imagem"
                      value={newServiceImage}
                      onChange={(e) => setNewServiceImage(e.target.value)}
                      className="px-3 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Descrição resumida *"
                    value={newServiceShort}
                    onChange={(e) => setNewServiceShort(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300"
                  />
                  <textarea
                    rows={3}
                    placeholder="Descrição técnica completa..."
                    value={newServiceFull}
                    onChange={(e) => setNewServiceFull(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1B6B4A] text-white rounded-lg hover:bg-[#1E7E54]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Guardar Serviço</span>
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesList.map((srv) => (
                    <div
                      key={srv.id}
                      className="bg-white rounded-xl border border-neutral-200 p-5 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-mono text-[#1E7E54]">
                          Serviço {srv.code} · {srv.active ? 'Activo' : 'Inactivo'}
                        </p>
                        <h4 className="font-display font-bold text-[#1B6B4A] mt-0.5">
                          {srv.title}
                        </h4>
                        <p className="text-xs text-[#29332F]/75 mt-1">{srv.shortDescription}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRecord('services', srv.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                        aria-label="Eliminar serviço"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                  Gestão de Projectos e Portfólio ({projectsList.length})
                </h2>

                <form
                  onSubmit={createProject}
                  className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4"
                >
                  <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                    Adicionar Projecto Confirmado
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Nome do Projecto *"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      placeholder="Cliente (apenas se autorizado)"
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Localização (ex.: Luanda, Angola) *"
                      value={projLocation}
                      onChange={(e) => setProjLocation(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Sector de Actividade *"
                      value={projSector}
                      onChange={(e) => setProjSector(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <select
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value as ProjectCategory)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    >
                      {PROJECT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="URL da Fotografia"
                      value={projImage}
                      onChange={(e) => setProjImage(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Descrição dos trabalhos realizados *"
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Serviços prestados (separados por vírgula)"
                      value={projServices}
                      onChange={(e) => setProjServices(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      placeholder="Resultados alcançados"
                      value={projResults}
                      onChange={(e) => setProjResults(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={projConfirmed}
                      onChange={(e) => setProjConfirmed(e.target.checked)}
                    />
                    <span>Publicar como projecto confirmado e autorizado no site</span>
                  </label>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1B6B4A] text-white rounded-lg hover:bg-[#1E7E54]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Projecto</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {projectsList.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs text-[#1E7E54] font-medium">
                          {proj.category} · {proj.location} ·{' '}
                          {proj.confirmed ? 'Publicado' : 'Rascunho'}
                        </p>
                        <h4 className="font-display font-bold text-[#1B6B4A]">{proj.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateDoc(doc(db, 'projects', proj.id), {
                              confirmed: !proj.confirmed,
                              updatedAt: serverTimestamp(),
                            }).catch((err) =>
                              handleFirestoreError(err, OperationType.UPDATE, `projects/${proj.id}`)
                            )
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-[#F4F7F5] rounded-lg"
                        >
                          {proj.confirmed ? 'Ocultar' : 'Publicar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecord('projects', proj.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          aria-label="Eliminar projecto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                    Gestão da Galeria ({galleryList.length})
                  </h2>
                  {galleryList.length === 0 && (
                    <button
                      type="button"
                      onClick={seedDefaultGallery}
                      className="px-4 py-2 text-xs font-semibold bg-[#1E7E54] text-white rounded-lg"
                    >
                      Importar Galeria Inicial
                    </button>
                  )}
                </div>

                <form
                  onSubmit={createGalleryItem}
                  className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4"
                >
                  <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                    Adicionar Fotografia à Galeria
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Título da Fotografia *"
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value as GalleryCategory)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    >
                      {GALLERY_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="URL da Imagem *"
                      value={galImage}
                      onChange={(e) => setGalImage(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      placeholder="Localização / Data"
                      value={galLocation}
                      onChange={(e) => setGalLocation(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Legenda descritiva *"
                    value={galCaption}
                    onChange={(e) => setGalCaption(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1B6B4A] text-white rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Fotografia</span>
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {galleryList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-[#1E7E54]">{item.category}</p>
                        <p className="text-sm font-bold text-[#1B6B4A] truncate">{item.title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRecord('gallery', item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                        aria-label="Eliminar foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: NEWS */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                    Gestão de Notícias e Publicações ({newsList.length})
                  </h2>
                  {newsList.length === 0 && (
                    <button
                      type="button"
                      onClick={seedDefaultNews}
                      className="px-4 py-2 text-xs font-semibold bg-[#1E7E54] text-white rounded-lg"
                    >
                      Importar Publicações Base
                    </button>
                  )}
                </div>

                <form
                  onSubmit={createNewsArticle}
                  className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4"
                >
                  <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                    Publicar Nova Notícia ou Artigo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Título da Publicação *"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value as NewsCategory)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    >
                      {NEWS_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="URL da Imagem de Capa"
                      value={newsImage}
                      onChange={(e) => setNewsImage(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Resumo (1-2 frases) *"
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                  />
                  <textarea
                    required
                    rows={5}
                    placeholder="Conteúdo completo do artigo (mínimo 20 caracteres) *"
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                  />
                  <label className="inline-flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={newsPublished}
                      onChange={(e) => setNewsPublished(e.target.checked)}
                    />
                    <span>Publicar imediatamente</span>
                  </label>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1B6B4A] text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publicar Artigo</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {newsList.map((art) => (
                    <div
                      key={art.id}
                      className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs text-[#1E7E54] font-mono tabular-nums">
                          {art.publishedDate} · {art.category} ·{' '}
                          {art.published ? 'Publicado' : 'Rascunho'}
                        </p>
                        <h4 className="font-display font-bold text-[#1B6B4A]">{art.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRecord('news', art.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Eliminar notícia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PARTNERS */}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                  Gestão de Parceiros e Clientes Autorizados ({partnersList.length})
                </h2>

                <form
                  onSubmit={createPartner}
                  className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4"
                >
                  <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                    Adicionar Logótipo Autorizado
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Nome da Entidade *"
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      placeholder="Sector"
                      value={partSector}
                      onChange={(e) => setPartSector(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      required
                      placeholder="URL do Logótipo (carregue na secção Imagens & Documentos) *"
                      value={partLogo}
                      onChange={(e) => setPartLogo(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="url"
                      placeholder="Website (opcional, https://...)"
                      value={partWebsite}
                      onChange={(e) => setPartWebsite(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={partAuthorized}
                      onChange={(e) => setPartAuthorized(e.target.checked)}
                    />
                    <span>Logótipo formalmente autorizado para exibição pública</span>
                  </label>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1B6B4A] text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Guardar Parceiro</span>
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {partnersList.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#1B6B4A] truncate">{p.name}</p>
                        <p className="text-xs text-[#29332F]/65">
                          {p.authorized ? 'Autorizado' : 'Oculto'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRecord('partners', p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Eliminar parceiro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MEDIA */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                  Gestão de Imagens e Documentos ({mediaList.length})
                </h2>

                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                    Carregar Nova Imagem ou Documento Técnico
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Título descritivo"
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <input
                      type="text"
                      placeholder="Categoria (ex.: Logótipos, Projectos, PDF)"
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                    />
                    <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#1B6B4A] text-white rounded-lg cursor-pointer hover:bg-[#1E7E54]">
                      <UploadCloud className="w-4 h-4" />
                      <span>{mediaUploading ? 'A Carregar...' : 'Selecionar Ficheiro (máx 5MB)'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        disabled={mediaUploading}
                        onChange={handleMediaFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaList.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-[#1E7E54]">
                            {asset.type === 'image' ? 'Imagem' : 'Documento'} · {asset.sizeLabel}
                          </p>
                          <p className="text-sm font-bold text-[#1B6B4A] truncate">{asset.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteRecord('media', asset.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          aria-label="Eliminar ficheiro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(asset.url);
                            showToast('URL copiado para a área de transferência.');
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#1B6B4A] bg-[#F4F7F5] px-2.5 py-1.5 rounded-md hover:bg-neutral-200"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar URL</span>
                        </button>
                        {sanitizeHref(asset.url) && (
                          <a
                            href={sanitizeHref(asset.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#29332F]/70 hover:underline"
                          >
                            Abrir
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ACCESS & CREDENTIALS */}
            {activeTab === 'access' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-[#1B6B4A]">
                  Link Privado de Acesso e Credenciais
                </h2>

                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                        Link Privado da Área Reservada
                      </h3>
                      <p className="text-xs text-[#29332F]/75 mt-1">
                        A Área Reservada encontra-se oculta do website público. Partilhe este link
                        apenas com utilizadores autorizados.
                      </p>
                    </div>
                    {!accessKeyEnvManaged && (
                      <button
                        type="button"
                        disabled={rotatingLink}
                        onClick={handleRotateAccessLink}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#182C61] text-white hover:bg-[#1D5E9C] rounded-lg transition-colors disabled:opacity-60"
                      >
                        <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{rotatingLink ? 'A Gerar...' : 'Gerar Novo Link de Acesso'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-lg bg-[#F4F7F5] border border-neutral-200">
                    <code className="text-xs font-mono text-[#182C61] break-all flex-1">
                      {privateAccessUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(privateAccessUrl);
                        showToast('Link privado copiado para a área de transferência.');
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-neutral-300 text-[#1B6B4A] hover:bg-neutral-50 rounded-lg shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copiar Link</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#1B6B4A]">
                      Utilizador e Palavra-passe
                    </h3>
                    <p className="text-xs text-[#29332F]/75 mt-1">
                      Sessão activa com o utilizador:{' '}
                      <span className="font-mono font-semibold text-[#182C61]">
                        {adminUsername}
                      </span>
                    </p>
                  </div>

                  {envManaged ? (
                    <div className="p-4 rounded-lg bg-[#F4F7F5] border border-neutral-200 text-xs text-[#29332F]/80">
                      As credenciais de administração estão definidas através das variáveis de
                      ambiente do servidor (<code>ADMIN_USERNAME</code> e{' '}
                      <code>ADMIN_PASSWORD</code>).
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Palavra-passe Actual *
                        </label>
                        <input
                          type="password"
                          required
                          autoComplete="current-password"
                          value={currentPwd}
                          onChange={(e) => setCurrentPwd(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Novo Nome de Utilizador *
                        </label>
                        <input
                          type="text"
                          required
                          minLength={3}
                          maxLength={64}
                          value={newPwdUser}
                          onChange={(e) => setNewPwdUser(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            Nova Palavra-passe (mín. 8) *
                          </label>
                          <input
                            type="password"
                            required
                            minLength={8}
                            maxLength={128}
                            autoComplete="new-password"
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            Confirmar Nova Palavra-passe *
                          </label>
                          <input
                            type="password"
                            required
                            minLength={8}
                            maxLength={128}
                            autoComplete="new-password"
                            value={newPwdConfirm}
                            onChange={(e) => setNewPwdConfirm(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={updatingCreds}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1B6B4A] hover:bg-[#1E7E54] text-white rounded-lg transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {updatingCreds ? 'A Actualizar...' : 'Actualizar Utilizador e Palavra-passe'}
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
