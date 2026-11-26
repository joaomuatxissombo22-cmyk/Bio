import type {
  GalleryItem,
  NewsArticle,
  ServiceItem,
  SiteSettings,
  TestimonialItem,
} from '../types';
import type { SiteLanguage } from '../context/LanguageContext';

export const NAV_LABELS: { to: string; pt: string; en: string; zh: string }[] = [
  { to: '/', pt: 'Início', en: 'Home', zh: '首頁' },
  { to: '/quem-somos', pt: 'Quem Somos', en: 'About Us', zh: '關於我們' },
  { to: '/servicos', pt: 'Serviços', en: 'Services', zh: '專業服務' },
  { to: '/projectos', pt: 'Projectos', en: 'Projects', zh: '專案實績' },
  { to: '/galeria', pt: 'Galeria', en: 'Gallery', zh: '攝影圖庫' },
  { to: '/sustentabilidade', pt: 'Sustentabilidade', en: 'Sustainability', zh: '永續發展' },
  { to: '/noticias', pt: 'Notícias', en: 'News', zh: '即時新聞' },
  { to: '/contactos', pt: 'Contactos', en: 'Contact', zh: '聯絡我們' },
];

export const HERO_DYNAMIC_SLIDES = [
  {
    ptTitle: null as string | null,
    enTitle: null as string | null,
    zhTitle: null as string | null,
    ptFocus: 'Estudos de Impacte e Licenciamento Ambiental em Angola',
    enFocus: 'Environmental Impact Assessments & Permitting in Angola',
    zhFocus: '安哥拉環境影響評估與環境許可專業顧問',
  },
  {
    ptTitle: 'LICENCIAMENTO, AUDITORIAS E GESTÃO AMBIENTAL INTEGRADA',
    enTitle: 'ENVIRONMENTAL PERMITTING, AUDITS & INTEGRATED MANAGEMENT',
    zhTitle: '環境許可審查、環境稽核與整合式環境管理',
    ptFocus: 'Conformidade legal e acompanhamento técnico de empreendimentos',
    enFocus: 'Regulatory compliance and end-to-end technical project supervision',
    zhFocus: '法規合規把關與專案全週期技術監督',
  },
  {
    ptTitle: 'MONITORIZAÇÃO AMBIENTAL E GESTÃO DE RESÍDUOS',
    enTitle: 'ENVIRONMENTAL MONITORING & WASTE MANAGEMENT',
    zhTitle: '專業環境監測與工業暨醫療廢棄物管理',
    ptFocus: 'Controlo de água, ar, solos, ruído e segurança ocupacional',
    enFocus: 'Water, air, soil, noise monitoring and occupational safety control',
    zhFocus: '水質、空氣、土壤、噪音監測與職業安全控管',
  },
  {
    ptTitle: 'RIGOR TÉCNICO PARA UM FUTURO SUSTENTÁVEL',
    enTitle: 'TECHNICAL RIGOR FOR A SUSTAINABLE FUTURE',
    zhTitle: '以嚴謹專業技術構築永續發展未來',
    ptFocus: 'Equilíbrio entre crescimento económico e preservação ecológica',
    enFocus: 'Balancing economic growth with ecological preservation',
    zhFocus: '兼顧經濟成長與生態環境永續保存',
  },
  {
    ptTitle: 'OPERAÇÕES DE CAMPO E PROTECÇÃO DA BIODIVERSIDADE',
    enTitle: 'FIELD OPERATIONS & BIODIVERSITY PROTECTION',
    zhTitle: '現地環境勘查與生物多樣性保護行動',
    ptFocus: 'Inspecções in-situ, ecossistemas hídricos e apoio em todas as províncias',
    enFocus: 'In-situ inspections, river ecosystems, and nationwide province coverage',
    zhFocus: '現場監測取樣、水域生態評估與全國各省技術支援',
  },
];

const SETTINGS_PT_TO_EN: Record<string, string> = {
  'CONSULTORIA AMBIENTAL E SOLUÇÕES SUSTENTÁVEIS':
    'ENVIRONMENTAL CONSULTANCY & SUSTAINABLE SOLUTIONS',
  'Transformamos desafios ambientais em soluções sustentáveis, promovendo o equilíbrio entre o desenvolvimento económico, a responsabilidade ambiental e a preservação dos recursos naturais.':
    'We turn environmental challenges into sustainable solutions, promoting balance between economic development, environmental responsibility, and the preservation of natural resources.',
  'Compromisso com o Ambiente. Responsabilidade com o Futuro.':
    'Commitment to the Environment. Responsibility for the Future.',
  'A BIOSFERA – Consultoria Ambiental, Lda. é uma empresa angolana com mais de 10 anos de experiência, dedicada à prestação de serviços especializados em gestão ambiental, licenciamento, estudos de impacte ambiental, auditorias e acompanhamento técnico de projectos em todo o território nacional.':
    'BIOSFERA – Consultoria Ambiental, Lda. is an Angolan consultancy with over 10 years of experience delivering specialized environmental management, permitting, environmental impact assessments, audits, and technical project oversight across Angola.',
  'Prestar serviços especializados de consultoria ambiental, desenvolvendo soluções técnicas que promovam a protecção do ambiente, a utilização responsável dos recursos naturais e o cumprimento das obrigações ambientais.':
    'To deliver specialized environmental consultancy services, developing technical solutions that protect the environment, promote responsible resource use, and ensure full regulatory compliance.',
  'Ser uma referência nacional em consultoria ambiental, reconhecida pela excelência técnica, inovação, responsabilidade e compromisso com o desenvolvimento sustentável.':
    'To be a national benchmark in environmental consultancy, recognized for technical excellence, innovation, accountability, and commitment to sustainable development.',
};

const SETTINGS_PT_TO_ZH: Record<string, string> = {
  'CONSULTORIA AMBIENTAL E SOLUÇÕES SUSTENTÁVEIS': '環境顧問服務與永續發展解決方案',
  'Transformamos desafios ambientais em soluções sustentáveis, promovendo o equilíbrio entre o desenvolvimento económico, a responsabilidade ambiental e a preservação dos recursos naturais.':
    '我們將環境挑戰轉化為切實可行的永續解決方案，積極促進經濟發展、環境責任與自然資源保護之間的長遠平衡。',
  'Compromisso com o Ambiente. Responsabilidade com o Futuro.': '守護環境的承諾・對未來的責任',
  'A BIOSFERA – Consultoria Ambiental, Lda. é uma empresa angolana com mais de 10 anos de experiência, dedicada à prestação de serviços especializados em gestão ambiental, licenciamento, estudos de impacte ambiental, auditorias e acompanhamento técnico de projectos em todo o território nacional.':
    'BIOSFERA 環境顧問有限公司為深耕安哥拉逾十年的專業本土企業，致力於全國各地提供環境管理、環境許可申請、環境影響評估、環境稽核及專案技術追蹤等專業顧問服務。',
  'Prestar serviços especializados de consultoria ambiental, desenvolvendo soluções técnicas que promovam a protecção do ambiente, a utilização responsável dos recursos naturais e o cumprimento das obrigações ambientais.':
    '提供專業且高品質的環境顧問服務，制定兼顧環境保護、自然資源永續利用與法規全面合規的技術方案。',
  'Ser uma referência nacional em consultoria ambiental, reconhecida pela excelência técnica, inovação, responsabilidade e compromisso com o desenvolvimento sustentável.':
    '成為安哥拉國家級環境顧問標竿企業，以卓越技術、專業創新、誠信擔當與永續承諾獲得業界信賴。',
};

export function localizeSettings(settings: SiteSettings, lang: SiteLanguage): SiteSettings {
  if (lang === 'pt') return settings;
  const dict = lang === 'zh' ? SETTINGS_PT_TO_ZH : SETTINGS_PT_TO_EN;
  return {
    ...settings,
    heroTitle: dict[settings.heroTitle] || settings.heroTitle,
    heroSubtitle: dict[settings.heroSubtitle] || settings.heroSubtitle,
    institutionalTitle: dict[settings.institutionalTitle] || settings.institutionalTitle,
    institutionalDescription:
      dict[settings.institutionalDescription] || settings.institutionalDescription,
    missionText: dict[settings.missionText] || settings.missionText,
    visionText: dict[settings.visionText] || settings.visionText,
  };
}

type ServiceTranslation = Pick<
  ServiceItem,
  'title' | 'shortDescription' | 'fullDescription' | 'objectives' | 'benefits' | 'methodology'
>;

