import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  DEFAULT_GALLERY,
  DEFAULT_NEWS,
  DEFAULT_SERVICES,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TESTIMONIALS,
  IMG_BANNER_PROJECTS,
  IMG_FIELD,
  IMG_WASTE,
  normalizeLegacyAssetUrl,
} from '../data/defaults';
import type {
  GalleryItem,
  NewsArticle,
  PartnerItem,
  ProjectItem,
  ServiceItem,
  SiteSettings,
  TestimonialItem,
} from '../types';

const BOOTSTRAPPED_ADMIN_EMAIL = 'joaomuatxissombo22@gmail.com';

interface SiteContextValue {
  settings: SiteSettings;
  services: ServiceItem[];
  projects: ProjectItem[];
  gallery: GalleryItem[];
  news: NewsArticle[];
  partners: PartnerItem[];
  testimonials: TestimonialItem[];
  loadingPublic: boolean;
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  proposalModalOpen: boolean;
  preselectedService: string;
  openProposalModal: (serviceTitle?: string) => void;
  closeProposalModal: () => void;
}

const SiteContext = createContext<SiteContextValue | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [news, setNews] = useState<NewsArticle[]>(DEFAULT_NEWS);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [loadingPublic, setLoadingPublic] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      if (
        currentUser.emailVerified &&
        currentUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL
      ) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      try {
        const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
        setIsAdmin(adminSnap.exists() && currentUser.emailVerified);
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    // Public Site Settings listener
    const unsubSettings = onSnapshot(
      doc(db, 'siteSettings', 'main'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<SiteSettings>;
          const merged = { ...DEFAULT_SITE_SETTINGS, ...data };
          if (
            !data.indicatorsConfirmed &&
            !data.projectsCompleted &&
            !data.studiesDeveloped &&
            !data.licensesSupported
          ) {
            merged.yearsExperience = data.yearsExperience || DEFAULT_SITE_SETTINGS.yearsExperience;
            merged.projectsCompleted = DEFAULT_SITE_SETTINGS.projectsCompleted;
            merged.studiesDeveloped = DEFAULT_SITE_SETTINGS.studiesDeveloped;
            merged.licensesSupported = DEFAULT_SITE_SETTINGS.licensesSupported;
            merged.indicatorsConfirmed = true;
          }
          setSettings(merged);
        }
        setLoadingPublic(false);
      },
      (error) => {
        setLoadingPublic(false);
        handleFirestoreError(error, OperationType.GET, 'siteSettings/main');
      }
    );

    // Public Services listener
    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        if (!snap.empty) {
          const defaultById = new Map(DEFAULT_SERVICES.map((s) => [s.id, s]));
          const loaded = snap.docs
            .map((d) => {
              const raw = d.data() as Omit<ServiceItem, 'id'>;
              const fallbackUrl = defaultById.get(d.id)?.imageUrl;
              const isLegacy = !raw.imageUrl || raw.imageUrl.startsWith('/src/assets/images/');
              return {
                id: d.id,
                ...raw,
                imageUrl: isLegacy && fallbackUrl
                  ? fallbackUrl
                  : normalizeLegacyAssetUrl(raw.imageUrl),
              };
            })
            .filter((s) => s.active !== false)
            .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setServices(loaded);
        } else {
          setServices(DEFAULT_SERVICES);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'services')
    );

    // Public Confirmed Projects listener (must filter confirmed == true to match rules)
    const unsubProjects = onSnapshot(
      query(collection(db, 'projects'), where('confirmed', '==', true)),
      (snap) => {
        const loaded = snap.docs.map((d) => {
          const raw = d.data() as Omit<ProjectItem, 'id'>;
          return {
            id: d.id,
            ...raw,
            imageUrl: normalizeLegacyAssetUrl(raw.imageUrl, IMG_BANNER_PROJECTS),
          };
        });
        setProjects(loaded);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'projects')
    );

    // Public Gallery listener
    const unsubGallery = onSnapshot(
      collection(db, 'gallery'),
      (snap) => {
        if (!snap.empty) {
          const defaultById = new Map(DEFAULT_GALLERY.map((g) => [g.id, g]));
          const loaded = snap.docs.map((d) => {
            const raw = d.data() as Omit<GalleryItem, 'id'>;
            const def = defaultById.get(d.id);
            const isLegacy = !raw.imageUrl || raw.imageUrl.startsWith('/src/assets/images/');
            return {
              id: d.id,
              ...raw,
              imageUrl: isLegacy && def
                ? def.imageUrl
                : normalizeLegacyAssetUrl(raw.imageUrl, IMG_FIELD),
            };
          });
          const loadedIds = new Set(loaded.map((g) => g.id));
          const extraDefaults = DEFAULT_GALLERY.filter((g) => !loadedIds.has(g.id));
          setGallery([...extraDefaults, ...loaded]);
        } else {
          setGallery(DEFAULT_GALLERY);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'gallery')
    );

    // Public Published News listener (must filter published == true to match rules)
    const unsubNews = onSnapshot(
      query(collection(db, 'news'), where('published', '==', true)),
      (snap) => {
        if (!snap.empty) {
          const defaultById = new Map(DEFAULT_NEWS.map((n) => [n.id, n]));
          const loaded = snap.docs
            .map((d) => {
              const raw = d.data() as Omit<NewsArticle, 'id'>;
              const def = defaultById.get(d.id);
              const isLegacy = !raw.imageUrl || raw.imageUrl.startsWith('/src/assets/images/');
              return {
                id: d.id,
                ...raw,
                imageUrl: isLegacy && def
                  ? def.imageUrl
                  : normalizeLegacyAssetUrl(raw.imageUrl, IMG_WASTE),
              };
            })
            .sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''));
          setNews(loaded);
        } else {
          setNews(DEFAULT_NEWS);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'news')
    );

    // Public Authorized Partners listener (must filter authorized == true to match rules)
    const unsubPartners = onSnapshot(
      query(collection(db, 'partners'), where('authorized', '==', true)),
      (snap) => {
        const loaded = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<PartnerItem, 'id'>) }))
          .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        setPartners(loaded);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'partners')
    );

    // Public Published Testimonials listener (must filter published == true to match rules)
    const unsubTestimonials = onSnapshot(
      query(collection(db, 'testimonials'), where('published', '==', true)),
      (snap) => {
        const toMillis = (ts: unknown): number => {
          if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as { toMillis: () => number }).toMillis === 'function') {
            return (ts as { toMillis: () => number }).toMillis();
          }
          if (ts && typeof ts === 'object' && 'seconds' in ts && typeof (ts as { seconds: number }).seconds === 'number') {
            return (ts as { seconds: number }).seconds * 1000;
          }
          return 0;
        };
        const loaded = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<TestimonialItem, 'id'>) }))
          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        if (!snap.empty) {
          const hasSeededInDb = loaded.some((item) => item.id.startsWith('test-'));
          setTestimonials(hasSeededInDb ? loaded : [...loaded, ...DEFAULT_TESTIMONIALS]);
        } else {
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials')
    );

    return () => {
      unsubSettings();
      unsubServices();
      unsubProjects();
      unsubGallery();
      unsubNews();
      unsubPartners();
      unsubTestimonials();
    };
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const openProposalModal = (serviceTitle = '') => {
    setPreselectedService(serviceTitle);
    setProposalModalOpen(true);
  };

  const closeProposalModal = () => {
    setProposalModalOpen(false);
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        services,
        projects,
        gallery,
        news,
        partners,
        testimonials,
        loadingPublic,
        user,
        authReady,
        isAdmin,
        loginWithGoogle,
        logout,
        proposalModalOpen,
        preselectedService,
        openProposalModal,
        closeProposalModal,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite deve ser usado dentro de SiteProvider');
  return ctx;
}
