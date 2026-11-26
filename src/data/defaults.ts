import type {
  GalleryCategory,
  GalleryItem,
  NewsArticle,
  NewsCategory,
  ProjectCategory,
  ServiceItem,
  SiteSettings,
  TestimonialItem,
} from '../types';

export const BIOSFERA_LOGO_URL = '/assets/aistudio/passe-32_118f49e4.png';
export const BIOSFERA_LOGO_GIF_URL = '/assets/biosfera-natal.gif?v=4';

export const IMG_HERO = '/assets/aistudio/_MGL0157_cc28238c.jpg';
export const IMG_FIELD = '/assets/aistudio/_MGL0362_311a9a2d.jpg';
export const IMG_INDUSTRIAL = '/assets/aistudio/WhatsApp_Image_2025-04-09_at_14.03.02_55722da1.jpeg';
export const IMG_WASTE = '/assets/aistudio/WhatsApp_Image_2025-04-09_at_14.03.03__10__038ac7eb.jpeg';
export const IMG_MANGROVE = '/assets/aistudio/_MGL0258_161e3e28.jpg';
export const IMG_BIODIVERSITY = '/assets/aistudio/_MGL0392_6158335f.jpg';
export const IMG_OFFICE = '/assets/aistudio/111_e7a0d7a9.jpg';

export const IMG_BANNER_ABOUT = '/assets/aistudio/_MGL0372_copy_b3ed7f8b.jpg';
export const IMG_BANNER_PROJECTS = '/assets/aistudio/WhatsApp_Image_2026-04-27_at_13.48.33_bc1c7174.jpeg';
export const IMG_BANNER_NEWS = '/assets/aistudio/_MGL0127_eb23bc5c.jpg';
export const IMG_BANNER_CONTACT = '/assets/aistudio/_MGL0145_ae36d4cd.jpg';

const LEGACY_ASSET_MAP: Record<string, string> = {
  '/src/assets/images/hero_biosfera_angola_1795516405716.jpg': IMG_HERO,
  '/src/assets/images/field_monitoring_angola_1795516404874.jpg': IMG_FIELD,
  '/src/assets/images/industrial_eia_audit_1795516405304.jpg': IMG_INDUSTRIAL,
  '/src/assets/images/waste_management_facility_1795516407306.jpg': IMG_WASTE,
  '/src/assets/images/sustainability_mangrove_1795516407582.jpg': IMG_MANGROVE,
  '/src/assets/images/banner_about_consultancy_1795605311876.jpg': IMG_BANNER_ABOUT,
  '/src/assets/images/banner_projects_port_energy_1795605312303.jpg': IMG_BANNER_PROJECTS,
  '/src/assets/images/banner_news_regulatory_1795605311938.jpg': IMG_BANNER_NEWS,
  '/src/assets/images/banner_contact_luanda_1795605314381.jpg': IMG_BANNER_CONTACT,
  '/assets/aistudio/111_e7a0d7a9.png': IMG_OFFICE,
};

export function normalizeLegacyAssetUrl(url?: string, fallback = IMG_HERO): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (LEGACY_ASSET_MAP[trimmed]) return LEGACY_ASSET_MAP[trimmed];
  if (trimmed.startsWith('/src/assets/images/')) return fallback;
  return trimmed;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroTitle: 'CONSULTORIA AMBIENTAL E SOLUÇÕES SUSTENTÁVEIS',
  heroSubtitle:
    'Transformamos desafios ambientais em soluções sustentáveis, promovendo o equilíbrio entre o desenvolvimento económico, a responsabilidade ambiental e a preservação dos recursos naturais.',
  institutionalTitle: 'Compromisso com o Ambiente. Responsabilidade com o Futuro.',
  institutionalDescription:
    'A BIOSFERA – Consultoria Ambiental, Lda. é uma empresa angolana com mais de 10 anos de experiência, dedicada à prestação de serviços especializados em gestão ambiental, licenciamento, estudos de impacte ambiental, auditorias e acompanhamento técnico de projectos em todo o território nacional.',
  yearsExperience: '+10',
  projectsCompleted: '+150',
  studiesDeveloped: '+500',
  licensesSupported: '+80',
  indicatorsConfirmed: true,
  address: 'Centralidade do Kilamba, Edifício Q19, Porta n.º 03, Município de Belas, Luanda, Angola',
  generalEmail: 'biosfera.geral@biosfera.ao',
  recruitmentEmail: 'recrutamentoeselecao@biosfera.ao',
  phonePrimary: '+244 939 870 874',
  phoneSecondary: '+244 944 513 712',
  whatsappNumber: '244939870874',
  missionText:
    'Prestar serviços especializados de consultoria ambiental, desenvolvendo soluções técnicas que promovam a protecção do ambiente, a utilização responsável dos recursos naturais e o cumprimento das obrigações ambientais.',
  visionText:
    'Ser uma referência nacional em consultoria ambiental, reconhecida pela excelência técnica, inovação, responsabilidade e compromisso com o desenvolvimento sustentável.',
};

