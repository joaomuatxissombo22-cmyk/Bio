export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  institutionalTitle: string;
  institutionalDescription: string;
  yearsExperience: string;
  projectsCompleted: string;
  studiesDeveloped: string;
  licensesSupported: string;
  indicatorsConfirmed: boolean;
  address: string;
  generalEmail: string;
  recruitmentEmail: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  missionText: string;
  visionText: string;
  updatedAt?: unknown;
}

export interface ServiceItem {
  id: string;
  code: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  benefits: string[];
  methodology: string[];
  imageUrl: string;
  iconName: string;
  order: number;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type ProjectCategory =
  | 'Estudos ambientais'
  | 'Licenciamento ambiental'
  | 'Auditorias ambientais'
  | 'Monitorização ambiental'
  | 'Indústria e energia'
  | 'Portos e terminais'
  | 'Gestão de resíduos'
  | 'Projectos de sustentabilidade';

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  location: string;
  sector: string;
  category: ProjectCategory;
  description: string;
  servicesProvided: string[];
  results: string;
  imageUrl: string;
  confirmed: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type GalleryCategory =
  | 'Trabalhos de campo'
  | 'Visitas técnicas'
  | 'Campanhas de monitorização'
  | 'Recolha de amostras'
  | 'Avaliações ambientais'
  | 'Actividades industriais'
  | 'Reuniões técnicas'
  | 'Projectos concluídos';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  location: string;
  imageUrl: string;
  capturedAt: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type NewsCategory =
  | 'Notícias institucionais'
  | 'Novos projectos'
  | 'Actividades da empresa'
  | 'Artigos técnicos'
  | 'Informações ambientais'
  | 'Legislação e actualizações ambientais'
  | 'Eventos e formações';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  summary: string;
  content: string;
  imageUrl: string;
  publishedDate: string;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PartnerItem {
  id: string;
  name: string;
  sector: string;
  logoUrl: string;
  websiteUrl: string;
  authorized: boolean;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProposalRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  sector: string;
  serviceRequested: string;
  projectLocation: string;
  description: string;
  attachmentName: string;
  attachmentUrl: string;
  status: 'novo' | 'em_analise' | 'respondido' | 'arquivado';
  adminNotes: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'novo' | 'lido' | 'respondido';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'image' | 'document';
  category: string;
  url: string;
  fileName: string;
  mimeType: string;
  sizeLabel: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type NewsletterTopic =
  | 'Legislação Ambiental'
  | 'Notícias da Empresa'
  | 'Artigos Técnicos';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  topics: NewsletterTopic[];
  status: 'ativo' | 'cancelado';
  sourcePage: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  organization: string;
  role: string;
  rating: number;
  comment: string;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