const SERVICES_EN: Record<string, ServiceTranslation> = {
  eia: {
    title: 'Environmental Impact Assessments (EIA)',
    shortDescription:
      'Rigorous evaluation of biophysical and socioeconomic impacts with tailored mitigation measures and monitoring programs.',
    fullDescription:
      'We prepare Environmental Impact Assessments (EIA) and Environmental and Social Impact Assessments in strict compliance with Angolan environmental law, supporting public and private developers from design through environmental clearance.',
    objectives: [
      'Detailed characterization of baseline environmental and socioeconomic conditions.',
      'Quantitative and qualitative identification, prediction, and evaluation of impacts.',
      'Design of mitigation, compensation, and environmental enhancement measures.',
      'Structuring of Environmental Monitoring and Follow-up Programs.',
    ],
    benefits: [
      'Reduction of regulatory risks and administrative delays.',
      'Early integration of environmentally efficient engineering solutions.',
      'Full compliance with Presidential Decree No. 117/20.',
    ],
    methodology: [
      'Scoping and definition of Terms of Reference.',
      'Multidisciplinary field surveys and primary data collection.',
      'Impact evaluation matrices and technical modeling.',
      'Preparation of the EIA Report and Non-Technical Summary.',
    ],
  },
  licenciamento: {
    title: 'Environmental Permitting & Licensing',
    shortDescription:
      'End-to-end technical advisory in preparing, submitting, and regularizing environmental license dossiers with authorities.',
    fullDescription:
      'We provide complete technical advisory across every stage of environmental permitting in Angola, ensuring rigorous dossier preparation and continuous follow-up with environmental authorities.',
    objectives: [
      'Strategic advisory for Installation and Operation Environmental Licenses.',
      'Preparation, technical review, and structuring of permitting dossiers.',
      'Ongoing technical liaison with competent government agencies.',
      'Support for environmental regularization of existing facilities.',
    ],
    benefits: [
      'Speed and technical accuracy in procedural submissions.',
      'Fewer supplemental requests or dossier rejections.',
      'Legal certainty for project startup and ongoing operations.',
    ],
    methodology: [
      'Legal classification of the activity or undertaking.',
      'Technical audit of facilities and operating conditions.',
      'Dossier compilation and formal regulatory submission.',
      'Inspection support and license condition tracking.',
    ],
  },
  auditorias: {
    title: 'Environmental Audits',
    shortDescription:
      'Compliance and environmental performance audits to identify non-conformities and build structured corrective plans.',
    fullDescription:
      'We conduct independent, systematic environmental audits to verify legal compliance, evaluate operational environmental performance, and establish results-oriented corrective action plans.',
    objectives: [
      'Execution of regulatory compliance and normative audits.',
      'Objective assessment of facility and operational environmental performance.',
      'Identification, classification, and documentation of non-conformities.',
      'Preparation of technical recommendations and corrective action plans.',
    ],
    benefits: [
      'Clear visibility over operational environmental liabilities and risks.',
      'Strong readiness for regulatory inspections and ISO 14001 audits.',
      'Process optimization reducing waste and operational costs.',
    ],
    methodology: [
      'Prior document review and audit protocol definition.',
      'On-site technical inspection, interviews, and evidence verification.',
      'Classification of findings and root-cause analysis.',
      'Delivery of the Audit Report and Corrective Action Plan.',
    ],
  },
  rma: {
    title: 'Environmental Monitoring Reports (EMR)',
    shortDescription:
      'Periodic tracking of environmental parameters and license conditions through structured technical reporting.',
    fullDescription:
      'We prepare periodic Environmental Monitoring Reports (EMR / RMA) demonstrating compliance with mitigation measures and permit conditions, consolidating field analytical data with scientific rigor.',
    objectives: [
      'Systematic monitoring of physical, chemical, and biological parameters.',
      'Ongoing assessment of mitigation measure effectiveness.',
      'Preparation of periodic technical reports for regulatory authorities.',
      'Strict tracking of environmental license conditions.',
    ],
    benefits: [
      'Transparent and uninterrupted validity of environmental licenses.',
      'Early detection of environmental parameter deviations.',
      'Reliable technical history supporting management decisions.',
    ],
    methodology: [
      'Campaign scheduling aligned with permit conditions and legal cycles.',
      'In-situ measurements and certified sampling.',
      'Statistical processing and benchmarking against regulatory thresholds.',
      'Submission and technical presentation of the report.',
    ],
  },
  pga: {
    title: 'Environmental Management Plans (EMP)',
    shortDescription:
      'Operational management instruments to control and mitigate environmental aspects and impacts across the project lifecycle.',
    fullDescription:
      'We design Environmental Management Plans (EMP / PGA) tailored to each project’s operational reality, defining responsibilities, control procedures, indicators, and monitoring routines.',
    objectives: [
      'Preparation of Environmental Management Plans for construction and operation.',
      'Structuring of specific mitigation and environmental control programs.',
      'Systematic identification and management of environmental aspects.',
      'Technical supervision of field measure implementation.',
    ],
    benefits: [
      'Operational alignment of teams with environmental targets.',
      'Incident prevention and financial risk reduction.',
      'Direct compatibility with ISO 14001 management systems.',
    ],
    methodology: [
      'Mapping of processes, activities, and environmental aspects.',
      'Definition of programs, targets, owners, and schedules.',
      'Team training and operational record implementation.',
      'Periodic effectiveness reviews and continuous improvement.',
    ],
  },
  pgr: {
    title: 'Waste Management Plans (WMP)',
    shortDescription:
      'Complete diagnostics, classification, packaging, transport, and compliant final disposal solutions for waste streams.',
    fullDescription:
      'We develop Waste Management Plans (WMP / PGR) for industrial, commercial, port, and construction facilities covering the full lifecycle of hazardous and non-hazardous waste under national law.',
    objectives: [
      'Comprehensive diagnostics of waste generation and streams.',
      'Detailed classification and characterization per applicable standards.',
      'Definition of segregation and safe containment procedures.',
      'Control of temporary storage, transport, and licensed final disposal.',
    ],
    benefits: [
      'Reduction of waste volumes sent to final disposal.',
      'Full documentary traceability of hazardous and non-hazardous waste.',
      'Compliance with Angolan waste management regulations.',
    ],
    methodology: [
      'Waste stream inventory and weighing/estimation by category.',
      'Logistical design of collection points and storage bays.',
      'Qualification of licensed collection and treatment operators.',
      'Implementation of tracking manifests and performance indicators.',
    ],
  },
  phst: {
    title: 'Occupational Health, Safety & Hygiene Plans (OHSP)',
    shortDescription:
      'Occupational risk assessment, hazard identification, preventive procedures, and workplace safety training programs.',
    fullDescription:
      'We prepare Occupational Health, Safety and Hygiene Plans (OHSP / PHST) integrated with environmental management, safeguarding employees and contractors through systematic accident prevention.',
    objectives: [
      'Exhaustive hazard identification and quantitative risk assessment.',
      'Definition of engineering, administrative, and PPE controls.',
      'Preparation of safe operating procedures and emergency response plans.',
      'Implementation of technical safety awareness and training programs.',
    ],
    benefits: [
      'Significant reduction in workplace incidents and absenteeism.',
      'Safer, more productive, and audit-ready work environments.',
      'Compliance with labor legislation and international OHS standards.',
    ],
    methodology: [
      'Workplace inspection and survey of critical activities.',
      'Hazard matrix development and risk scoring.',
      'Drafting of procedures, signage standards, and emergency drills.',
      'Training sessions and periodic safety audits.',
    ],
  },
  hospitalares: {
    title: 'Hospital & Biomedical Waste Management',
    shortDescription:
      'Specialized segregation, containment, storage, and safe disposal plans for clinical and biomedical waste.',
    fullDescription:
      'We provide specialized consultancy for hospitals, clinics, and laboratories implementing Biomedical Waste Management Plans, ensuring biosafety and strict regulatory control.',
    objectives: [
      'Custom hospital waste management plans tailored to each facility.',
      'Strict classification of infectious, sharps, chemical, and general waste.',
      'Source segregation, containment, and color-coded labeling protocols.',
      'Control of temporary storage, internal collection, and final treatment.',
    ],
    benefits: [
      'Effective protection for healthcare staff, patients, and communities.',
      'Prevention of biological contamination and public health hazards.',
      'Alignment with prevailing health and environmental regulations.',
    ],
    methodology: [
      'Clinical unit diagnostics and internal waste routing mapping.',
      'Specification of compliant containers, routes, and collection schedules.',
      'Technical sizing of temporary biomedical waste storage rooms.',
      'Training for clinical and housekeeping personnel.',
    ],
  },
  monitorizacao: {
    title: 'Environmental Monitoring & Field Studies',
    shortDescription:
      'Sampling campaigns and technical assessments of air quality, environmental noise, surface/groundwater, and soils.',
    fullDescription:
      'We execute specialized environmental monitoring campaigns and field studies using calibrated instruments and strict chain-of-custody protocols to deliver defensible compliance data.',
    objectives: [
      'Continuous and spot monitoring of ambient air quality and emissions.',
      'Measurement and mapping of environmental and occupational noise.',
      'Assessment of surface water, groundwater, and soil quality.',
      'Sampling campaigns and technical interpretation of lab results.',
    ],
    benefits: [
      'Traceable and defensible field and laboratory analytical data.',
      'Solid technical evidence for corrective decision-making.',
      'Objective proof of compliance for clients and regulators.',
    ],
    methodology: [
      'Design of sampling grids and georeferenced monitoring points.',
      'Field measurements with calibrated sensors and chain of custody.',
      'Comparative benchmarking against Angolan and WHO/IFC standards.',
      'Preparation of interpretive reports with technical recommendations.',
    ],
  },
};

const SERVICES_ZH: Record<string, ServiceTranslation> = {
  eia: {
    title: '環境影響評估 (EIA)',
    shortDescription:
      '全面評估自然生態與社會經濟影響，制定客製化減緩對策與環境監測追蹤計畫。',
    fullDescription:
      '嚴格遵循安哥拉環境法規編製環境影響評估 (EIA) 及環境與社會影響評估 (ESIA)，從專案設計階段全程協助公私部門取得環境許可。',
    objectives: [
      '詳細調查專案所在地環境基線與社會經濟現況。',
      '定性與定量辨識、預測及評估潛在環境衝擊。',
      '規劃切實可行的減緩、生態補償與環境優化措施。',
      '建構完整的環境監測與長期追蹤管理計畫。',
    ],
    benefits: [
      '大幅降低主管機關退件與行政審查延誤風險。',
      '於工程規劃初期即導入兼顧成本與環保的技術方案。',
      '全面符合安哥拉第 117/20 號總統令法規要求。',
    ],
    methodology: [
      '範疇界定與工作參考條款 (ToR) 制定。',
      '跨領域現場勘查與第一手採樣數據蒐集。',
      '影響評估矩陣分析與環境模擬建模。',
      '編製完整 EIA 報告與非技術性摘要供公眾諮詢。',
    ],
  },
  licenciamento: {
    title: '環境許可與證照輔導',
    shortDescription:
      '從文件編製、正式送件到既設場址合規補辦，提供全方位環境許可技術顧問服務。',
    fullDescription:
      '涵蓋安哥拉環境許可審查全流程，協助企業精準準備法定申報卷宗並與環境主管機關持續對接溝通，確保順利核發證照。',
    objectives: [
      '設置環境許可與營運環境許可全程策略諮詢。',
      '編製、技術複核與建構完整環境許可申報卷宗。',
      '擔任企業與環境主管機關間的持續技術協調窗口。',
      '輔導既設營運場址辦理環境法規補正與合法化。',
    ],
    benefits: [
      '提升行政送件效率與技術文件精準度。',
      '大幅減少補件往返或遭主管機關駁回之機率。',
      '為專案動工建設與長期營運提供穩固法律保障。',
    ],
    methodology: [
      '依事業性質與規模進行法定環境分類界定。',
      '現場設施查核與實際營運條件盤點。',
      '完整文件彙整並向主管機關正式遞件申請。',
      '協助官方現場勘驗與許可附帶條件追蹤落實。',
    ],
  },
  auditorias: {
    title: '環境稽核 (Environmental Audits)',
    shortDescription:
      '執行法規合規與環境績效稽核，精準找出缺失項目並制定具體改善行動計畫。',
    fullDescription:
      '以獨立、系統化稽核方法檢視企業法規遵循狀況與營運環境表現，識別潛在環境負債並提出具體可執行的矯正方案。',
    objectives: [
      '執行環境法規合規稽核與管理標準符合性查核。',
      '客觀評估生產設施與日常營運之環境績效。',
      '識別、分級並記錄各項環境不符合項目。',
      '研擬技術改善建議與時程化矯正行動計畫。',
    ],
    benefits: [
      '清楚掌握營運端之環境風險與潛在環境負債。',
      '全面提升應對政府環保稽查與 ISO 14001 驗證準備度。',
      '優化製程與資源配置，同步降低浪費與營運成本。',
    ],
    methodology: [
      '事前文件審閱與客製化稽核檢核表設計。',
      '現場實地查驗、人員訪談與佐證紀錄查核。',
      '缺失項目風險分級與根本原因剖析。',
      '交付正式環境稽核報告與矯正行動追蹤表。',
    ],
  },
  rma: {
    title: '環境監測報告 (RMA)',
    shortDescription:
      '定期追蹤環境指標與許可附帶條件執行進度，出具具備公信力的技術監測報告。',
    fullDescription:
      '依主管機關許可要求定期編製環境監測報告 (RMA)，以實測數據驗證減緩措施成效，確保企業環境證照持續有效。',
    objectives: [
      '系統化追蹤水質、空氣、噪音與土壤等物化生指標。',
      '持續檢驗現場減緩與污染防制措施之實際成效。',
      '定期編製符合法定格式之技術報告提報主管機關。',
      '嚴謹追蹤並落實環境許可函各項附帶條件。',
    ],
    benefits: [
      '確保環境許可證持續有效且合規運作不中斷。',
      '及早偵測環境監測數值異常，即時預警改善。',
      '累積具可信度之長期環境數據支持管理決策。',
    ],
    methodology: [
      '依據許可週期與法規時程規劃年度採樣時程。',
      '派遣專業人員執行現場量測與標準採樣送驗。',
      '統計分析實測數據並比對安哥拉及國際限值。',
      '完成報告提報並提供技術說明支援。',
    ],
  },
  pga: {
    title: '環境管理計畫 (PGA)',
    shortDescription:
      '制定涵蓋施工與營運階段的操作型環境管理工具，有效控管各項環境考量面。',
    fullDescription:
      '依據專案實際作業流程量身打造環境管理計畫 (PGA)，明確規範責任分工、管制程序、績效指標與日常巡檢制度。',
    objectives: [
      '編製適用於施工期與營運期的環境管理計畫。',
      '建構專屬污染防治與環境管控執行方案。',
      '系統性辨識並管理作業流程中的環境考量面。',
      '提供現場環境管理措施落實之技術督導。',
    ],
    benefits: [
      '凝聚現場與管理團隊對環境保護目標的共識。',
      '有效預防環境污染事件並降低罰則與財務風險。',
      '架構完全相容於 ISO 14001 環境管理系統。',
    ],
    methodology: [
      '盤點作業流程、現場活動與關鍵環境影響因子。',
      '訂定管理方案、量化目標、權責人員與時程。',
      '辦理團隊教育訓練並導入現場執行表單紀錄。',
      '定期審查執行成效並推動持續改善循環。',
    ],
  },
  pgr: {
    title: '廢棄物管理計畫 (PGR)',
    shortDescription:
      '提供廢棄物現況診斷、分類、妥善包裝、清運與合法最終處置之完整合規方案。',
    fullDescription:
      '針對工業、商業、港口與營建場址編製廢棄物管理計畫 (PGR)，嚴格遵循安哥拉法規管控有害與一般廢棄物全生命週期流向。',
    objectives: [
      '全面盤點各作業單元廢棄物產出源與組成成分。',
      '依國家法規與 ANR 標準進行精確分類與特性鑑定。',
      '制定源頭分類、安全容器盛裝與明確標示規範。',
      '控管廠內暫存區、合格清運與最終妥善處置去向。',
    ],
    benefits: [
      '有效減少送往最終掩埋處置之廢棄物總量。',
      '建立有害與一般廢棄物完整聯單可追溯紀錄。',
      '全面符合安哥拉國家廢棄物管理法規要求。',
    ],
    methodology: [
      '各部門廢棄物產出盤點、秤重統計與類別建檔。',
      '規劃收集動線與具防滲漏設計之分類暫存設施。',
      '審查並媒合具備合法執照之清運與處理業者。',
      '導入遞送追蹤聯單與減量回收績效指標。',
    ],
  },
  phst: {
    title: '職業衛生、健康與安全計畫 (PHST)',
    shortDescription:
      '評估職場危害與風險，建置安全作業規範、緊急應變流程與員工安全培訓計畫。',
    fullDescription:
      '將職業健康安全計畫 (PHST) 與環境管理體系整合，透過系統化風險評估與預防機制守護員工及承攬商安全。',
    objectives: [
      '全面辨識作業危害並執行定量職場風險評估。',
      '制定工程控制、行政管理與個人防護具規範。',
      '編製標準安全作業程序與緊急應變撤離計畫。',
      '推動常態化職場安全意識宣導與實務培訓。',
    ],
    benefits: [
      '顯著降低工安意外發生率與員工缺勤風險。',
      '打造更安全、高效且隨時可通過稽核的工作環境。',
      '符合安哥拉勞動法規與國際職安衛管理標準。',
    ],
    methodology: [
      '工作場域巡檢與高風險關鍵作業盤點。',
      '建構危害風險矩陣並設定優先管控等級。',
      '制定作業規範、安全警示標誌與緊急演練方案。',
      '執行員工安全培訓並定期辦理職安衛稽核。',
    ],
  },
  hospitalares: {
    title: '醫療與生物醫療廢棄物管理',
    shortDescription:
      '專為醫院、診所與檢驗室打造感染性與生物醫療廢棄物分類、暫存與無害化方案。',
    fullDescription:
      '為各級醫院、診所及醫學檢驗實驗室建置生物醫療廢棄物管理計畫，全面落實院內生物安全防線與法規管控。',
    objectives: [
      '依各醫療院所規模量身編製醫療廢棄物管理計畫。',
      '嚴格區分感染性、尖銳物、化學藥劑與一般廢棄物。',
      '建立產出源即時分類、專用容器盛裝與色碼標示。',
      '管控院內安全清運路線、專屬暫存室與無害化處理。',
    ],
    benefits: [
      '切實保障醫護人員、病患與周邊社區公共衛生安全。',
      '防範生物性交叉污染與職業曝露傳染風險。',
      '符合現行醫療衛生與環保主管機關雙重法規規範。',
    ],
    methodology: [
      '臨床部門現場診斷與院內廢棄物動線測繪。',
      '規範符合標準之利器盒、生物危害袋與收集時程。',
      '醫療廢棄物專用暫存間尺寸與安全設備技術設計。',
      '辦理醫護團隊與清潔人員專項實務操作培訓。',
    ],
  },
  monitorizacao: {
    title: '環境監測與現場調查研究',
    shortDescription:
      '運用精密儀器執行空氣品質、環境噪音、地表水、地下水及土壤採樣與分析評估。',
    fullDescription:
      '採用經定期校正之專業監測設備與嚴謹樣品監管鏈 (Chain of Custody)，產出具備技術公信力與法規可採性之環境數據。',
    objectives: [
      '執行環境空氣品質與固定污染源排放即時或定期監測。',
      '量測並繪製廠界環境噪音與職場作業噪音分佈。',
      '評估地表水、地下水體及土壤污染現況品質。',
      '執行專業採樣作業並撰寫實驗室檢測結果技術判讀。',
    ],
    benefits: [
      '取得具完整追溯性之現場實測與認證實驗室數據。',
      '為工程改善或污染整治決策提供堅實科學依據。',
      '向客戶與政府機關提出客觀明確的合規證明文件。',
    ],
    methodology: [
      '設計地理定位採樣網格與代表性環境監測點位。',
      '現場精密儀器量測並落實嚴格樣品保存監管鏈。',
      '將檢測結果與安哥拉法規及 WHO/IFC 標準進行比對。',
      '編製完整技術判讀報告並提出具體改善建議。',
    ],
  },
};