export const SECTORS_LIST = [
  {
    name: 'Petróleo e Gás',
    description: 'Conformidade ambiental offshore e onshore, monitorização de emissões e gestão de passivos.',
    iconName: 'Flame',
  },
  {
    name: 'Indústria e Transformação',
    description: 'Licenciamento industrial, auditorias de desempenho ambiental e controlo de efluentes.',
    iconName: 'Factory',
  },
  {
    name: 'Construção Civil',
    description: 'Planos de gestão ambiental de estaleiro, controlo de ruído e gestão de resíduos de obra.',
    iconName: 'HardHat',
  },
  {
    name: 'Energia',
    description: 'Estudos ambientais para subestações, linhas de transporte, centrais térmicas e solares.',
    iconName: 'Zap',
  },
  {
    name: 'Transportes e Logística',
    description: 'Avaliação ambiental de corredores logísticos, frotas e armazenagem de cargas.',
    iconName: 'Truck',
  },
  {
    name: 'Portos e Terminais',
    description: 'Monitorização costeira, dragagens, gestão portuária de resíduos e planos de contingência.',
    iconName: 'Anchor',
  },
  {
    name: 'Infra-estruturas',
    description: 'Avaliação de impactes em projectos rodoviários, hídricos, saneamento e urbanização.',
    iconName: 'Building2',
  },
  {
    name: 'Gestão de Resíduos',
    description: 'Caracterização, segregação, licenciamento de operadores e soluções de valorização.',
    iconName: 'Recycle',
  },
  {
    name: 'Agricultura e Desenvolvimento Rural',
    description: 'Uso sustentável do solo, recursos hídricos, biodiversidade e boas práticas agro-ambientais.',
    iconName: 'Sprout',
  },
] as const;

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Estudos ambientais',
  'Licenciamento ambiental',
  'Auditorias ambientais',
  'Monitorização ambiental',
  'Indústria e energia',
  'Portos e terminais',
  'Gestão de resíduos',
  'Projectos de sustentabilidade',
];

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Trabalhos de campo',
  'Visitas técnicas',
  'Campanhas de monitorização',
  'Recolha de amostras',
  'Avaliações ambientais',
  'Actividades industriais',
  'Reuniões técnicas',
  'Projectos concluídos',
];

