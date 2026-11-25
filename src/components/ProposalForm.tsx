import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, FileText, Paperclip, Send, UploadCloud, X } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SECTORS_LIST } from '../data/defaults';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { localizeSector, localizeService } from '../i18n/translations';

interface ProposalFormProps {
  initialService?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({
  initialService = '',
  onSuccess,
  compact = false,
}) => {
  const { services, settings } = useSite();
  const { lang, t } = useLanguage();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sector, setSector] = useState<string>(SECTORS_LIST[0].name);
  const [serviceRequested, setServiceRequested] = useState<string>(
    initialService || services[0]?.title || 'Estudos de Impacte Ambiental (EIA)'
  );
  const [projectLocation, setProjectLocation] = useState('');
  const [description, setDescription] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setServiceRequested(initialService);
    }
  }, [initialService]);

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Falha ao ler ficheiro'));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (honeypot.trim() !== '') {
      return;
    }

    if (
      companyName.trim().length < 2 ||
      contactName.trim().length < 2 ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ||
      phone.trim().length < 6 ||
      projectLocation.trim().length < 2 ||
      description.trim().length < 10
    ) {
      setErrorMsg(
        t(
          'Por favor, preencha todos os campos obrigatórios com informações válidas (descrição mínima de 10 caracteres).',
          'Please complete all required fields with valid details (minimum 10 characters in description).'
        )
      );
      return;
    }

    setSubmitting(true);
    try {
      let attachmentName = '';
      let attachmentUrl = '';

      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          setErrorMsg(
            t('O documento anexo não pode exceder 5 MB.', 'The attached file cannot exceed 5 MB.')
          );
          setSubmitting(false);
          return;
        }
        attachmentName = selectedFile.name.slice(0, 180);
        try {
          const base64Data = await readFileAsBase64(selectedFile);
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: selectedFile.name,
              mimeType: selectedFile.type || 'application/pdf',
              base64Data,
              honeypot,
            }),
          });
          if (uploadRes.ok) {
            const uploaded = await uploadRes.json();
            attachmentUrl = uploaded.url || '';
            attachmentName = uploaded.fileName || attachmentName;
          }
        } catch {
          attachmentUrl = '';
        }
      }

      const payload = {
        companyName: companyName.trim().slice(0, 160),
        contactName: contactName.trim().slice(0, 140),
        email: email.trim().slice(0, 140),
        phone: phone.trim().slice(0, 40),
        sector: sector.trim().slice(0, 120),
        serviceRequested: serviceRequested.trim().slice(0, 160),
        projectLocation: projectLocation.trim().slice(0, 160),
        description: description.trim().slice(0, 3000),
        attachmentName,
        attachmentUrl,
        status: 'novo' as const,
        adminNotes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'proposals'), payload).catch((err) =>
        handleFirestoreError(err, OperationType.CREATE, 'proposals')
      );

      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'proposal',
          honeypot,
          summary: {
            id: docRef.id,
            companyName: payload.companyName,
            contactName: payload.contactName,
            email: payload.email,
            serviceRequested: payload.serviceRequested,
          },
        }),
      }).catch(() => undefined);

      setSubmittedRef(docRef.id.slice(0, 8).toUpperCase());
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setProjectLocation('');
      setDescription('');
      setSelectedFile(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? t(
              'Não foi possível submeter o pedido. Verifique os dados e tente novamente.',
              'Unable to submit your request. Please verify your entries and try again.'
            )
          : t('Erro ao submeter pedido.', 'Submission error.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="bg-[#F4F7F5] dark:bg-[#163127] border border-[#1E7E54]/30 dark:border-[#7FD1A8]/30 rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#1E7E54]/15 dark:bg-[#1E7E54]/30 text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-[#1B6B4A] dark:text-[#7FD1A8]">
          {t('Solicitação de Proposta Registada', 'Proposal Request Recorded')}
        </h3>
        <p className="text-sm text-[#29332F]/80 dark:text-[#DCECE3] mt-2 max-w-md mx-auto">
          {t(
            'A sua solicitação foi encaminhada para a equipa técnica da BIOSFERA',
            'Your request has been forwarded to the BIOSFERA technical team'
          )}{' '}
          (<span className="font-medium text-[#1B6B4A] dark:text-[#BCE87D]">{settings.generalEmail}</span>).{' '}
          {t('Referência do registo:', 'Reference ID:')}{' '}
          <span className="font-mono font-semibold tabular-nums">#{submittedRef}</span>.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setSubmittedRef(null)}
            className="px-5 py-2.5 text-sm font-medium bg-[#1B6B4A] text-white rounded-lg hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] transition-colors"
          >
            {t('Enviar Novo Pedido', 'Submit New Request')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <input
        type="text"
        name="website_url"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-sm text-red-800 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
            {t('Nome da Empresa *', 'Company Name *')}
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder={t('Ex.: Empresa Industrial de Angola, Lda.', 'e.g., Angola Industrial Corp.')}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#86AE9B] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
            {t('Nome do Responsável *', 'Contact Person *')}
          </label>
          <input
            type="text"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder={t('Nome completo', 'Full name')}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#86AE9B] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
            {t('E-mail Corporativo *', 'Corporate Email *')}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('nome@empresa.ao', 'name@company.ao')}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#86AE9B] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
            {t('Telefone / WhatsApp *', 'Phone / WhatsApp *')}
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+244 9XX XXX XXX"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#86AE9B] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
            {t('Sector de Actividade *', 'Industry Sector *')}
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
          >
            {SECTORS_LIST.map((item) => {
              const loc = localizeSector(item, lang);
              return (
                <option key={item.name} value={item.name}>
                  {loc.name}
                </option>
              );
            })}
            <option value="Saúde e Unidades Hospitalares">
              {t('Saúde e Unidades Hospitalares', 'Healthcare & Hospitals')}
            </option>
            <option value="Comércio e Serviços">
              {t('Comércio e Serviços', 'Commerce & Services')}
            </option>
            <option value="Outro Sector">{t('Outro Sector', 'Other Sector')}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
            {t('Serviço Pretendido *', 'Requested Service *')}
          </label>
          <select
            value={serviceRequested}
            onChange={(e) => setServiceRequested(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
          >
            {services.map((srv) => {
              const loc = localizeService(srv, lang);
              return (
                <option key={srv.id} value={srv.title}>
                  {loc.title}
                </option>
              );
            })}
            <option value="Consultoria Ambiental Integrada">
              {t('Consultoria Ambiental Integrada', 'Integrated Environmental Consultancy')}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
          {t('Localização do Projecto *', 'Project Location *')}
        </label>
        <input
          type="text"
          required
          value={projectLocation}
          onChange={(e) => setProjectLocation(e.target.value)}
          placeholder={t(
            'Ex.: Município de Viana, Província de Luanda',
            'e.g., Viana Municipality, Luanda Province'
          )}
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#86AE9B] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
          {t('Descrição da Necessidade *', 'Project Requirements *')}
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(
            'Descreva o âmbito do projecto, fase actual, prazos pretendidos e requisitos ambientais...',
            'Describe project scope, current stage, target timeline, and environmental requirements...'
          )}
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#86AE9B] focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#8BC53F] focus:ring-1 focus:ring-[#1E7E54]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
          {t(
            'Anexar Documentos de Referência (Opcional — PDF, DOC, DOCX, PNG, JPG até 5 MB)',
            'Attach Reference Documents (Optional — PDF, DOC, DOCX, PNG, JPG up to 5 MB)'
          )}
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#F4F7F5] dark:bg-[#163127] border border-neutral-300 dark:border-[#2B5946] text-[#29332F] dark:text-[#ECF5F0] rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-[#1E3F32] transition-colors">
            <UploadCloud className="w-4 h-4 text-[#1B6B4A] dark:text-[#BCE87D]" aria-hidden="true" />
            <span>{t('Selecionar Ficheiro', 'Choose File')}</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          {selectedFile ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F4F7F5] dark:bg-[#163127] border border-neutral-200 dark:border-[#224738] rounded-lg text-xs text-[#29332F] dark:text-[#ECF5F0]">
              <FileText className="w-3.5 h-3.5 text-[#1E7E54] dark:text-[#BCE87D]" aria-hidden="true" />
              <span className="truncate max-w-[220px]">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                aria-label={t('Remover ficheiro', 'Remove file')}
                className="text-neutral-500 dark:text-[#A8CBB9] hover:text-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-[#29332F]/60 dark:text-[#A8CBB9] inline-flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5" aria-hidden="true" />
              {t(
                'Termos de referência, planta ou memória descritiva',
                'Terms of reference, site map, or technical summary'
              )}
            </span>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] disabled:opacity-60 rounded-lg transition-colors min-h-[44px]"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>
            {submitting
              ? t('A Enviar Solicitação...', 'Sending Request...')
              : t('Submeter Pedido de Proposta', 'Submit Proposal Request')}
          </span>
        </button>
      </div>
    </form>
  );
};