export function localizeService(service: ServiceItem, lang: SiteLanguage): ServiceItem {
  if (lang === 'pt') return service;
  const match = lang === 'zh' ? SERVICES_ZH[service.id] : SERVICES_EN[service.id];
  if (!match) return service;
  return { ...service, ...match };
}

const SECTORS_EN: Record<string, { name: string; description: string }> = {
  'Petróleo e Gás': {
    name: 'Oil & Gas',
    description:
      'Offshore and onshore environmental compliance, emissions monitoring, and liability management.',
  },
  'Indústria e Transformação': {
    name: 'Industry & Manufacturing',
    description:
      'Industrial permitting, environmental performance audits, and effluent control.',
  },
  'Construção Civil': {
    name: 'Civil Construction',
    description:
      'Construction site environmental management plans, noise control, and construction waste handling.',
  },
  Energia: {
    name: 'Energy',
    description:
      'Environmental studies for substations, transmission lines, thermal and solar power plants.',
  },
  'Transportes e Logística': {
    name: 'Transport & Logistics',
    description:
      'Environmental assessment for logistics corridors, fleets, and cargo warehousing.',
  },
  'Portos e Terminais': {
    name: 'Ports & Terminals',
    description:
      'Coastal monitoring, dredging oversight, port waste management, and contingency plans.',
  },
  'Infra-estruturas': {
    name: 'Infrastructure',
    description:
      'Impact evaluation for roads, water supply, sanitation, and urban development projects.',
  },
  'Gestão de Resíduos': {
    name: 'Waste Management',
    description:
      'Waste characterization, segregation, operator licensing, and recovery solutions.',
  },
  'Agricultura e Desenvolvimento Rural': {
    name: 'Agriculture & Rural Development',
    description:
      'Sustainable soil and water management, biodiversity protection, and agro-environmental practices.',
  },
};

const SECTORS_ZH: Record<string, { name: string; description: string }> = {
  'Petróleo e Gás': {
    name: '石油與天然氣',
    description: '海域與陸上油氣開發環境合規輔導、氣體排放監測與環境負債管理。',
  },
  'Indústria e Transformação': {
    name: '工業與製造業',
    description: '工廠設置與營運環境許可、環境績效稽核及工業廢水排放控管。',
  },
  'Construção Civil': {
    name: '土木建築營造',
    description: '工地施工期環境管理計畫、噪音防制及營建剩餘物與廢棄物管理。',
  },
  Energia: {
    name: '能源與電力',
    description: '變電所、輸電線路、火力及太陽能發電廠環境影響評估研究。',
  },
  'Transportes e Logística': {
    name: '運輸與物流',
    description: '物流走廊、車隊營運場站與貨櫃倉儲基地環境風險評估與管控。',
  },
  'Portos e Terminais': {
    name: '港口與航運碼頭',
    description: '海岸線水質監測、疏浚工程監督、港區廢棄物及溢油應變計畫。',
  },
  'Infra-estruturas': {
    name: '公共基礎設施',
    description: '道路交通、自來水供水系統、衛生下水道及都市開發專案環評。',
  },
  'Gestão de Resíduos': {
    name: '廢棄物處理產業',
    description: '廢棄物特性分類、處理設施許可申辦及資源回收再利用規劃。',
  },
  'Agricultura e Desenvolvimento Rural': {
    name: '農業與農村發展',
    description: '土壤與水資源永續管理、生物多樣性保育及友善環境農業實踐。',
  },
};

export function localizeSector(
  sector: { name: string; description: string; iconName: string },
  lang: SiteLanguage
) {
  if (lang === 'pt') return sector;
  const map = lang === 'zh' ? SECTORS_ZH : SECTORS_EN;
  const localized = map[sector.name];
  return localized ? { ...sector, ...localized } : sector;
}

const CATEGORY_EN: Record<string, string> = {
  'Estudos ambientais': 'Environmental Studies',
  'Licenciamento ambiental': 'Environmental Permitting',
  'Auditorias ambientais': 'Environmental Audits',
  'Monitorização ambiental': 'Environmental Monitoring',
  'Indústria e energia': 'Industry & Energy',
  'Portos e terminais': 'Ports & Terminals',
  'Gestão de resíduos': 'Waste Management',
  'Projectos de sustentabilidade': 'Sustainability Projects',
  'Trabalhos de campo': 'Fieldwork',
  'Visitas técnicas': 'Technical Visits',
  'Campanhas de monitorização': 'Monitoring Campaigns',
  'Recolha de amostras': 'Sample Collection',
  'Avaliações ambientais': 'Environmental Assessments',
  'Actividades industriais': 'Industrial Activities',
  'Reuniões técnicas': 'Technical Meetings',
  'Projectos concluídos': 'Completed Projects',
  'Notícias institucionais': 'Institutional News',
  'Novos projectos': 'New Projects',
  'Actividades da empresa': 'Company Activities',
  'Artigos técnicos': 'Technical Articles',
  'Informações ambientais': 'Environmental Insights',
  'Legislação e actualizações ambientais': 'Environmental Legislation & Updates',
  'Eventos e formações': 'Events & Training',
};

const CATEGORY_ZH: Record<string, string> = {
  'Estudos ambientais': '環境影響研究',
  'Licenciamento ambiental': '環境許可輔導',
  'Auditorias ambientais': '環境稽核專案',
  'Monitorização ambiental': '環境監測作業',
  'Indústria e energia': '工業與能源領域',
  'Portos e terminais': '港口與碼頭領域',
  'Gestão de resíduos': '廢棄物管理',
  'Projectos de sustentabilidade': '永續發展專案',
  'Trabalhos de campo': '現場勘查作業',
  'Visitas técnicas': '技術現場參訪',
  'Campanhas de monitorização': '環境監測採樣',
  'Recolha de amostras': '樣品採集作業',
  'Avaliações ambientais': '環境現況評估',
  'Actividades industriais': '工業場域查核',
  'Reuniões técnicas': '技術研商會議',
  'Projectos concluídos': '已完工專案',
  'Notícias institucionais': '機構動態新聞',
  'Novos projectos': '最新承接專案',
  'Actividades da empresa': '公司業務活動',
  'Artigos técnicos': '專業技術文章',
  'Informações ambientais': '環境知識專欄',
  'Legislação e actualizações ambientais': '環境法規與政策更新',
  'Eventos e formações': '研討活動與培訓',
};

export function localizeCategory(cat: string, lang: SiteLanguage): string {
  if (lang === 'pt') return cat;
  const map = lang === 'zh' ? CATEGORY_ZH : CATEGORY_EN;
  return map[cat] || cat;
}

type LocalizedGalleryItem = Omit<GalleryItem, 'category'> & { category: string };
type LocalizedNewsArticle = Omit<NewsArticle, 'category'> & { category: string };