export const NEWS_CATEGORIES: NewsCategory[] = [
  'Notícias institucionais',
  'Novos projectos',
  'Actividades da empresa',
  'Artigos técnicos',
  'Informações ambientais',
  'Legislação e actualizações ambientais',
  'Eventos e formações',
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'eia',
    code: 'A',
    slug: 'estudos-de-impacte-ambiental',
    title: 'Estudos de Impacte Ambiental (EIA)',
    shortDescription:
      'Avaliação rigorosa de impactes biofísicos e socioeconómicos com definição de medidas de mitigação e programas de acompanhamento.',
    fullDescription:
      'Elaboramos Estudos de Impacte Ambiental (EIA) e Estudos de Impacte Ambiental e Social em estrita conformidade com a legislação ambiental angolana, apoiando promotores públicos e privados desde a fase de concepção até à obtenção da viabilidade ambiental.',
    objectives: [
      'Caracterização detalhada da situação ambiental e socioeconómica de referência.',
      'Identificação, previsão e avaliação quantitativa e qualitativa de impactes ambientais.',
      'Proposta de medidas de mitigação, compensação e potenciação ambiental.',
      'Estruturação de Programas de Acompanhamento e Monitorização Ambiental.',
    ],
    benefits: [
      'Redução de riscos regulatórios e embargos administrativos.',
      'Integração precoce de soluções ambientalmente eficientes no projecto.',
      'Conformidade integral com o Decreto Presidencial n.º 117/20.',
    ],
    methodology: [
      'Definição do âmbito e termo de referência do estudo.',
      'Levantamentos de campo multidisciplinares e recolha de dados primários.',
      'Matriz de avaliação de impactes e modelação técnica.',
      'Elaboração do Relatório de Impacte Ambiental e Resumo Não Técnico.',
    ],
    imageUrl: '/assets/aistudio/_MGL0145_ae36d4cd.jpg',
    iconName: 'FileSearch',
    order: 1,
    active: true,
  },
  {
    id: 'licenciamento',
    code: 'B',
    slug: 'licenciamento-ambiental',
    title: 'Licenciamento Ambiental',
    shortDescription:
      'Assessoria técnica integral na instrução, tramitação e regularização de processos de licenciamento junto das entidades competentes.',
    fullDescription:
      'Prestamos assessoria técnica completa em todas as etapas do licenciamento ambiental em Angola, assegurando a preparação rigorosa da documentação técnica exigida e o acompanhamento contínuo junto das autoridades ambientais.',
    objectives: [
      'Assessoria técnica estratégica em processos de Licenciamento Ambiental de Instalação e Operação.',
      'Preparação, revisão e organização documental de dossiês técnicos.',
      'Acompanhamento técnico contínuo junto das entidades governamentais competentes.',
      'Apoio à regularização ambiental de actividades e instalações existentes.',
    ],
    benefits: [
      'Agilidade e precisão técnica na instrução processual.',
      'Minimização de exigências adicionais ou devoluções documentais.',
      'Segurança jurídica para o arranque e continuidade operacional.',
    ],
    methodology: [
      'Enquadramento legal da actividade ou empreendimento.',
      'Levantamento técnico das instalações e condições operacionais.',
      'Compilação do processo técnico e submissão formal.',
      'Acompanhamento de vistorias e cumprimento de condicionantes.',
    ],
    imageUrl: '/assets/aistudio/WhatsApp_Image_2026-04-27_at_13.48.32__1__094d5e3f.jpg',
    iconName: 'ShieldCheck',
    order: 2,
    active: true,
  },
  {
    id: 'auditorias',
    code: 'C',
    slug: 'auditorias-ambientais',
    title: 'Auditorias Ambientais',
    shortDescription:
      'Auditorias de conformidade e desempenho ambiental para identificação de não conformidades e planos estruturados de melhoria.',
    fullDescription:
      'Realizamos auditorias ambientais independentes e sistemáticas para verificar a conformidade legal, avaliar o desempenho ambiental de unidades operacionais e estabelecer planos de acção correctiva orientados para resultados.',
    objectives: [
      'Execução de auditorias de conformidade ambiental e verificação normativa.',
      'Avaliação objectiva do desempenho ambiental de instalações e operações.',
      'Identificação, classificação e documentação de não conformidades.',
      'Elaboração de recomendações técnicas, planos de melhoria e relatórios de auditoria.',
    ],
    benefits: [
      'Visibilidade clara sobre passivos e riscos ambientais operacionais.',
      'Preparação eficaz para inspecções regulatórias e certificações ISO 14001.',
      'Optimização de processos com redução de desperdícios e custos.',
    ],
    methodology: [
      'Revisão documental prévia e definição de protocolo de auditoria.',
      'Inspecção técnica presencial, entrevistas e verificação de evidências.',
      'Classificação de constatações e análise de causa raiz.',
      'Emissão do Relatório Técnico de Auditoria e Plano de Acções Correctivas.',
    ],
    imageUrl: IMG_INDUSTRIAL,
    iconName: 'ClipboardCheck',
    order: 3,
    active: true,
  },
  {
    id: 'rma',
    code: 'D',
    slug: 'relatorios-de-monitorizacao-ambiental',
    title: 'Relatórios de Monitorização Ambiental (RMA)',
    shortDescription:
      'Acompanhamento periódico de parâmetros ambientais e verificação das condicionantes de licença com reporte técnico estruturado.',
    fullDescription:
      'Desenvolvemos Relatórios de Monitorização Ambiental (RMA) periódicos para comprovar o cumprimento das medidas ambientais e condicionantes de licenciamento, consolidando dados analíticos de campo com rigor científico.',
    objectives: [
      'Monitorização sistemática de parâmetros físicos, químicos e biológicos.',
      'Avaliação contínua do grau de cumprimento das medidas mitigadoras.',
      'Elaboração de relatórios técnicos periódicos para as autoridades competentes.',
      'Acompanhamento rigoroso das condicionantes ambientais da licença.',
    ],
    benefits: [
      'Manutenção regular e transparente das licenças ambientais vigentes.',
      'Detecção precoce de desvios nos parâmetros ambientais.',
      'Histórico técnico fiável para tomada de decisão da gestão.',
    ],
    methodology: [
      'Planeamento das campanhas conforme condicionantes e periodicidade legal.',
      'Execução de medições in situ e amostragem certificada.',
      'Tratamento estatístico e comparação com limites regulamentares.',
      'Submissão e apresentação técnica do RMA.',
    ],
    imageUrl: IMG_HERO,
    iconName: 'Activity',
    order: 4,
    active: true,
  },
  {
    id: 'pga',
    code: 'E',
    slug: 'planos-de-gestao-ambiental',
    title: 'Planos de Gestão Ambiental (PGA)',
    shortDescription:
      'Instrumentos operacionais de gestão, controlo e mitigação de aspectos e impactes ambientais ao longo do ciclo do projecto.',
    fullDescription:
      'Concebemos Planos de Gestão Ambiental (PGA) ajustados à realidade operacional de cada empreendimento, definindo responsabilidades, procedimentos de controlo, indicadores e rotinas de acompanhamento.',
    objectives: [
      'Elaboração de Planos de Gestão Ambiental para fases de construção e operação.',
      'Estruturação de programas específicos de mitigação e controlo ambiental.',
      'Identificação e gestão sistemática de aspectos e impactes ambientais.',
      'Acompanhamento técnico da implementação das medidas no terreno.',
    ],
    benefits: [
      'Alinhamento operacional das equipas com as metas ambientais.',
      'Prevenção de incidentes ambientais e redução de riscos financeiros.',
      'Integração directa com sistemas de gestão ISO 14001.',
    ],
    methodology: [
      'Mapeamento de processos, actividades e aspectos ambientais.',
      'Definição de programas, metas, responsáveis e cronogramas.',
      'Capacitação de equipas e implementação de registos operacionais.',
      'Revisão periódica de eficácia e melhoria contínua.',
    ],
    imageUrl: IMG_MANGROVE,
    iconName: 'Layers',
    order: 5,
    active: true,
  },
  {
    id: 'pgr',
    code: 'F',
    slug: 'planos-de-gestao-de-residuos',
    title: 'Planos de Gestão de Resíduos (PGR)',
    shortDescription:
      'Soluções completas de diagnóstico, classificação, acondicionamento, transporte e destino final adequado de resíduos.',
    fullDescription:
      'Desenvolvemos Planos de Gestão de Resíduos (PGR) para unidades industriais, comerciais, portuárias e de construção, cobrindo todo o ciclo de vida dos resíduos perigosos e não perigosos em conformidade legal.',
    objectives: [
      'Diagnóstico completo da produção e fluxos de resíduos.',
      'Classificação e caracterização detalhada segundo normas aplicáveis.',
      'Definição de procedimentos de segregação e acondicionamento seguro.',
      'Controlo de armazenamento temporário, transporte e destino final adequado.',
    ],
    benefits: [
      'Redução do volume de resíduos encaminhados para deposição final.',
      'Rastreabilidade documental de resíduos perigosos e não perigosos.',
      'Cumprimento das obrigações legais de gestão de resíduos em Angola.',
    ],
    methodology: [
      'Inventário e pesagem/estimativa por tipologia de resíduo.',
      'Desenho logístico de pontos de recolha e parques de armazenamento.',
      'Qualificação de operadores licenciados de recolha e tratamento.',
      'Implementação de manifestos de acompanhamento e indicadores.',
    ],
    imageUrl: IMG_WASTE,
    iconName: 'Recycle',
    order: 6,
    active: true,
  },
  {
    id: 'phst',
    code: 'G',
    slug: 'planos-de-higiene-saude-e-seguranca',
    title: 'Planos de Higiene, Saúde e Segurança no Trabalho (PHST)',
    shortDescription:
      'Avaliação de riscos ocupacionais, identificação de perigos, procedimentos preventivos e programas de formação.',
    fullDescription:
      'Elaboramos Planos de Higiene, Saúde e Segurança no Trabalho (PHST) integrados à gestão ambiental, protegendo colaboradores e contratados através da prevenção sistemática de acidentes e doenças profissionais.',
    objectives: [
      'Identificação exaustiva de perigos e avaliação quantitativa de riscos.',
      'Definição de medidas preventivas de engenharia, administrativas e EPI.',
      'Elaboração de procedimentos operacionais seguros e planos de emergência.',
      'Implementação de programas de sensibilização e formação técnica.',
    ],
    benefits: [
      'Redução significativa de incidentes e absentismo laboral.',
      'Ambiente de trabalho seguro, produtivo e auditável.',
      'Conformidade com a legislação laboral e normas internacionais de HST.',
    ],
    methodology: [
      'Inspecção dos postos de trabalho e levantamento de actividades críticas.',
      'Elaboração da matriz de perigos e avaliação de riscos.',
      'Redacção de procedimentos, sinalização e planos de resposta.',
      'Sessões formativas e auditorias periódicas de segurança.',
    ],
    imageUrl: '/assets/aistudio/_MGL0127_eb23bc5c.jpg',
    iconName: 'HardHat',
    order: 7,
    active: true,
  },
  {
    id: 'hospitalares',
    code: 'H',
    slug: 'gestao-de-residuos-hospitalares',
    title: 'Gestão de Resíduos Hospitalares e Biomédicos',
    shortDescription:
      'Planos especializados de segregação, acondicionamento, armazenamento e encaminhamento seguro de resíduos clínicos.',
    fullDescription:
      'Prestamos consultoria especializada para unidades hospitalares, clínicas e laboratórios na implementação de Planos de Gestão de Resíduos Hospitalares e Biomédicos, garantindo biossegurança e controlo rigoroso.',
    objectives: [
      'Elaboração de planos de gestão de resíduos hospitalares à medida da unidade.',
      'Classificação rigorosa dos resíduos infecciosos, perfurocortantes, químicos e comuns.',
      'Protocolos de segregação na fonte, acondicionamento e rotulagem.',
      'Controlo de armazenamento temporário, recolha interna e encaminhamento final.',
    ],
    benefits: [
      'Protecção efectiva de profissionais de saúde, utentes e comunidade.',
      'Prevenção de contaminação biológica e riscos sanitários.',
      'Alinhamento com normas sanitárias e ambientais vigentes.',
    ],
    methodology: [
      'Diagnóstico por serviço clínico e circuito interno de resíduos.',
      'Definição de recipientes normativos, rotas e horários de recolha.',
      'Dimensionamento técnico da casa de armazenamento temporário.',
      'Formação das equipas clínicas e de higienização.',
    ],
    imageUrl: '/assets/aistudio/_MGL1064_417d747f.jpg',
    iconName: 'Stethoscope',
    order: 8,
    active: true,
  },
  {
    id: 'monitorizacao',
    code: 'I',
    slug: 'monitorizacao-e-estudos-ambientais',
    title: 'Monitorização e Estudos Ambientais',
    shortDescription:
      'Campanhas de amostragem e avaliação técnica da qualidade do ar, ruído ambiental, águas e solos.',
    fullDescription:
      'Executamos campanhas especializadas de monitorização e estudos ambientais com equipamentos calibrados e protocolos técnicos rigorosos, assegurando dados fiáveis para controlo operacional e reporte legal.',
    objectives: [
      'Monitorização contínua e pontual da qualidade do ar e emissões atmosféricas.',
      'Medição e mapeamento de níveis de ruído ambiental.',
      'Avaliação da qualidade de águas superficiais, subterrâneas e solos.',
      'Realização de campanhas de amostragem e interpretação técnica de resultados.',
    ],
    benefits: [
      'Dados laboratoriais e de campo rastreáveis e defensáveis.',
      'Suporte técnico sólido para tomada de decisão correctiva.',
      'Comprovação objectiva de conformidade perante clientes e reguladores.',
    ],
    methodology: [
      'Definição de malha amostral e pontos georreferenciados.',
      'Medições em campo com instrumentos calibrados e cadeia de custódia.',
      'Análise comparativa face aos padrões nacionais e da OMS/IFC.',
      'Elaboração de relatórios interpretativos com recomendações.',
    ],
    imageUrl: IMG_FIELD,
    iconName: 'Compass',
    order: 9,
    active: true,
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Campanha de Monitorização Hídrica e Ambiental',
    category: 'Campanhas de monitorização',
    caption: 'Medição in situ de parâmetros físico-químicos da qualidade da água com sonda multiparâmetro junto à margem fluvial.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0362_311a9a2d.jpg',
    capturedAt: 'Registo Técnico de Campo',
  },
  {
    id: 'gal-2',
    title: 'Inspecção Acústica em Unidade Siderúrgica',
    category: 'Actividades industriais',
    caption: 'Medição de níveis de pressão sonora e verificação de conformidade ambiental em nave industrial metálica.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-09_at_14.03.02_55722da1.jpeg',
    capturedAt: 'Auditoria Industrial',
  },
  {
    id: 'gal-3',
    title: 'Avaliação Ambiental em Estaleiro e Pátio Logístico',
    category: 'Avaliações ambientais',
    caption: 'Equipa multidisciplinar em levantamento de ruído e controlo operacional em unidade industrial e logística.',
    location: 'Viana, Luanda',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-09_at_14.03.03__10__038ac7eb.jpeg',
    capturedAt: 'Vistoria Operacional',
  },
  {
    id: 'gal-4',
    title: 'Levantamento Hídrico em Margem Fluvial',
    category: 'Trabalhos de campo',
    caption: 'Técnicos da BIOSFERA em recolha de parâmetros de linha de base ambiental junto a ecossistema fluvial.',
    location: 'Bengo / Barra do Kwanza',
    imageUrl: '/assets/aistudio/_MGL0258_161e3e28.jpg',
    capturedAt: 'Estudo de Linha de Base',
  },
  {
    id: 'gal-5',
    title: 'Equipa Multidisciplinar em Campanha Nacional',
    category: 'Projectos concluídos',
    caption: 'Brigada técnica completa da BIOSFERA após encerramento de campanha integrada de monitorização ambiental.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0372_copy_b3ed7f8b.jpg',
    capturedAt: 'Operação de Campo',
  },
  {
    id: 'gal-6',
    title: 'Monitorização de Ruído Ambiental com Sonómetro em Tripé',
    category: 'Campanhas de monitorização',
    caption: 'Registo de níveis sonoros ambientais em ponto de controlo ribeirinho com equipamento calibrado.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0164_56bb6be1.jpg',
    capturedAt: 'Campanha Acústica',
  },
  {
    id: 'gal-7',
    title: 'Mapeamento Aéreo com Drone DJI Mavic 3 Pro',
    category: 'Trabalhos de campo',
    caption: 'Descolagem controlada de drone para levantamento ortofotométrico e avaliação espacial da área de influência.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0145_ae36d4cd.jpg',
    capturedAt: 'Teledetecção Ambiental',
  },
  {
    id: 'gal-8',
    title: 'Detecção Multigás e Controlo Aéreo Integrado',
    category: 'Campanhas de monitorização',
    caption: 'Equipa em operação conjunta com analisador portátil de gases e comando de aeronave não tripulada.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0127_eb23bc5c.jpg',
    capturedAt: 'Monitorização em Campo',
  },
  {
    id: 'gal-9',
    title: 'Telemetria Aérea sobre Corredor Fluvial',
    category: 'Campanhas de monitorização',
    caption: 'Acompanhamento em tempo real da rota de voo do drone para inspecção ambiental de margens.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0138_6aebdd73.jpg',
    capturedAt: 'Levantamento Aéreo',
  },
  {
    id: 'gal-10',
    title: 'Calibração de Estação de Qualidade do Ar (YF-IAQM-V1)',
    category: 'Visitas técnicas',
    caption: 'Verificação técnica e parametrização de estação microclimática para medição contínua de poluentes atmosféricos.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/23_1d4ec0d2.jpg',
    capturedAt: 'Monitorização Atmosférica',
  },
  {
    id: 'gal-11',
    title: 'Inspecção a Estação Portátil de Qualidade do Ar',
    category: 'Campanhas de monitorização',
    caption: 'Avaliação de partículas inaláveis (PM2.5/PM10) e gases em zona operacional junto ao perímetro costeiro.',
    location: 'Zona Costeira, Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-14_at_12.01.45_10e01d11.jpeg',
    capturedAt: 'Qualidade do Ar',
  },
  {
    id: 'gal-12',
    title: 'Monitorização de Emissões Atmosféricas em Terreno',
    category: 'Campanhas de monitorização',
    caption: 'Operação de campo da estação atmosférica YF-IAQM-V1 em campanha de verificação regulamentar.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-14_at_12.01.36__2__93e4a2b8.jpeg',
    capturedAt: 'Controlo de Emissões',
  },
  {
    id: 'gal-13',
    title: 'Recolha e Acondicionamento de Amostras de Solo',
    category: 'Recolha de amostras',
    caption: 'Especialistas com EPI completo a selar amostras geotécnicas e edáficas para envio laboratorial.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0327_58186c84.jpg',
    capturedAt: 'Amostragem de Solos',
  },
  {
    id: 'gal-14',
    title: 'Preparação e Ensaio de Amostra Hídrica em Campo',
    category: 'Recolha de amostras',
    caption: 'Manipulação segura com luvas de protecção e proveta graduada durante verificação preliminar de água.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL1064_417d747f.jpg',
    capturedAt: 'Controlo Analítico',
  },
  {
    id: 'gal-15',
    title: 'Análise Directa de Solo com Sonda Digital',
    category: 'Recolha de amostras',
    caption: 'Medição in situ de parâmetros de contaminação e condutividade em solo húmido.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-14_at_12.01.44__1__2da02d89.jpeg',
    capturedAt: 'Ensaio In Situ',
  },
  {
    id: 'gal-16',
    title: 'Instrumentação Portátil de Medição de pH',
    category: 'Recolha de amostras',
    caption: 'Medidor digital calibrado PH-280 preparado para determinação rigorosa de pH e temperatura em campo.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0211_d7913076.jpg',
    capturedAt: 'Equipamento Calibrado',
  },
  {
    id: 'gal-17',
    title: 'Medição de Gases com Detector Multigás Portátil',
    category: 'Campanhas de monitorização',
    caption: 'Verificação em tempo real da concentração de gases para segurança ocupacional e controlo ambiental.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0175_67dc6c06.jpg',
    capturedAt: 'Segurança e Ambiente',
  },
  {
    id: 'gal-18',
    title: 'Registo Acústico em Ficha de Campo',
    category: 'Campanhas de monitorização',
    caption: 'Leitura directa em decibelímetro digital e preenchimento de boletim de medição normalizado.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0168_042c7365.jpg',
    capturedAt: 'Monitorização de Ruído',
  },
  {
    id: 'gal-19',
    title: 'Estação Acústica Temporária em Ponto de Amostragem',
    category: 'Campanhas de monitorização',
    caption: 'Montagem de tripé acústico em ponto georreferenciado durante campanha com frota técnica de apoio.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0151_4b00def9.jpg',
    capturedAt: 'Rede Amostral',
  },
  {
    id: 'gal-20',
    title: 'Auditoria Ambiental em Complexo Fabril',
    category: 'Actividades industriais',
    caption: 'Consultores em vistoria presencial a áreas produtivas, circulação de equipamentos e gestão operacional.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/28_59ab70b0.jpg',
    capturedAt: 'Auditoria de Conformidade',
  },
  {
    id: 'gal-21',
    title: 'Inspecção de Parque Industrial e Armazenagem',
    category: 'Actividades industriais',
    caption: 'Avaliação das condições de acondicionamento exterior e segurança ambiental em corredor industrial.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/33_2787763e.jpg',
    capturedAt: 'Vistoria Fabril',
  },
  {
    id: 'gal-22',
    title: 'Avaliação Ambiental e HST em Nave Industrial',
    category: 'Actividades industriais',
    caption: 'Verificação de ruído ocupacional, ventilação e protecção colectiva junto a linha de produção.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-09_at_14.03.02__5__60011635.jpeg',
    capturedAt: 'Inspecção PHST',
  },
  {
    id: 'gal-23',
    title: 'Visita Técnica de Licenciamento Industrial',
    category: 'Visitas técnicas',
    caption: 'Deslocação de consultores pelo perímetro da unidade industrial para levantamento de aspectos ambientais.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-09_at_14.03.01__1__16da17bc.jpeg',
    capturedAt: 'Licenciamento Ambiental',
  },
  {
    id: 'gal-24',
    title: 'Monitorização Acústica em Área Extractiva',
    category: 'Avaliações ambientais',
    caption: 'Medição de níveis de ruído e avaliação de impactes sobre o meio biofísico em zona de pedreira.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2026-04-27_at_13.48.27__1__44b727a2.jpeg',
    capturedAt: 'Avaliação de Impacte',
  },
  {
    id: 'gal-25',
    title: 'Acompanhamento Ambiental de Frente de Obra',
    category: 'Avaliações ambientais',
    caption: 'Verificação de medidas mitigadoras de emissões de poeiras e movimentação de terras junto a maquinaria pesada.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2026-04-27_at_13.48.23__1__277acf9a.jpeg',
    capturedAt: 'Acompanhamento de PGA',
  },
  {
    id: 'gal-26',
    title: 'Vistoria de Terraplanagem e Infra-estruturas',
    category: 'Visitas técnicas',
    caption: 'Equipa da BIOSFERA em inspecção de conformidade ambiental em plataforma de obras civis.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2026-04-27_at_13.48.32__1__094d5e3f.jpg',
    capturedAt: 'Fiscalização Ambiental',
  },
  {
    id: 'gal-27',
    title: 'Levantamento Ambiental em Projecto Mineiro',
    category: 'Projectos concluídos',
    caption: 'Equipa em zona montanhosa após inspecção de condicionantes ambientais e recuperação de taludes.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2026-04-27_at_13.48.33_bc1c7174.jpeg',
    capturedAt: 'Relatório de Conformidade',
  },
  {
    id: 'gal-28',
    title: 'Integração Laboratorial e Cartografia GIS em Campo',
    category: 'Avaliações ambientais',
    caption: 'Consolidação de ensaios volumétricos com mapas de declive e elevação topográfica da área de estudo.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-14_at_12.01.43__3__a4e16423.jpeg',
    capturedAt: 'Análise Espacial',
  },
  {
    id: 'gal-29',
    title: 'Amostragem de Águas em Canal de Drenagem',
    category: 'Recolha de amostras',
    caption: 'Preparação de equipamento para recolha de amostras hídricas e avaliação de qualidade de efluentes.',
    location: 'Luanda, Angola',
    imageUrl: '/assets/aistudio/WhatsApp_Image_2025-04-14_at_12.01.40__1__67370665.jpeg',
    capturedAt: 'Controlo Hídrico',
  },
  {
    id: 'gal-30',
    title: 'Registo de Fauna Nativa em Levantamento Ecológico',
    category: 'Trabalhos de campo',
    caption: 'Documentação fotográfica de fauna silvestre nativa durante inventário de biodiversidade terrestre.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0392_6158335f.jpg',
    capturedAt: 'Biodiversidade',
  },
  {
    id: 'gal-31',
    title: 'Transecto Ecológico em Zona de Savana',
    category: 'Trabalhos de campo',
    caption: 'Incursão pedestre para caracterização florística e observação de habitats naturais.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL9957_f60af188.jpg',
    capturedAt: 'Caracterização Ecológica',
  },
  {
    id: 'gal-32',
    title: 'Reconhecimento de Zonas Húmidas e Margem Fluvial',
    category: 'Trabalhos de campo',
    caption: 'Progressão em terreno de vegetação ribeirinha com embarcações de apoio à campanha hídrica.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0290_3eb05d95.jpg',
    capturedAt: 'Estudo Ecológico',
  },
  {
    id: 'gal-33',
    title: 'Logística de Brigada em Corredor Fluvial',
    category: 'Trabalhos de campo',
    caption: 'Movimentação da equipa técnica entre pontos de embarque e viaturas de apoio de campo.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0157_cc28238c.jpg',
    capturedAt: 'Operação Ribeirinha',
  },
  {
    id: 'gal-34',
    title: 'Identificação Técnica no Terreno',
    category: 'Trabalhos de campo',
    caption: 'Consultores da BIOSFERA devidamente equipados a caminho de ponto de amostragem ambiental.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0187_6036e79f.jpg',
    capturedAt: 'Equipa de Campo',
  },
  {
    id: 'gal-35',
    title: 'Briefing Técnico e Segurança Pré-Campanha',
    category: 'Reuniões técnicas',
    caption: 'Alinhamento de objectivos amostrais, revisão de protocolos e verificação de segurança antes dos trabalhos.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL9893_762c4169.jpg',
    capturedAt: 'Briefing Operacional',
  },
  {
    id: 'gal-36',
    title: 'Coordenação Técnica na Sede da BIOSFERA',
    category: 'Reuniões técnicas',
    caption: 'Equipa multidisciplinar em escritório na Centralidade do Kilamba durante revisão de estudos ambientais.',
    location: 'Kilamba, Luanda',
    imageUrl: '/assets/aistudio/111_e7a0d7a9.jpg',
    capturedAt: 'Sede Corporativa',
  },
  {
    id: 'gal-37',
    title: 'Sessão de Revisão de Dossiês e Relatórios (EIA/RMA)',
    category: 'Reuniões técnicas',
    caption: 'Consolidação de dados de campo, controlo de qualidade e preparação de relatórios técnicos finais.',
    location: 'Kilamba, Luanda',
    imageUrl: '/assets/aistudio/2_dcbe59ee.jpg',
    capturedAt: 'Gabinete Técnico',
  },
  {
    id: 'gal-38',
    title: 'Verificação de Listas de Controlo Ambiental',
    category: 'Visitas técnicas',
    caption: 'Revisão conjunta de registos de conformidade e observações de campo pela equipa técnica.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL9905_2685c4ac.jpg',
    capturedAt: 'Controlo Técnico',
  },
  {
    id: 'gal-39',
    title: 'Inspecção de Cobertura Vegetal e Solo',
    category: 'Trabalhos de campo',
    caption: 'Avaliação visual directa da integridade do solo e regeneração vegetal em área monitorizada.',
    location: 'Angola',
    imageUrl: '/assets/aistudio/_MGL0295_6ccf55cd.jpg',
    capturedAt: 'Levantamento Edáfico',
  },
];