const GALLERY_EN: Record<string, Partial<LocalizedGalleryItem>> = {
  'gal-1': {
    title: 'Water & Environmental Monitoring Campaign',
    category: 'Monitoring Campaigns',
    caption: 'In situ measurement of physicochemical river water quality parameters using a multiparameter probe.',
    location: 'Angola',
    capturedAt: 'Technical Field Record',
  },
  'gal-2': {
    title: 'Acoustic Inspection at Steel Manufacturing Plant',
    category: 'Industrial Activities',
    caption: 'Sound pressure level measurement and environmental compliance verification inside a steel production hall.',
    location: 'Luanda, Angola',
    capturedAt: 'Industrial Audit',
  },
  'gal-3': {
    title: 'Environmental Assessment at Industrial & Logistics Yard',
    category: 'Environmental Assessments',
    caption: 'Multidisciplinary field team conducting noise monitoring and operational controls at a logistics yard.',
    location: 'Viana, Luanda',
    capturedAt: 'Operational Inspection',
  },
  'gal-4': {
    title: 'Riverbank Water Baseline Survey',
    category: 'Fieldwork',
    caption: 'BIOSFERA technicians collecting environmental baseline water parameters along a river shoreline.',
    location: 'Bengo / Barra do Kwanza',
    capturedAt: 'Baseline Study',
  },
  'gal-5': {
    title: 'Multidisciplinary Field Team in National Campaign',
    category: 'Completed Projects',
    caption: 'Full BIOSFERA technical brigade following completion of an integrated environmental monitoring campaign.',
    location: 'Angola',
    capturedAt: 'Field Operations',
  },
  'gal-6': {
    title: 'Tripod-Mounted Ambient Noise Monitoring',
    category: 'Monitoring Campaigns',
    caption: 'Recording ambient sound levels at a riverside control point using a calibrated sound level meter.',
    location: 'Angola',
    capturedAt: 'Acoustic Campaign',
  },
  'gal-7': {
    title: 'Aerial Environmental Mapping with DJI Mavic 3 Pro',
    category: 'Fieldwork',
    caption: 'Controlled drone launch for orthophoto mapping and spatial impact assessment of project corridors.',
    location: 'Angola',
    capturedAt: 'Remote Sensing',
  },
  'gal-8': {
    title: 'Integrated Multi-Gas Detection & Aerial Control',
    category: 'Monitoring Campaigns',
    caption: 'Field specialists operating a portable gas analyzer alongside unmanned aerial survey controls.',
    location: 'Angola',
    capturedAt: 'Field Monitoring',
  },
  'gal-9': {
    title: 'Aerial Telemetry Over River Corridor',
    category: 'Monitoring Campaigns',
    caption: 'Real-time flight path monitoring of aerial drone inspections along riverbanks and wetlands.',
    location: 'Angola',
    capturedAt: 'Aerial Survey',
  },
  'gal-10': {
    title: 'Air Quality Station Calibration (YF-IAQM-V1)',
    category: 'Technical Visits',
    caption: 'Technical verification and parameterization of a microclimatic station for continuous air pollutant tracking.',
    location: 'Luanda, Angola',
    capturedAt: 'Atmospheric Monitoring',
  },
  'gal-11': {
    title: 'Portable Air Quality Monitoring Station Inspection',
    category: 'Monitoring Campaigns',
    caption: 'Assessment of inhalable particulates (PM2.5/PM10) and gases in a coastal operational zone.',
    location: 'Coastal Zone, Angola',
    capturedAt: 'Air Quality',
  },
  'gal-12': {
    title: 'Field Atmospheric Emissions Monitoring',
    category: 'Monitoring Campaigns',
    caption: 'Deployment of the YF-IAQM-V1 atmospheric monitoring unit during a regulatory compliance campaign.',
    location: 'Luanda, Angola',
    capturedAt: 'Emissions Control',
  },
  'gal-13': {
    title: 'Soil Sample Collection & Chain-of-Custody Sealing',
    category: 'Sample Collection',
    caption: 'Specialists in full PPE sealing geotechnical and soil samples for accredited laboratory analysis.',
    location: 'Angola',
    capturedAt: 'Soil Sampling',
  },
  'gal-14': {
    title: 'Field Water Sample Preparation & Testing',
    category: 'Sample Collection',
    caption: 'Safe handling with protective gloves and graduated vessels during preliminary water checks.',
    location: 'Angola',
    capturedAt: 'Analytical Control',
  },
  'gal-15': {
    title: 'Direct Soil Analysis with Digital Probe',
    category: 'Sample Collection',
    caption: 'In situ measurement of soil conductivity and contamination indicators in wet ground profiles.',
    location: 'Angola',
    capturedAt: 'In Situ Testing',
  },
  'gal-16': {
    title: 'Portable pH & Water Temperature Instrumentation',
    category: 'Sample Collection',
    caption: 'Calibrated PH-280 digital meter prepared for precise field pH and temperature readings.',
    location: 'Angola',
    capturedAt: 'Calibrated Equipment',
  },
  'gal-17': {
    title: 'Gas Concentration Checks with Multi-Gas Detector',
    category: 'Monitoring Campaigns',
    caption: 'Real-time measurement of ambient gas levels for occupational safety and environmental compliance.',
    location: 'Angola',
    capturedAt: 'Safety & Environment',
  },
  'gal-18': {
    title: 'Acoustic Field Readings & Logbook Recording',
    category: 'Monitoring Campaigns',
    caption: 'Direct decibel meter readings recorded on standardized acoustic monitoring field sheets.',
    location: 'Angola',
    capturedAt: 'Noise Monitoring',
  },
  'gal-19': {
    title: 'Temporary Acoustic Station at Georeferenced Point',
    category: 'Monitoring Campaigns',
    caption: 'Setting up tripod-mounted acoustic instrumentation supported by BIOSFERA field vehicles.',
    location: 'Angola',
    capturedAt: 'Sampling Network',
  },
  'gal-20': {
    title: 'Environmental Audit Across Manufacturing Complex',
    category: 'Industrial Activities',
    caption: 'Consultants conducting on-site inspections of production zones, equipment traffic, and operations.',
    location: 'Luanda, Angola',
    capturedAt: 'Compliance Audit',
  },
  'gal-21': {
    title: 'Industrial Yard & Storage Area Inspection',
    category: 'Industrial Activities',
    caption: 'Assessment of outdoor storage practices and environmental safety along an industrial corridor.',
    location: 'Luanda, Angola',
    capturedAt: 'Plant Inspection',
  },
  'gal-22': {
    title: 'OHS & Environmental Evaluation Inside Industrial Bay',
    category: 'Industrial Activities',
    caption: 'Reviewing occupational noise, ventilation, and collective safeguards along metal production lines.',
    location: 'Luanda, Angola',
    capturedAt: 'OHSP Inspection',
  },
  'gal-23': {
    title: 'Industrial Environmental Permitting Site Visit',
    category: 'Technical Visits',
    caption: 'Consultants surveying an industrial facility perimeter to map environmental aspects and controls.',
    location: 'Luanda, Angola',
    capturedAt: 'Environmental Permitting',
  },
  'gal-24': {
    title: 'Acoustic Monitoring at Quarry & Extractive Site',
    category: 'Environmental Assessments',
    caption: 'Noise measurement and biophysical impact verification across a rock quarry operation.',
    location: 'Angola',
    capturedAt: 'Impact Assessment',
  },
  'gal-25': {
    title: 'Active Earthworks Environmental Supervision',
    category: 'Environmental Assessments',
    caption: 'Verifying dust suppression and earthmoving mitigation controls alongside heavy excavation machinery.',
    location: 'Angola',
    capturedAt: 'EMP Supervision',
  },
  'gal-26': {
    title: 'Earthworks & Civil Infrastructure Inspection',
    category: 'Technical Visits',
    caption: 'BIOSFERA team reviewing environmental compliance across a leveled construction platform.',
    location: 'Angola',
    capturedAt: 'Environmental Oversight',
  },
  'gal-27': {
    title: 'Mining Project Environmental Survey',
    category: 'Completed Projects',
    caption: 'Field team in hilly terrain following inspection of permit conditions and slope stabilization.',
    location: 'Angola',
    capturedAt: 'Compliance Report',
  },
  'gal-28': {
    title: 'Field Testing & GIS Topographic Mapping Integration',
    category: 'Environmental Assessments',
    caption: 'Combining volumetric field measurements with GIS slope and elevation maps of the study area.',
    location: 'Angola',
    capturedAt: 'Spatial Analysis',
  },
  'gal-29': {
    title: 'Water Sampling Along Drainage Channel',
    category: 'Sample Collection',
    caption: 'Preparing sampling gear along a water channel for effluent quality assessment.',
    location: 'Luanda, Angola',
    capturedAt: 'Water Quality Control',
  },
  'gal-30': {
    title: 'Native Wildlife Record During Ecological Survey',
    category: 'Fieldwork',
    caption: 'Photographic documentation of native antelope wildlife during a terrestrial biodiversity inventory.',
    location: 'Angola',
    capturedAt: 'Biodiversity',
  },
  'gal-31': {
    title: 'Savanna Ecological Transect Survey',
    category: 'Fieldwork',
    caption: 'On-foot ecological reconnaissance to characterize savanna flora and natural habitats.',
    location: 'Angola',
    capturedAt: 'Ecological Characterization',
  },
  'gal-32': {
    title: 'Wetland & Riverside Reconnaissance Survey',
    category: 'Fieldwork',
    caption: 'Traversing riparian grassland corridors supported by boat logistics during water surveys.',
    location: 'Angola',
    capturedAt: 'Ecological Study',
  },
  'gal-33': {
    title: 'Field Brigade Logistics Along River Corridor',
    category: 'Fieldwork',
    caption: 'Coordinating team movements between 4x4 support vehicles and river survey vessels.',
    location: 'Angola',
    capturedAt: 'River Operations',
  },
  'gal-34': {
    title: 'BIOSFERA Technical Team On-Site Approach',
    category: 'Fieldwork',
    caption: 'Equipped environmental specialists heading toward field sampling stations.',
    location: 'Angola',
    capturedAt: 'Field Team',
  },
  'gal-35': {
    title: 'Pre-Field Technical Briefing & Safety Check',
    category: 'Technical Meetings',
    caption: 'Aligning sampling objectives, review protocols, and safety checks prior to deployment.',
    location: 'Angola',
    capturedAt: 'Operational Briefing',
  },
  'gal-36': {
    title: 'Technical Coordination at BIOSFERA Headquarters',
    category: 'Technical Meetings',
    caption: 'Multidisciplinary consultancy team at our Kilamba headquarters reviewing environmental dossiers.',
    location: 'Kilamba, Luanda',
    capturedAt: 'Corporate Headquarters',
  },
  'gal-37': {
    title: 'EIA & Monitoring Report Peer-Review Session',
    category: 'Technical Meetings',
    caption: 'Consolidating field data, quality assurance checks, and final technical reporting in the office.',
    location: 'Kilamba, Luanda',
    capturedAt: 'Technical Office',
  },
  'gal-38': {
    title: 'Field Compliance Checklist Verification',
    category: 'Technical Visits',
    caption: 'Joint review of field inspection checklists and site observations by technical specialists.',
    location: 'Angola',
    capturedAt: 'Technical Review',
  },
  'gal-39': {
    title: 'Soil Surface & Vegetation Cover Inspection',
    category: 'Fieldwork',
    caption: 'Direct visual evaluation of soil integrity and vegetation recovery within a monitored zone.',
    location: 'Angola',
    capturedAt: 'Soil Survey',
  },
};

const GALLERY_ZH: Record<string, Partial<LocalizedGalleryItem>> = {
  'gal-1': {
    title: '水質與河川環境監測採樣作業',
    category: '環境監測採樣',
    caption: '使用多參數水質探測儀於河岸現場進行物理化學指標實測。',
    location: '安哥拉',
    capturedAt: '現場技術紀錄',
  },
  'gal-2': {
    title: '鋼鐵製造廠區噪音檢測稽核',
    category: '工業場域查核',
    caption: '於金屬生產廠房內進行工業噪音聲壓級量測與環境合規查驗。',
    location: '安哥拉羅安達',
    capturedAt: '工業稽核作業',
  },
  'gal-3': {
    title: '工業與物流場區環境現況評估',
    category: '環境現況評估',
    caption: '跨領域技術團隊於工業與物流作業區執行噪音監測及現場管理查核。',
    location: '羅安達維亞納',
    capturedAt: '現場營運查驗',
  },
  'gal-4': {
    title: '河岸水環境基線調查作業',
    category: '現場勘查作業',
    caption: 'BIOSFERA 技術人員於河川沿岸進行環境基線水質參數採集。',
    location: '本戈 / 寬扎河口',
    capturedAt: '基線調查研究',
  },
  'gal-5': {
    title: '全國環境監測跨專業技術團隊',
    category: '已完工專案',
    caption: 'BIOSFERA 完整技術編制團隊於綜合環境監測任務圓滿完成後合影。',
    location: '安哥拉',
    capturedAt: '現場執行團隊',
  },
  'gal-6': {
    title: '腳架固定式環境噪音連續監測',
    category: '環境監測採樣',
    caption: '使用經校準聲級計於河岸控制點位量測並記錄環境音壓數據。',
    location: '安哥拉',
    capturedAt: '聲學監測任務',
  },
  'gal-7': {
    title: 'DJI Mavic 3 Pro 空拍測繪作業',
    category: '現場勘查作業',
    caption: '操控無人機進行正射影像測繪與影響範圍空間環境分析。',
    location: '安哥拉',
    capturedAt: '環境遙感測繪',
  },
  'gal-8': {
    title: '多元氣體偵測與無人機協同監測',
    category: '環境監測採樣',
    caption: '現場團隊同步操作可攜式複合氣體偵測儀與無人航空載具。',
    location: '安哥拉',
    capturedAt: '現場整合監測',
  },
  'gal-9': {
    title: '河川廊道無人機即時遙測巡檢',
    category: '環境監測採樣',
    caption: '即時監控無人機飛行航線，對河岸與濕地進行高解析環境巡檢。',
    location: '安哥拉',
    capturedAt: '航空巡查測繪',
  },
  'gal-10': {
    title: '微型空氣品質監測站 (YF-IAQM-V1) 校準',
    category: '技術現場訪視',
    caption: '對大氣污染物連續監測設備進行現場校驗與微氣候參數設定。',
    location: '安哥拉羅安達',
    capturedAt: '大氣環境監測',
  },
  'gal-11': {
    title: '可攜式空氣品質監測站現場查驗',
    category: '環境監測採樣',
    caption: '於沿海作業區域評估懸浮微粒 (PM2.5/PM10) 及氣體指標。',
    location: '安哥拉沿海地區',
    capturedAt: '空氣品質監測',
  },
  'gal-12': {
    title: '場區大氣排放實地監測作業',
    category: '環境監測採樣',
    caption: '於法規合規查驗期間架設 YF-IAQM-V1 空氣品質監測設備進行採樣。',
    location: '安哥拉羅安達',
    capturedAt: '排放控制監測',
  },
  'gal-13': {
    title: '土壤樣本採集與監管鏈封裝作業',
    category: '樣本採集作業',
    caption: '穿著完整個人防護裝備之專家密封土壤樣本以送交認證實驗室分析。',
    location: '安哥拉',
    capturedAt: '土壤採樣紀錄',
  },
  'gal-14': {
    title: '水樣現場前處理與量測檢驗',
    category: '樣本採集作業',
    caption: '配戴防護手套並使用量筒進行水樣初步檢測與樣品分裝。',
    location: '安哥拉',
    capturedAt: '現場分析品管',
  },
  'gal-15': {
    title: '數位探針土壤參數現場實測',
    category: '樣本採集作業',
    caption: '於潮濕土壤剖面直接量測導電度與環境品質指標。',
    location: '安哥拉',
    capturedAt: '現場直接檢測',
  },
  'gal-16': {
    title: '可攜式數位 pH 水質分析儀器',
    category: '樣本採集作業',
    caption: '完成校準之 PH-280 數位分析儀，用於現場精確測定水體酸鹼值與溫度。',
    location: '安哥拉',
    capturedAt: '校準檢測儀器',
  },
  'gal-17': {
    title: '可攜式複合氣體濃度檢測作業',
    category: '環境監測採樣',
    caption: '即時量測作業場所空氣氣體濃度，確保職業安全與環境合規。',
    location: '安哥拉',
    capturedAt: '安全與環境監測',
  },
  'gal-18': {
    title: '現場分貝計數據判讀與紀錄',
    category: '環境監測採樣',
    caption: '讀取數位聲級計數值並填寫標準化現場環境監測紀錄表。',
    location: '安哥拉',
    capturedAt: '噪音數據紀錄',
  },
  'gal-19': {
    title: '地理定位採樣點臨時聲學測站',
    category: '環境監測採樣',
    caption: '配合現場支援車隊於指定座標點架設聲學監測三腳架設備。',
    location: '安哥拉',
    capturedAt: '採樣測網佈設',
  },
  'gal-20': {
    title: '製造業廠區全面環境稽核查驗',
    category: '工業場域查核',
    caption: '環境顧問團隊實地查核生產線作業區、機具動線及營運管理現況。',
    location: '安哥拉羅安達',
    capturedAt: '合規性現場稽核',
  },
  'gal-21': {
    title: '工業園區與露天倉儲環境檢視',
    category: '工業場域查核',
    caption: '評估廠區戶外倉儲堆置條件與工業廊道之環境安全防護。',
    location: '安哥拉羅安達',
    capturedAt: '廠區技術查核',
  },
  'gal-22': {
    title: '鋼構廠房內職安衛生 (PHST) 評估',
    category: '工業場域查核',
    caption: '針對金屬生產線查驗作業噪音、通風與集體安全防護措施。',
    location: '安哥拉羅安達',
    capturedAt: '職安衛生查核',
  },
  'gal-23': {
    title: '工業許可審查前現場技術訪視',
    category: '技術現場訪視',
    caption: '技術顧問巡視工業設施周邊區域，盤點環境面向與減緩設施。',
    location: '安哥拉羅安達',
    capturedAt: '環境許可審查',
  },
  'gal-24': {
    title: '採石與礦業區環境噪音實測',
    category: '環境現況評估',
    caption: '於礦石開採現場執行噪音監測與生物物理環境影響評估。',
    location: '安哥拉',
    capturedAt: '環境影響評估',
  },
  'gal-25': {
    title: '開挖作業面環境減緩措施督導',
    category: '環境現況評估',
    caption: '於重型工程機具作業區旁檢視揚塵抑制與土方作業管理執行情況。',
    location: '安哥拉',
    capturedAt: '管理計畫督導',
  },
  'gal-26': {
    title: '土木整地與基礎設施環境查核',
    category: '技術現場訪視',
    caption: 'BIOSFERA 團隊於整地工程平台查驗環境保護義務落實情形。',
    location: '安哥拉',
    capturedAt: '環境合規查核',
  },
  'gal-27': {
    title: '礦業開發區山坡環境合規調查',
    category: '已完工專案',
    caption: '團隊於丘陵礦區完成許可附帶條件查核與邊坡復育現勘。',
    location: '安哥拉',
    capturedAt: '合規審查報告',
  },
  'gal-28': {
    title: '現場試驗與 GIS 地形圖整合判釋',
    category: '環境現況評估',
    caption: '將現場量測數據與研究區坡度及高程 GIS 空間圖資進行交叉比對。',
    location: '安哥拉',
    capturedAt: '空間環境分析',
  },
  'gal-29': {
    title: '排水渠道水質採樣準備作業',
    category: '樣本採集作業',
    caption: '於水渠邊準備專業採樣裝備以進行放流水水質評估作業。',
    location: '安哥拉羅安達',
    capturedAt: '水質監測控制',
  },
  'gal-30': {
    title: '生態調查期間安哥拉原生野生動物紀錄',
    category: '現場勘查作業',
    caption: '陸域生物多樣性調查中拍攝記錄棲地內野生羚羊蹤跡。',
    location: '安哥拉',
    capturedAt: '生物多樣性調查',
  },
  'gal-31': {
    title: '稀樹草原生態樣線徒步踏勘',
    category: '現場勘查作業',
    caption: '深入自然草地進行植群組成與自然棲地現況調查。',
    location: '安哥拉',
    capturedAt: '生態特性調查',
  },
  'gal-32': {
    title: '河岸濕地與水路船隻協同踏勘',
    category: '現場勘查作業',
    caption: '結合水上船隻後勤深入濱水草澤區域執行生態現況評估。',
    location: '安哥拉',
    capturedAt: '生態現地研究',
  },
  'gal-33': {
    title: '河川流域現場團隊後勤協調作業',
    category: '現場勘查作業',
    caption: '於登船點與四輪驅動支援車輛之間調度採樣人員與裝備。',
    location: '安哥拉',
    capturedAt: '水域現場調度',
  },
  'gal-34': {
    title: '配戴標準識別裝備前往勘查現場',
    category: '現場勘查作業',
    caption: 'BIOSFERA 環境技術專家著裝完畢前往預定採樣測點。',
    location: '安哥拉',
    capturedAt: '現場作業編組',
  },
  'gal-35': {
    title: '現場採樣前技術簡報與安全確認',
    category: '技術審查會議',
    caption: '出發作業前針對採樣目標、標準流程與現場安全事項進行盤點。',
    location: '安哥拉',
    capturedAt: '勤前技術簡報',
  },
  'gal-36': {
    title: '羅安達總部技術協調會議',
    category: '技術審查會議',
    caption: '跨領域顧問團隊於 Kilamba 總部辦公室討論環評與許可案件進度。',
    location: '羅安達 Kilamba',
    capturedAt: '企業總部辦公',
  },
  'gal-37': {
    title: '環評 (EIA) 與監測報告內部同儕審查',
    category: '技術審查會議',
    caption: '於辦公室內彙整現場數據、執行品質檢核並編撰最終技術報告。',
    location: '羅安達 Kilamba',
    capturedAt: '技術報告編審',
  },
  'gal-38': {
    title: '現場環境合規檢核表雙向覆核',
    category: '技術現場訪視',
    caption: '技術專家於現場共同核對環境查核紀錄與改善觀察事項。',
    location: '安哥拉',
    capturedAt: '品質查驗覆核',
  },
  'gal-39': {
    title: '表土品質與植被覆蓋實地檢視',
    category: '現場勘查作業',
    caption: '直接檢視監測區域內之土壤完整性與自然植被復育狀態。',
    location: '安哥拉',
    capturedAt: '土壤與植被勘查',
  },
};

export function localizeGalleryItem(
  item: GalleryItem,
  lang: SiteLanguage
): LocalizedGalleryItem {
  if (lang === 'pt') return item;
  const map = lang === 'zh' ? GALLERY_ZH : GALLERY_EN;
  const localized = map[item.id];
  return localized
    ? { ...item, ...localized }
    : { ...item, category: localizeCategory(item.category, lang) };
}

const NEWS_EN: Record<string, Partial<LocalizedNewsArticle>> = {
  'decreto-117-20-eia': {
    title: 'Legal Framework for Environmental Impact Assessment in Angola (Presidential Decree No. 117/20)',
    category: 'Environmental Legislation & Updates',
    summary:
      'Technical overview of EIA and Environmental Permitting procedures applicable to public and private developments in Angola.',
    content:
      'Environmental compliance in Angola relies on strict adherence to Presidential Decree No. 117/20 of April 22, establishing the General Regulation on Environmental Impact Assessment and Environmental Permitting.\n\nFor developers in oil and gas, manufacturing, energy, ports, and civil construction, accurate early project categorization is essential to avoid delays in obtaining Installation and Operation Environmental Licenses.\n\nBIOSFERA – Consultoria Ambiental, Lda. delivers full regulatory support from conception onward, including Terms of Reference, baseline environmental characterization, public consultation, and Environmental Management Plans (EMP).',
  },
  'gestao-integrada-residuos-industriais': {
    title: 'Best Practices for Industrial and Hospital Waste Management Plans',
    category: 'Technical Articles',
    summary:
      'How to structure source segregation, temporary storage, and full traceability of hazardous and biomedical waste safely and efficiently.',
    content:
      'An effective Waste Management Plan (WMP) goes beyond formal compliance: it lowers environmental liabilities, optimizes logistics costs, and safeguards occupational health.\n\nIn BIOSFERA’s technical practice, implementation begins with a quantitative and qualitative audit per production or clinical unit, separating hazardous, infectious/biomedical, and general streams.\n\nStandardized labeling, impermeable storage bays with containment bunds, and tracking manifests to licensed operators establish a reliable foundation for audit readiness.',
  },
};

const NEWS_ZH: Record<string, Partial<LocalizedNewsArticle>> = {
  'decreto-117-20-eia': {
    title: '安哥拉環境影響評估法律架構解析（第 117/20 號總統令）',
    category: '環境法規與政策更新',
    summary: '深入解析安哥拉境內公私部門開發案適用之環境影響評估 (EIA) 與環境許可審查法定程序。',
    content:
      '在安哥拉營運與投資的環境合規核心，為嚴格遵循 4 月 22 日頒布之第 117/20 號總統令《環境影響評估與環境許可總條例》。\n\n對於石油天然氣、製造業、能源電力、港口與營建開發單位而言，專案前期精準界定法規類別是避免延誤取得「設置環境許可」與「營運環境許可」的關鍵。\n\nBIOSFERA 環境顧問有限公司從專案構想階段起提供完整法規輔導，涵蓋工作範圍書 (ToR)、環境基線調查、公眾諮詢及環境管理計畫 (PGA) 編製。',
  },
  'gestao-integrada-residuos-industriais': {
    title: '工業與醫療廢棄物管理計畫 (PGR) 實施最佳實務',
    category: '專業技術文章',
    summary: '探討如何安全且高效率地建立有害廢棄物與生物醫療廢棄物之源頭分類、暫存與全程聯單追蹤機制。',
    content:
      '一套完善的廢棄物管理計畫 (PGR) 不僅是滿足政府法規要求，更能顯著降低企業環境負債、優化清運物流成本並守護員工健康安全。\n\n依據 BIOSFERA 的實務經驗，計畫執行應自各生產或醫療部門之定量與定性產出盤點開始，明確區隔有害廢棄物、感染性醫療廢棄物與一般廢棄物。\n\n落實標準化標示、具防溢漏圍堤之不透水暫存空間，並配合交付具合法執照處理業者之追蹤聯單，能確保企業隨時符合環保稽查標準。',
  },
};

export function localizeNewsArticle(
  article: NewsArticle,
  lang: SiteLanguage
): LocalizedNewsArticle {
  if (lang === 'pt') return article;
  const map = lang === 'zh' ? NEWS_ZH : NEWS_EN;
  const localized = map[article.id];
  return localized
    ? { ...article, ...localized }
    : { ...article, category: localizeCategory(article.category, lang) };
}

const TESTIMONIALS_EN: Record<string, Partial<TestimonialItem>> = {
  'test-1': {
    organization: 'Industrial Operations — Viana Hub',
    role: 'Director of Operations',
    comment:
      'BIOSFERA’s support throughout our Environmental Licensing process and Waste Management Plan was decisive. All technical documentation met deadlines and Presidential Decree No. 117/20 standards without a single rejection.',
  },
  'test-2': {
    organization: 'Luanda Logistics Infrastructure',
    role: 'HSE Coordinator',
    comment:
      'We highlight the technical rigor in water quality and environmental noise monitoring campaigns, as well as the clarity of the quarterly Environmental Monitoring Reports delivered by the field team.',
  },
  'test-3': {
    organization: 'Developments & Civil Engineering',
    role: 'Project Manager',
    comment:
      'Outstanding responsiveness in preparing our Environmental Impact Assessment (EIA) and Occupational Health & Safety Plan for our construction site. An objective and closely engaged multidisciplinary team.',
  },
  'test-4': {
    organization: 'Private Healthcare Unit — Belas',
    role: 'Biosafety Officer',
    comment:
      'Implementing the Hospital & Biomedical Waste Management Plan brought clearer internal segregation and greater safety for clinical staff, supported by very practical hands-on training.',
  },
};

const TESTIMONIALS_ZH: Record<string, Partial<TestimonialItem>> = {
  'test-1': {
    organization: '維亞納工業園區營運單位',
    role: '營運總監',
    comment:
      'BIOSFERA 在我們辦理環境許可與廢棄物管理計畫 (PGR) 期間提供了關鍵性的專業支援。所有技術文件均準時完成並完全符合第 117/20 號總統令標準，審查過程零退件。',
  },
  'test-2': {
    organization: '羅安達大型物流基礎設施',
    role: '環安衛 (HSE) 協調主管',
    comment:
      '特別肯定現場技術團隊在水質與環境噪音監測作業上的嚴謹態度，以及每季提交的環境監測報告 (RMA) 數據清晰度與專業判讀品質。',
  },
  'test-3': {
    organization: '建築開發與土木工程集團',
    role: '專案經理',
    comment:
      '在工地環評 (EIA) 與職業安全衛生計畫 (PHST) 編製過程中展現極高的應變速度，跨領域團隊客觀務實且緊密配合進度。',
  },
  'test-4': {
    organization: '貝拉斯私立醫療中心',
    role: '生物安全管理專員',
    comment:
      '導入醫療廢棄物管理計畫後，院內分類動線更加明確並大幅提升醫護人員作業安全性，現場實務訓練非常紮實受用。',
  },
};