export const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: 'decreto-117-20-eia',
    title: 'Enquadramento Legal da Avaliação de Impacte Ambiental em Angola (Decreto Presidencial n.º 117/20)',
    slug: 'enquadramento-legal-eia-angola',
    category: 'Legislação e actualizações ambientais',
    summary:
      'Síntese técnica sobre os procedimentos de Avaliação de Impacte Ambiental e Licenciamento Ambiental aplicáveis a empreendimentos públicos e privados em Angola.',
    content:
      'A conformidade ambiental em Angola assenta no cumprimento rigoroso do Decreto Presidencial n.º 117/20, de 22 de Abril, que estabelece o Regulamento Geral de Avaliação de Impacte Ambiental e do Procedimento de Licenciamento Ambiental.\n\nPara promotores dos sectores de petróleo e gás, indústria transformadora, energia, portos e construção civil, a correcta categorização prévia do projecto é determinante para evitar atrasos na emissão da Licença Ambiental de Instalação e Operação.\n\nA BIOSFERA – Consultoria Ambiental, Lda. assegura o enquadramento regulatório completo desde a fase de concepção, incluindo a preparação dos Termos de Referência, caracterização da situação ambiental de referência, consulta pública e estruturação do Plano de Gestão Ambiental (PGA).',
    imageUrl: '/assets/aistudio/_MGL9893_762c4169.jpg',
    publishedDate: '2026-10-15',
    published: true,
  },
  {
    id: 'gestao-integrada-residuos-industriais',
    title: 'Boas Práticas na Elaboração de Planos de Gestão de Resíduos Industriais e Hospitalares',
    slug: 'boas-praticas-gestao-residuos-angola',
    category: 'Artigos técnicos',
    summary:
      'Como estruturar a segregação na origem, o armazenamento temporário e a rastreabilidade de resíduos perigosos e biomédicos com segurança e eficiência.',
    content:
      'Um Plano de Gestão de Resíduos (PGR) eficaz ultrapassa o cumprimento formal: reduz passivos ambientais, optimiza custos logísticos e protege a saúde ocupacional.\n\nNa prática técnica da BIOSFERA, a implementação começa com um diagnóstico quantitativo e qualitativo por unidade produtiva ou clínica, separando claramente fluxos perigosos, infecciosos/biomédicos e não perigosos.\n\nA adopção de sinalética normalizada, parques de armazenamento impermeabilizados com bacias de retenção e manifestos de transporte para operadores licenciados constitui a base para auditorias ambientais sem não conformidades.',
    imageUrl: IMG_WASTE,
    publishedDate: '2026-09-28',
    published: true,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    authorName: 'Eng. Mateus Domingos',
    organization: 'Operações Industriais — Polo de Viana',
    role: 'Director de Operações',
    rating: 5,
    comment:
      'O acompanhamento da BIOSFERA no nosso processo de Licenciamento Ambiental e na elaboração do Plano de Gestão de Resíduos foi determinante. Toda a documentação técnica cumpriu os prazos e exigências do Decreto Presidencial n.º 117/20 sem devoluções.',
    published: true,
    createdAt: { seconds: 1793616000 },
  },
  {
    id: 'test-2',
    authorName: 'Dra. Carla Nogueira',
    organization: 'Infra-estruturas Logísticas de Luanda',
    role: 'Coordenadora de QSMS',
    rating: 5,
    comment:
      'Destacamos o rigor técnico nas campanhas de monitorização da qualidade da água e do ruído ambiental, bem como a clareza dos Relatórios de Monitorização Ambiental entregues trimestralmente pela equipa de campo.',
    published: true,
    createdAt: { seconds: 1792492800 },
  },
  {
    id: 'test-3',
    authorName: 'Arq. Paulo Tavares',
    organization: 'Empreendimentos & Engenharia Civil',
    role: 'Gestor de Projecto',
    rating: 5,
    comment:
      'Excelente capacidade de resposta na elaboração do Estudo de Impacte Ambiental (EIA) e do Plano de Higiene, Saúde e Segurança no Trabalho para o nosso estaleiro. Uma equipa multidisciplinar próxima e objectiva.',
    published: true,
    createdAt: { seconds: 1791024000 },
  },
  {
    id: 'test-4',
    authorName: 'Dra. Helena Kiala',
    organization: 'Unidade de Saúde Privada — Belas',
    role: 'Responsável de Biossegurança',
    rating: 4,
    comment:
      'A implementação do Plano de Gestão de Resíduos Hospitalares e Biomédicos trouxe maior organização na segregação interna e segurança para as equipas clínicas, com formação prática muito bem estruturada.',
    published: true,
    createdAt: { seconds: 1789641600 },
  },
];