export function localizeTestimonial(item: TestimonialItem, lang: SiteLanguage): TestimonialItem {
  if (lang === 'pt') return item;
  const map = lang === 'zh' ? TESTIMONIALS_ZH : TESTIMONIALS_EN;
  const localized = map[item.id];
  return localized ? { ...item, ...localized } : item;
}

export const FAQ_ITEMS_BY_LANG = {
  pt: [
    {
      id: 'faq-licenciamento-obrigatorio',
      category: 'Licenciamento Ambiental',
      question:
        'Quando é obrigatório o Licenciamento Ambiental e o Estudo de Impacte Ambiental (EIA) em Angola?',
      answer:
        'Nos termos do Decreto Presidencial n.º 117/20 (Regime Jurídico da Avaliação de Impacte Ambiental e Licenciamento Ambiental), todos os projectos públicos ou privados susceptíveis de gerar impactes significativos sobre o ambiente — incluindo empreendimentos industriais, petrolíferos, energéticos, de construção civil, portos, infra-estruturas e gestão de resíduos — devem ser submetidos a processo de licenciamento ambiental prévio junto da autoridade competente antes do início das obras ou da operação.',
    },
    {
      id: 'faq-categorias-aia',
      category: 'Licenciamento Ambiental',
      question:
        'Qual é a diferença entre os estudos das Categorias A, B e C previstas na legislação angolana?',
      answer:
        'O enquadramento é determinado pela natureza, dimensão e sensibilidade ambiental da área de implantação do projecto. Projectos de Categoria A requerem um Estudo de Impacte Ambiental (EIA) completo com consulta pública; os de Categoria B exigem um Estudo de Impacte Ambiental Simplificado ou Relatório Ambiental Preliminar; já actividades de menor impacte (Categoria C) tramitam mediante Termo de Responsabilidade Ambiental ou medidas mitigadoras simplificadas. A BIOSFERA assegura o enquadramento legal correcto desde a fase inicial.',
    },
    {
      id: 'faq-prazo-eia',
      category: 'Prazos e Tramitação',
      question:
        'Quanto tempo demora a elaboração e aprovação de um processo de Licenciamento Ambiental?',
      answer:
        'O prazo técnico de elaboração varia tipicamente entre 4 e 12 semanas, consoante a categoria do empreendimento, a necessidade de campanhas de amostragem em campo (qualidade da água, solo, ar, ruído e biodiversidade) e a disponibilidade de dados do projecto. Após a submissão formal ao Ministério do Ambiente, os prazos de apreciação seguem os trâmites legais estabelecidos no regulamento em vigor, sendo acompanhados continuamente pela nossa equipa até à emissão da Licença Ambiental.',
    },
    {
      id: 'faq-licenca-instalacao-operacao',
      category: 'Licenciamento Ambiental',
      question:
        'Qual a distinção entre Licença Ambiental de Instalação e Licença Ambiental de Operação?',
      answer:
        'A Licença Ambiental de Instalação autoriza a implantação física e construção do projecto em conformidade com as medidas do EIA e do Plano de Gestão Ambiental (PGA). Concluída a obra e verificado o cumprimento das condicionantes impostas, solicita-se a Licença Ambiental de Operação, que habilita o funcionamento regular da actividade e impõe obrigações periódicas de monitorização e reporte (RMA).',
    },
    {
      id: 'faq-rma-pga-pgr',
      category: 'Monitorização e Gestão',
      question:
        'O que incluem os Relatórios de Monitorização Ambiental (RMA) e os Planos de Gestão de Resíduos (PGR)?',
      answer:
        'O RMA sistematiza medições periódicas de parâmetros ambientais (efluentes, emissões atmosféricas, ruído ocupacional e ambiental, águas subterrâneas e solos) exigidas na Licença Ambiental, avaliando a eficácia das medidas mitigadoras. O PGR define o inventário, segregação, acondicionamento, transporte e destino final licenciado de resíduos industriais, perigosos, comuns ou hospitalares, em cumprimento do Decreto Presidencial n.º 190/12.',
    },
    {
      id: 'faq-auditorias-phst',
      category: 'Auditorias e Segurança',
      question:
        'A BIOSFERA realiza Auditorias Ambientais e Planos de Higiene, Saúde e Segurança no Trabalho (PHST)?',
      answer:
        'Sim. Desenvolvemos auditorias ambientais de conformidade legal e diagnósticos de passivos ambientais, bem como Planos de Higiene, Saúde e Segurança no Trabalho (PHST), avaliação de riscos ocupacionais e programas de prevenção para estaleiros, unidades industriais e instalações logísticas em todas as províncias de Angola.',
    },
    {
      id: 'faq-documentos-proposta',
      category: 'Consultoria e Propostas',
      question:
        'Que informações são necessárias para solicitar uma proposta técnica e financeira à BIOSFERA?',
      answer:
        'Para preparar uma proposta ajustada ao seu empreendimento, recomendamos a indicação da localização exacta (província e município), descrição sumária da actividade ou memória descritiva, fase actual do projecto (concepção, construção ou operação) e, caso existam, cópias de licenças ou notificações anteriores. Pode submeter estes dados directamente através do nosso formulário de Solicitação de Proposta.',
    },
  ],
  en: [
    {
      id: 'faq-licenciamento-obrigatorio',
      category: 'Environmental Permitting',
      question:
        'When are Environmental Permitting and an Environmental Impact Assessment (EIA) mandatory in Angola?',
      answer:
        'Under Presidential Decree No. 117/20 (Legal Framework for Environmental Impact Assessment and Environmental Permitting), all public or private projects likely to generate significant environmental impacts — including industrial, oil & gas, energy, civil construction, port, infrastructure, and waste facilities — must obtain prior environmental clearance from the competent authority before construction or operation begins.',
    },
    {
      id: 'faq-categorias-aia',
      category: 'Environmental Permitting',
      question:
        'What is the difference between Category A, B, and C studies under Angolan legislation?',
      answer:
        'Classification depends on the nature, scale, and environmental sensitivity of the project site. Category A projects require a full EIA with public consultation; Category B requires a Simplified EIA or Preliminary Environmental Report; Category C lower-impact activities proceed via an Environmental Responsibility Statement or simplified mitigation measures. BIOSFERA ensures accurate legal scoping from day one.',
    },
    {
      id: 'faq-prazo-eia',
      category: 'Timelines & Review',
      question:
        'How long does it take to prepare and approve an Environmental Permitting dossier?',
      answer:
        'Technical preparation typically takes between 4 and 12 weeks depending on project category, field sampling requirements (water, soil, air, noise, biodiversity), and availability of engineering data. After formal submission to the Ministry of Environment, review follows statutory regulatory timelines, with continuous technical follow-up by our team until license issuance.',
    },
    {
      id: 'faq-licenca-instalacao-operacao',
      category: 'Environmental Permitting',
      question:
        'What distinguishes an Installation Environmental License from an Operation Environmental License?',
      answer:
        'The Installation Environmental License authorizes physical site works and construction in accordance with the EIA and Environmental Management Plan (EMP). Once construction is completed and permit conditions are verified, the Operation Environmental License is requested to authorize ongoing facility operations and regular monitoring reporting (EMR).',
    },
    {
      id: 'faq-rma-pga-pgr',
      category: 'Monitoring & Management',
      question:
        'What do Environmental Monitoring Reports (EMR) and Waste Management Plans (WMP) include?',
      answer:
        'The EMR compiles periodic measurements of environmental parameters (effluents, air emissions, occupational and ambient noise, groundwater, and soils) required by the license while evaluating mitigation effectiveness. The WMP establishes the inventory, segregation, storage, transport, and licensed final disposal of industrial, hazardous, general, or hospital waste under Presidential Decree No. 190/12.',
    },
    {
      id: 'faq-auditorias-phst',
      category: 'Audits & Safety',
      question:
        'Does BIOSFERA conduct Environmental Audits and Occupational Health & Safety Plans (OHSP)?',
      answer:
        'Yes. We deliver legal compliance environmental audits and liability diagnostics, alongside Occupational Health, Safety and Hygiene Plans (OHSP), workplace risk assessments, and prevention programs for construction sites, factories, and logistics hubs across all Angolan provinces.',
    },
    {
      id: 'faq-documentos-proposta',
      category: 'Consultancy & Proposals',
      question:
        'What information is needed to request a technical and financial proposal from BIOSFERA?',
      answer:
        'To prepare a tailored proposal, we recommend sharing the exact location (province and municipality), a brief activity description or project summary, current phase (design, construction, or operation), and copies of any prior permits or notices. You can submit these details directly via our Request Proposal form.',
    },
  ],
  zh: [
    {
      id: 'faq-licenciamento-obrigatorio',
      category: '環境許可法規',
      question: '在安哥拉什麼情況下必須辦理環境許可與環境影響評估 (EIA)？',
      answer:
        '依據安哥拉第 117/20 號總統令《環境影響評估與環境許可法律制度》，凡可能對環境產生顯著影響的公私部門投資專案 — 包含工業製造、石油天然氣、能源電力、土木營建、港口、基礎設施與廢棄物處理設施 — 皆必須於動工建設或正式營運前向主管機關申請並取得事前環境許可。',
    },
    {
      id: 'faq-categorias-aia',
      category: '環境許可法規',
      question: '安哥拉環境法規中的 A、B、C 三類環評研究有何差異？',
      answer:
        '分類取決於專案性質、開發規模及預定場址之環境敏感度。A 類專案須編製完整環境影響評估報告 (EIA) 並舉辦公眾諮詢；B 類須提交簡化環境影響評估或初步環境報告；影響較低之 C 類活動則透過環境責任聲明書或簡化減緩措施申辦。BIOSFERA 於專案初期即協助精準判定法規類別。',
    },
    {
      id: 'faq-prazo-eia',
      category: '審查時程',
      question: '編製並取得環境許可證照通常需要多長時間？',
      answer:
        '技術文件編製期通常介於 4 至 12 週，實際時程視專案分類、現場採樣檢測需求（水質、土壤、空氣、噪音與生態調查）以及工程資料完整度而定。正式遞交安哥拉環境部 (MINAMB) 後，審查遵循法定行政程序時限，並由我們團隊全程追蹤協調直至核發許可。',
    },
    {
      id: 'faq-licenca-instalacao-operacao',
      category: '環境許可法規',
      question: '「設置環境許可」與「營運環境許可」之間有何區別？',
      answer:
        '設置環境許可 (Licença de Instalação) 授權企業依據 EIA 與環境管理計畫 (PGA) 進行實體場址施工與建設。工程完工並經核對符合各項許可條件後，即申請營運環境許可 (Licença de Operação)，方得合法展開常態營運並須定期申報環境監測報告 (RMA)。',
    },
    {
      id: 'faq-rma-pga-pgr',
      category: '監測與管理',
      question: '環境監測報告 (RMA) 與廢棄物管理計畫 (PGR) 包含哪些內容？',
      answer:
        'RMA 定期彙整環境許可要求量測之各項環境參數（放流水、大氣排放、職場與環境噪音、地下水及土壤），用以評估減緩措施實效；PGR 則依據第 190/12 號總統令規範工業、有害、一般或醫療廢棄物之產出盤點、分類、容器包裝、清運與合法最終處置流向。',
    },
    {
      id: 'faq-auditorias-phst',
      category: '稽核與安全',
      question: 'BIOSFERA 是否承辦環境稽核及職業衛生、健康與安全計畫 (PHST)？',
      answer:
        '是的。我們在安哥拉全國各省承辦環境法規合規稽核、環境負債診斷，並為施工工地、工業廠房與物流園區提供職業安全衛生計畫 (PHST)、職場風險評估與事故預防培訓服務。',
    },
    {
      id: 'faq-documentos-proposta',
      category: '顧問諮詢與報價',
      question: '向 BIOSFERA 索取技術與財務報價方案需要提供哪些基本資料？',
      answer:
        '為了編製最貼合您專案需求的報價方案，建議提供專案確切位置（省份與市區）、業務活動簡介或技術說明、目前階段（規劃設計、施工或營運中）以及既有的環境許可或公文副本。您可直接透過網站上的方案申請表單線上提交。',
    },
  ],
};

export const ABOUT_VALUES_BY_LANG = {
  pt: [
    {
      title: 'Ética e transparência',
      description:
        'Actuação íntegra, imparcial e transparente perante clientes, comunidades e entidades reguladoras.',
    },
    {
      title: 'Responsabilidade ambiental',
      description:
        'Compromisso efectivo com a prevenção da poluição e a conservação dos ecossistemas angolanos.',
    },
    {
      title: 'Excelência técnica',
      description:
        'Rigor científico, metodologias validadas e melhoria contínua em todos os estudos e pareceres.',
    },
    {
      title: 'Compromisso com o cliente',
      description:
        'Soluções exequíveis, prazos cumpridos e acompanhamento técnico próximo em cada fase do projecto.',
    },
    {
      title: 'Inovação',
      description:
        'Adopção de ferramentas modernas de monitorização, análise espacial e gestão ambiental integrada.',
    },
    {
      title: 'Sustentabilidade',
      description:
        'Promoção do equilíbrio duradouro entre o crescimento económico e a preservação dos recursos naturais.',
    },
  ],
  en: [
    {
      title: 'Ethics & Transparency',
      description:
        'Principled, impartial, and transparent conduct toward clients, communities, and regulators.',
    },
    {
      title: 'Environmental Responsibility',
      description:
        'Active commitment to pollution prevention and the conservation of Angolan ecosystems.',
    },
    {
      title: 'Technical Excellence',
      description:
        'Scientific rigor, validated methodologies, and continuous improvement in every study.',
    },
    {
      title: 'Client Commitment',
      description:
        'Workable solutions, reliable deadlines, and dedicated technical support in every phase.',
    },
    {
      title: 'Innovation',
      description:
        'Adoption of modern monitoring, spatial analysis, and integrated environmental management tools.',
    },
    {
      title: 'Sustainability',
      description:
        'Advancing lasting balance between economic growth and natural resource preservation.',
    },
  ],
  zh: [
    {
      title: '誠信倫理與透明公開',
      description: '對客戶、在地社區與政府監管機關始終秉持正直、客觀與透明的專業操守。',
    },
    {
      title: '環境責任與使命',
      description: '實質落實污染防治與安哥拉自然生態系統保育之長期承諾。',
    },
    {
      title: '卓越技術實力',
      description: '在每份研究報告與技術審查中堅持科學嚴謹、經實證的方法論與持續精進。',
    },
    {
      title: '客戶至上承諾',
      description: '提供務實可行的解決方案、嚴守專案時程並於各階段提供緊密技術支援。',
    },
    {
      title: '技術與工具創新',
      description: '導入現代化環境監測儀器、空間地理分析與整合式環境管理系統。',
    },
    {
      title: '永續共榮發展',
      description: '致力推動經濟穩健成長與自然資源永續保存之間的長期和諧平衡。',
    },
  ],
};

export const ABOUT_COMPETENCIES_BY_LANG = {
  pt: [
    'Avaliação de Impacte Ambiental e Social (EIA / EIAS)',
    'Licenciamento Ambiental e Regularização de Instalações',
    'Auditorias Ambientais de Conformidade e Desempenho',
    'Monitorização da Qualidade do Ar, Água, Solos e Ruído',
    'Elaboração e Implementação de Planos de Gestão Ambiental (PGA)',
    'Gestão Integrada de Resíduos Industriais, Perigosos e Hospitalares',
    'Higiene, Saúde e Segurança no Trabalho (PHST)',
    'Capacitação Técnica e Formação Ambiental Corporativa',
  ],
  en: [
    'Environmental & Social Impact Assessment (EIA / ESIA)',
    'Environmental Permitting & Facility Regularization',
    'Compliance & Environmental Performance Audits',
    'Air, Water, Soil, and Environmental Noise Monitoring',
    'Environmental Management Plans (EMP) Design & Execution',
    'Integrated Industrial, Hazardous & Biomedical Waste Management',
    'Occupational Health, Safety & Hygiene Plans (OHSP)',
    'Technical Capacity Building & Corporate Environmental Training',
  ],
  zh: [
    '環境與社會影響評估 (EIA / ESIA)',
    '環境許可申辦與既設場址合規輔導',
    '法規合規與環境績效專業稽核',
    '空氣品質、水質、土壤與環境噪音監測',
    '環境管理計畫 (PGA) 設計與現場導入執行',
    '工業、有害暨醫療廢棄物整合管理規劃',
    '職業衛生、健康與安全計畫 (PHST)',
    '企業環保技術培訓與人員專業能力建構',
  ],
};

export const SUSTAINABILITY_PILLARS_BY_LANG = {
  pt: [
    {
      title: 'Preservação dos Ecossistemas e Biodiversidade',
      text: 'Mapeamento de habitats sensíveis, protecção de zonas húmidas e mangais costeiros e implementação de corredores ecológicos em áreas de implantação industrial.',
    },
    {
      title: 'Prevenção da Poluição na Origem',
      text: 'Controlo preventivo de emissões atmosféricas, ruído ocupacional e ambiental, descargas líquidas e contaminação de solos através de tecnologia limpa.',
    },
    {
      title: 'Gestão Responsável dos Recursos Hídricos',
      text: 'Optimização do consumo de água, tratamento de efluentes e monitorização contínua da qualidade das águas superficiais e subterrâneas.',
    },
    {
      title: 'Economia Circular e Valorização de Resíduos',
      text: 'Redução da geração na fonte, segregação rigorosa, reciclagem e encaminhamento certificado para operadores licenciados.',
    },
    {
      title: 'Qualidade do Ar e Acção Climática',
      text: 'Inventário de emissões, monitorização atmosférica e apoio à transição energética para fontes renováveis e eficiência operacional.',
    },
    {
      title: 'Responsabilidade Ambiental Empresarial',
      text: 'Capacitação de quadros, transparência no reporte ambiental e alinhamento com os Objectivos de Desenvolvimento Sustentável (ODS).',
    },
  ],
  en: [
    {
      title: 'Ecosystem & Biodiversity Preservation',
      text: 'Sensitive habitat mapping, coastal mangrove and wetland protection, and ecological corridors in industrial areas.',
    },
    {
      title: 'Pollution Prevention at Source',
      text: 'Preventive control of atmospheric emissions, occupational and ambient noise, liquid discharges, and soil contamination.',
    },
    {
      title: 'Responsible Water Resource Management',
      text: 'Water consumption optimization, effluent treatment, and continuous surface and groundwater quality monitoring.',
    },
    {
      title: 'Circular Economy & Waste Recovery',
      text: 'Source waste minimization, strict segregation, recycling, and certified routing to licensed operators.',
    },
    {
      title: 'Air Quality & Climate Action',
      text: 'Emissions inventories, atmospheric monitoring, and transition support toward renewable energy and efficiency.',
    },
    {
      title: 'Corporate Environmental Responsibility',
      text: 'Staff training, transparent environmental reporting, and alignment with the UN Sustainable Development Goals.',
    },
  ],
  zh: [
    {
      title: '生態系統與生物多樣性保育',
      text: '敏感棲地測繪、沿海紅樹林與濕地保護，以及工業區開發周邊生態廊道規劃。',
    },
    {
      title: '污染源頭預防與控制',
      text: '導入清潔生產技術，事前防範大氣排放、職場及環境噪音、廢水排放與土壤污染。',
    },
    {
      title: '水資源負責任管理',
      text: '優化製程用水效率、強化廢污水處理並持續監測地表水與地下水體品質。',
    },
    {
      title: '循環經濟與廢棄物資源化',
      text: '落實源頭減量、精準分類、資源回收再利用，並透過合格執照業者認證處理。',
    },
    {
      title: '空氣品質維護與氣候行動',
      text: '建立溫室氣體與排放清冊、執行大氣監測並協助企業轉型再生能源與節能營運。',
    },
    {
      title: '企業環境社會責任',
      text: '強化內部專業人才培訓、提升環境資訊揭露透明度並全面接軌聯合國永續發展目標 (SDGs)。',
    },
  ],
};

export const SUSTAINABILITY_PRACTICES_BY_LANG = {
  pt: [
    {
      title: '1. Hierarquia da Gestão de Resíduos',
      detail:
        'Priorizar sempre a prevenção e redução na fonte, seguindo-se a reutilização, reciclagem, valorização energética e apenas em último recurso a deposição controlada.',
    },
    {
      title: '2. Integração Ambiental na Fase de Projecto',
      detail:
        'Realizar a Avaliação de Impacte Ambiental antes da definição final de engenharia reduz custos de mitigação e acelera o licenciamento ambiental.',
    },
    {
      title: '3. Monitorização Baseada em Evidências',
      detail:
        'Estabelecer campanhas periódicas de medição de ar, água, solos e ruído com cadeias de custódia auditáveis permite antecipar desvios e garantir conformidade contínua.',
    },
    {
      title: '4. Cultura Interna de Segurança e Ambiente',
      detail:
        'Planos eficazes exigem formação contínua das equipas operacionais, sinalização clara, procedimentos de emergência testados e liderança comprometida.',
    },
  ],
  en: [
    {
      title: '1. Waste Management Hierarchy',
      detail:
        'Always prioritize prevention and reduction at source, followed by reuse, recycling, energy recovery, and controlled disposal only as a last resort.',
    },
    {
      title: '2. Early Environmental Integration in Design',
      detail:
        'Conducting Environmental Impact Assessments before final engineering freeze reduces mitigation costs and accelerates licensing.',
    },
    {
      title: '3. Evidence-Based Monitoring',
      detail:
        'Establishing periodic air, water, soil, and noise sampling campaigns with auditable chain-of-custody prevents deviations and ensures compliance.',
    },
    {
      title: '4. Internal Safety & Environmental Culture',
      detail:
        'Effective plans rely on ongoing operational training, clear signage, tested emergency drills, and committed leadership.',
    },
  ],
  zh: [
    {
      title: '1. 廢棄物管理優先順序原則',
      detail: '始終以源頭預防與減量為最優先，其次依序為重複使用、資源回收、能源回收，僅於最後不得已時採行受控最終處置。',
    },
    {
      title: '2. 工程設計初期即整合環境評估',
      detail: '於工程細部設計定案前即完成環境影響評估 (EIA)，能大幅降低後續污染防制成本並加速取得環境許可。',
    },
    {
      title: '3. 基於實測證據的科學監測',
      detail: '建立具備完整樣品監管鏈之空氣、水質、土壤與噪音定期監測機制，及早察覺異常並確保長期合規。',
    },
    {
      title: '4. 建立企業內部安衛與環保文化',
      detail: '管理的成功仰賴現場團隊持續培訓、清晰安全標示、定期演練緊急應變流程與管理階層的堅定投入。',
    },
  ],
};

export type TimelineCategory = 'foundation' | 'licensing' | 'operations';

export interface TimelineMilestone {
  id: string;
  year: string;
  phase: string;
  category: TimelineCategory;
  categoryLabel: string;
  scope: string;
  title: string;
  summary: string;
  impactMetric: string;
  impactLabel: string;
  deliverables: string[];
  iconName: 'Compass' | 'FileCheck2' | 'Recycle' | 'Scale' | 'Activity' | 'Award';
}

export const COMPANY_TIMELINE_BY_LANG: Record<SiteLanguage, TimelineMilestone[]> = {
  pt: [
    {
      id: '2015-fundacao',
      year: '2015',
      phase: 'Fundação Institucional',
      category: 'foundation',
      categoryLabel: 'Fundação & Estratégia',
      scope: 'Luanda, Angola',
      title: 'Constituição da BIOSFERA e Primeiros Diagnósticos Ambientais',
      summary:
        'Início oficial das operações em Angola com foco em diagnósticos ambientais preliminares, avaliação de conformidade legal e apoio técnico a unidades industriais e comerciais em fase de instalação.',
      impactMetric: 'Ano 1',
      impactLabel: 'Base Técnica Nacional em Luanda',
      deliverables: [
        'Estruturação da prática de consultoria ambiental independente',
        'Primeiros relatórios de enquadramento legal para operadores industriais',
        'Definição de protocolos internos de rigor técnico e rastreabilidade',
      ],
      iconName: 'Compass',
    },
    {
      id: '2017-eia-portos',
      year: '2017',
      phase: 'Expansão Técnica',
      category: 'licensing',
      categoryLabel: 'Estudos & Licenciamento',
      scope: 'Indústria, Portos & Logística',
      title: 'Consolidação em Estudos de Impacte Ambiental (EIA) e Terminais',
      summary:
        'Alargamento da equipa multidisciplinar com engenheiros do ambiente, biólogos e técnicos de campo, assumindo estudos de impacte ambiental completos para projectos portuários, logísticos e fabris.',
      impactMetric: '+30',
      impactLabel: 'Estudos e Relatórios Técnicos Iniciais',
      deliverables: [
        'Levantamentos biofísicos, ecológicos e socioeconómicos de linha de base',
        'Estudos de Impacte Ambiental para corredores logísticos e terminais',
        'Modelos de mitigação e compensação ambiental adaptados ao contexto angolano',
      ],
      iconName: 'FileCheck2',
    },
    {
      id: '2019-residuos',
      year: '2019',
      phase: 'Especialização Sectorial',
      category: 'operations',
      categoryLabel: 'Resíduos & Monitorização',
      scope: 'Saúde, Indústria & Construção',
      title: 'Programas Avançados de Gestão de Resíduos (PGR) e Hospitalares',
      summary:
        'Implementação de soluções técnicas estruturadas para segregação na origem, acondicionamento seguro, transporte certificado e rastreabilidade documental de resíduos industriais, perigosos e hospitalares.',
      impactMetric: '+40',
      impactLabel: 'Processos de Licenciamento Acompanhados',
      deliverables: [
        'Planos de Gestão de Resíduos (PGR) para estaleiros e parques industriais',
        'Protocolos específicos para resíduos infecciosos e unidades hospitalares',
        'Integração de princípios de economia circular e valorização de fluxos',
      ],
      iconName: 'Recycle',
    },
    {
      id: '2021-decreto-117-20',
      year: '2021',
      phase: 'Conformidade Regulatória',
      category: 'licensing',
      categoryLabel: 'Estudos & Licenciamento',
      scope: 'Todo o Território Nacional',
      title: 'Alinhamento Integral ao Decreto Presidencial n.º 117/20',
      summary:
        'Actualização completa das metodologias de Avaliação de Impacte Ambiental e Licenciamento para responder com precisão e celeridade às exigências regulamentares angolanas junto das autoridades competentes.',
      impactMetric: '+250',
      impactLabel: 'Estudos, PGA e Relatórios Desenvolvidos',
      deliverables: [
        'Tramitação integral de processos de licenciamento prévio e operacional',
        'Elaboração de Planos de Gestão Ambiental (PGA) e programas de acompanhamento',
        'Apoio técnico em consultas públicas e audições institucionais',
      ],
      iconName: 'Scale',
    },
    {
      id: '2023-monitorizacao-phst',
      year: '2023',
      phase: 'Monitorização & Segurança',
      category: 'operations',
      categoryLabel: 'Resíduos & Monitorização',
      scope: 'Energia, Petróleo & Infra-estruturas',
      title: 'Campanhas Integradas de Monitorização Ambiental, RMA e PHST',
      summary:
        'Lançamento de programas contínuos de controlo de qualidade do ar, água, solos e ruído ambiental, combinados com auditorias ambientais independentes e Planos de Higiene, Saúde e Segurança no Trabalho (PHST).',
      impactMetric: '+120',
      impactLabel: 'Projectos Executados em Múltiplas Províncias',
      deliverables: [
        'Relatórios de Monitorização Ambiental (RMA) com cadeia de custódia auditável',
        'Auditorias de conformidade legal e desempenho ambiental em operação',
        'Programas de prevenção de riscos ocupacionais e formação técnica de equipas',
      ],
      iconName: 'Activity',
    },
    {
      id: '2026-referencia-nacional',
      year: '2025–2026',
      phase: 'Referência Nacional',
      category: 'foundation',
      categoryLabel: 'Fundação & Estratégia',
      scope: 'Centralidade do Kilamba · Âmbito Nacional',
      title: 'Mais de 150 Projectos e 500 Estudos com Actuação em Toda Angola',
      summary:
        'A partir da sede na Centralidade do Kilamba, em Luanda, a BIOSFERA consolida mais de uma década de rigor técnico, superando 150 projectos realizados, 500 estudos desenvolvidos e mais de 80 licenças acompanhadas.',
      impactMetric: '+500',
      impactLabel: 'Estudos e Relatórios · +150 Projectos · +80 Licenças',
      deliverables: [
        'Cobertura técnica em 9 sectores estratégicos da economia angolana',
        'Revisão técnica independente interna em todos os dossiers entregues',
        'Parcerias duradouras com operadores privados e instituições públicas',
      ],
      iconName: 'Award',
    },
  ],
  en: [
    {
      id: '2015-fundacao',
      year: '2015',
      phase: 'Institutional Founding',
      category: 'foundation',
      categoryLabel: 'Foundation & Strategy',
      scope: 'Luanda, Angola',
      title: 'Establishment of BIOSFERA and Early Environmental Diagnostics',
      summary:
        'Official launch of operations in Angola focusing on baseline environmental assessments, regulatory compliance screening, and technical advisory for emerging industrial and commercial facilities.',
      impactMetric: 'Year 1',
      impactLabel: 'National Technical Base in Luanda',
      deliverables: [
        'Creation of an independent Angolan environmental consultancy practice',
        'Initial legal compliance screening dossiers for industrial operators',
        'Internal quality assurance and technical traceability protocols',
      ],
      iconName: 'Compass',
    },
    {
      id: '2017-eia-portos',
      year: '2017',
      phase: 'Technical Expansion',
      category: 'licensing',
      categoryLabel: 'Studies & Permitting',
      scope: 'Industry, Ports & Logistics',
      title: 'Expansion into Full Environmental Impact Assessments (EIA) & Terminals',
      summary:
        'Expanded our multidisciplinary team with environmental engineers, biologists, and field specialists to deliver complete EIAs and coastal monitoring for ports, logistics corridors, and plants.',
      impactMetric: '+30',
      impactLabel: 'Early Technical Studies & Baseline Reports',
      deliverables: [
        'Biophysical, ecological, and socioeconomic baseline field surveys',
        'Comprehensive EIAs for logistics terminals and industrial zones',
        'Context-specific environmental mitigation and compensation plans',
      ],
      iconName: 'FileCheck2',
    },
    {
      id: '2019-residuos',
      year: '2019',
      phase: 'Sector Specialization',
      category: 'operations',
      categoryLabel: 'Waste & Monitoring',
      scope: 'Healthcare, Industry & Construction',
      title: 'Advanced Industrial & Biomedical Waste Management Programs (WMP)',
      summary:
        'Deployed structured waste management frameworks covering source segregation, safe storage, licensed transport routing, and full chain-of-custody tracking for industrial and clinical waste.',
      impactMetric: '+40',
      impactLabel: 'Environmental Permitting Processes Supported',
      deliverables: [
        'Waste Management Plans (WMP) for construction sites and factories',
        'Dedicated infectious and clinical waste protocols for hospitals',
        'Circular recovery and licensed waste diversion pathways',
      ],
      iconName: 'Recycle',
    },
    {
      id: '2021-decreto-117-20',
      year: '2021',
      phase: 'Regulatory Alignment',
      category: 'licensing',
      categoryLabel: 'Studies & Permitting',
      scope: 'Nationwide Scope',
      title: 'Full Methodological Alignment with Presidential Decree No. 117/20',
      summary:
        'Upgraded all EIA and environmental permitting workflows to match Angola’s updated legal framework, streamlining regulatory submissions and authority reviews across provinces.',
      impactMetric: '+250',
      impactLabel: 'Studies, EMPs & Technical Reports Delivered',
      deliverables: [
        'End-to-end management of pre-construction and operational licenses',
        'Structured Environmental Management Plans (EMP) and follow-up programs',
        'Technical representation in public consultations and institutional hearings',
      ],
      iconName: 'Scale',
    },
    {
      id: '2023-monitorizacao-phst',
      year: '2023',
      phase: 'Monitoring & Safety',
      category: 'operations',
      categoryLabel: 'Waste & Monitoring',
      scope: 'Energy, Oil & Gas, Infrastructure',
      title: 'Integrated Environmental Monitoring (EMR), Audits & OHSP',
      summary:
        'Scaled periodic monitoring campaigns for air quality, surface and groundwater, soils, and noise alongside independent environmental audits and Occupational Health & Safety Plans (OHSP).',
      impactMetric: '+120',
      impactLabel: 'Projects Executed Across Angolan Provinces',
      deliverables: [
        'Environmental Monitoring Reports (EMR) with auditable lab chains',
        'Operational legal compliance and environmental performance audits',
        'Workplace risk prevention programs and technical staff training',
      ],
      iconName: 'Activity',
    },
    {
      id: '2026-referencia-nacional',
      year: '2025–2026',
      phase: 'National Benchmark',
      category: 'foundation',
      categoryLabel: 'Foundation & Strategy',
      scope: 'Kilamba HQ · Nationwide Reach',
      title: 'Over 150 Projects & 500 Technical Studies Across Angola',
      summary:
        'Headquartered in Centralidade do Kilamba, Luanda, BIOSFERA marks over a decade of technical rigor—surpassing 150 completed projects, 500 technical studies, and 80+ supported licenses.',
      impactMetric: '+500',
      impactLabel: 'Studies & Reports · +150 Projects · +80 Licenses',
      deliverables: [
        'Technical coverage across 9 strategic sectors of the Angolan economy',
        'Independent internal peer review on every submitted dossier',
        'Long-standing partnerships with private operators and public bodies',
      ],
      iconName: 'Award',
    },
  ],
  zh: [
    {
      id: '2015-fundacao',
      year: '2015',
      phase: '企業創立起步',
      category: 'foundation',
      categoryLabel: '創立與策略佈局',
      scope: '安哥拉羅安達',
      title: 'BIOSFERA 正式成立並展開首批環境基線診斷業務',
      summary:
        '於安哥拉正式展開營運，專注於前期環境現況診斷、環保法規合規評估，並為新設工業與商業開發專案提供獨立技術顧問支援。',
      impactMetric: '創立元年',
      impactLabel: '奠定羅安達本土技術顧問基地',
      deliverables: [
        '建立獨立且嚴謹的安哥拉本土環境顧問團隊',
        '完成首批工業營運商法規適用性評估報告',
        '確立內部品質審查與數據可追溯作業準則',
      ],
      iconName: 'Compass',
    },
    {
      id: '2017-eia-portos',
      year: '2017',
      phase: '專業版圖擴展',
      category: 'licensing',
      categoryLabel: '環評研究與許可',
      scope: '工業、港口與物流',
      title: '全面跨足環境影響評估（EIA）與港口碼頭開發專案',
      summary:
        '擴編環境工程師、生態學家與現場採樣專家組成的跨領域團隊，承接港口碼頭、物流走廊與製造工廠之完整環境影響評估及海岸監測。',
      impactMetric: '+30',
      impactLabel: '完成初期重點環評研究與基線調查報告',
      deliverables: [
        '執行生物物理、生態棲地與社會經濟基線實地調查',
        '完成物流樞紐與港口碼頭開發之環境影響評估報告',
        '擬定貼合安哥拉現地條件的環境減緩與補償方案',
      ],
      iconName: 'FileCheck2',
    },
    {
      id: '2019-residuos',
      year: '2019',
      phase: '產業深度專精',
      category: 'operations',
      categoryLabel: '廢棄物管理與監測',
      scope: '醫療機構、工業與營建',
      title: '推展工業暨醫療廢棄物整合管理計畫（PGR）',
      summary:
        '導入涵蓋源頭分類、安全暫存、合格清運轉介及完整聯單追溯之結構化管理系統，協助工廠、工地與公私立醫院落實有害與醫療廢棄物管理。',
      impactMetric: '+40',
      impactLabel: '累計協助追蹤通過之環境許可審查案件',
      deliverables: [
        '為營建工地與工業園區編製廢棄物管理計畫 (PGR)',
        '建立醫療院所感染性廢棄物專屬安全處置規範',
        '導入循環經濟減量與合法資源化處置路徑',
      ],
      iconName: 'Recycle',
    },
    {
      id: '2021-decreto-117-20',
      year: '2021',
      phase: '法規全面接軌',
      category: 'licensing',
      categoryLabel: '環評研究與許可',
      scope: '涵蓋安哥拉全國各省',
      title: '作業體系全面對接安哥拉第 117/20 號總統令環評新制',
      summary:
        '全面升級環境影響評估與許可申辦流程，精準對應安哥拉最新環境法規架構，大幅提升全國各省主管機關審查溝通效率與核准時程。',
      impactMetric: '+250',
      impactLabel: '累計交付技術研究、PGA 與法規報告數量',
      deliverables: [
        '全流程協助申辦前期建設與正式營運環境許可證',
        '編製環境管理計畫 (PGA) 與定期追蹤查核制度',
        '代表業主出席公開說明會及機構技術審查會議',
      ],
      iconName: 'Scale',
    },
    {
      id: '2023-monitorizacao-phst',
      year: '2023',
      phase: '監測與職安升級',
      category: 'operations',
      categoryLabel: '廢棄物管理與監測',
      scope: '能源、油氣與基礎設施',
      title: '整併環境實測監測（RMA）、環境稽核與職業安全衛生（PHST）',
      summary:
        '大規模推展空氣品質、地表與地下水、土壤及環境噪音定期採樣監測，並結合獨立環境稽核與職業健康安全計畫，守護第一線工程合規。',
      impactMetric: '+120',
      impactLabel: '跨省執行完成之綜合環境專案總數',
      deliverables: [
        '出具具備完整實驗室監管鏈之環境監測報告 (RMA)',
        '針對營運中廠區執行法規遵循與環境績效獨立稽核',
        '規劃職場危害預防機制與企業內部技術人員培訓',
      ],
      iconName: 'Activity',
    },
    {
      id: '2026-referencia-nacional',
      year: '2025–2026',
      phase: '全國標竿里程碑',
      category: 'foundation',
      categoryLabel: '創立與策略佈局',
      scope: '基蘭巴總部・服務全國',
      title: '突破 150 項專案與 500 份專業研究，成為全國環境顧問指標',
      summary:
        '立足羅安達基蘭巴新城總部，BIOSFERA 深耕安哥拉逾十年，累計完成超過 150 個專案、500 份技術研究報告及逾 80 件環境許可輔導。',
      impactMetric: '+500',
      impactLabel: '研究報告 · +150 專案實績 · +80 許可輔導',
      deliverables: [
        '服務橫跨安哥拉九大戰略產業領域與各省市',
        '每份交付報告均通過內部獨立專家同儕複審',
        '與公部門及私營領先企業建立長期技術合作關係',
      ],
      iconName: 'Award',
    },
  ],
};

