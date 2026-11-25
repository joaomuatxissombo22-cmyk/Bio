import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { ProposalForm } from '../components/ProposalForm';
import { KilambaMap } from '../components/KilambaMap';
import { PageBanner } from '../components/PageBanner';
import { DynamicHeading } from '../components/DynamicHeading';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { IMG_BANNER_CONTACT } from '../data/defaults';
import { db, handleFirestoreError, OperationType } from '../firebase';

export const ContactPage: React.FC = () => {
  const { settings } = useSite();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'proposta' | 'contacto'>('proposta');

  // General Contact Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sendingContact, setSendingContact] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    if (honeypot.trim() !== '') return;

    if (
      name.trim().length < 2 ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ||
      subject.trim().length < 2 ||
      message.trim().length < 5
    ) {
      setContactError(
        t(
          'Por favor, preencha o nome, e-mail válido, assunto e mensagem.',
          'Please enter your name, a valid email address, subject, and message.'
        )
      );
      return;
    }

    setSendingContact(true);
    try {
      const payload = {
        name: name.trim().slice(0, 140),
        email: email.trim().slice(0, 140),
        phone: phone.trim().slice(0, 40),
        subject: subject.trim().slice(0, 180),
        message: message.trim().slice(0, 3000),
        status: 'novo' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'contacts'), payload).catch((err) =>
        handleFirestoreError(err, OperationType.CREATE, 'contacts')
      );

      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          honeypot,
          summary: {
            id: docRef.id,
            name: payload.name,
            email: payload.email,
            subject: payload.subject,
          },
        }),
      }).catch(() => undefined);

      setContactSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setContactError(
        t(
          'Não foi possível enviar a mensagem. Tente novamente.',
          'Unable to send your message. Please try again.'
        )
      );
    } finally {
      setSendingContact(false);
    }
  };

  const cleanWhatsapp = settings.whatsappNumber.replace(/\D/g, '') || '244939870874';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    t(
      'Olá equipa BIOSFERA, gostaria de obter informações sobre consultoria ambiental.',
      'Hello BIOSFERA team, I would like information about environmental consultancy services.'
    )
  )}`;

  return (
    <>
      <SeoHead
        title={t('Contactos e Solicitação de Proposta', 'Contact & Request a Proposal')}
        description={t(
          'Contacte a BIOSFERA – Consultoria Ambiental, Lda. em Luanda (Centralidade do Kilamba). Telefone, WhatsApp, e-mail, mapa e formulário de proposta.',
          'Contact BIOSFERA – Consultoria Ambiental, Lda. in Luanda (Centralidade do Kilamba). Phone, WhatsApp, email, interactive map, and proposal form.'
        )}
        path="/contactos"
      />

      <PageBanner
        kicker={t('Atendimento Institucional e Técnico', 'Institutional & Technical Support')}
        title={t('Contactos e Pedidos de Proposta', 'Contact & Proposal Requests')}
        alternates={[
          t(
            'Centralidade do Kilamba, Luanda — Atendimento Nacional',
            'Centralidade do Kilamba, Luanda — Nationwide Coverage'
          ),
        ]}
        subtitle={t(
          'Fale directamente com a nossa equipa em Luanda ou submeta os dados do seu projecto para receber uma proposta técnica personalizada.',
          'Speak directly with our Luanda team or submit your project details to receive a tailored technical proposal.'
        )}
        imageUrl={IMG_BANNER_CONTACT}
        imageAlt={t(
          'Fachada moderna do escritório corporativo da BIOSFERA em Luanda',
          'Modern BIOSFERA corporate office facade in Luanda'
        )}
      />

      {/* Main Contact Grid */}
      <section className="py-16 bg-white dark:bg-[#081410]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Direct Contacts + Quick Action Buttons */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#F4F7F5] dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] p-7 space-y-6">
                <div>
                  <DynamicHeading
                    as="h2"
                    kicker={t('Sede Institucional em Luanda', 'Luanda Headquarters')}
                    title="BIOSFERA – CONSULTORIA AMBIENTAL, LDA."
                    titleClassName="!text-xl"
                  />
                </div>

                <div className="space-y-4 text-sm text-[#29332F] dark:text-[#EAF4EE]">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="w-5 h-5 text-[#1B6B4A] dark:text-[#7FD1A8] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-[#1B6B4A] dark:text-[#ECF5F0]">
                        {t('Endereço', 'Address')}
                      </p>
                      <p className="text-[#29332F]/80 dark:text-[#C5DFD1] mt-0.5">
                        {settings.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone
                      className="w-5 h-5 text-[#1B6B4A] dark:text-[#7FD1A8] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-[#1B6B4A] dark:text-[#ECF5F0]">
                        {t('Telefones', 'Phones')}
                      </p>
                      <div className="mt-0.5 space-y-1 font-mono text-xs tabular-nums">
                        <p>
                          <a
                            href={`tel:${settings.phonePrimary.replace(/\s+/g, '')}`}
                            className="hover:text-[#1E7E54] dark:hover:text-[#BCE87D] underline-offset-2 hover:underline"
                          >
                            {settings.phonePrimary}
                          </a>
                        </p>
                        {settings.phoneSecondary && (
                          <p>
                            <a
                              href={`tel:${settings.phoneSecondary.replace(/\s+/g, '')}`}
                              className="hover:text-[#1E7E54] dark:hover:text-[#BCE87D] underline-offset-2 hover:underline"
                            >
                              {settings.phoneSecondary}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      className="w-5 h-5 text-[#1B6B4A] dark:text-[#7FD1A8] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-[#1B6B4A] dark:text-[#ECF5F0]">
                        {t('Correio Electrónico', 'Email')}
                      </p>
                      <div className="mt-0.5 space-y-1 text-xs">
                        <p>
                          <span className="text-[#29332F]/65 dark:text-[#A8CBB9]">
                            {t('Geral', 'General')}:{' '}
                          </span>
                          <a
                            href={`mailto:${settings.generalEmail}`}
                            className="font-medium text-[#1B6B4A] dark:text-[#7FD1A8] hover:underline"
                          >
                            {settings.generalEmail}
                          </a>
                        </p>
                        <p>
                          <span className="text-[#29332F]/65 dark:text-[#A8CBB9]">
                            {t('Recrutamento', 'Recruitment')}:{' '}
                          </span>
                          <a
                            href={`mailto:${settings.recruitmentEmail}`}
                            className="font-medium text-[#1B6B4A] dark:text-[#7FD1A8] hover:underline"
                          >
                            {settings.recruitmentEmail}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Direct Action Buttons */}
                <div className="pt-4 border-t border-neutral-200 dark:border-[#224738] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-[#1E7E54] hover:bg-[#166945] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] rounded-lg transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{t('Falar via WhatsApp', 'Chat on WhatsApp')}</span>
                  </a>
                  <a
                    href={`tel:${settings.phonePrimary.replace(/\s+/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#1B6B4A] dark:text-[#7FD1A8] bg-white dark:bg-[#163127] border border-neutral-300 dark:border-[#2B5946] hover:border-[#1B6B4A] dark:hover:border-[#7FD1A8] rounded-lg transition-colors min-h-[44px]"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>{t('Ligar Agora', 'Call Now')}</span>
                  </a>
                </div>
              </div>

              {/* Google Map */}
              <KilambaMap address={settings.address} />
            </div>

            {/* Right: Tabbed Proposal & Contact Forms */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 p-1 bg-[#F4F7F5] dark:bg-[#0D1E18] rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('proposta')}
                    className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                      activeTab === 'proposta'
                        ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61] shadow-xs'
                        : 'text-[#29332F] dark:text-[#C5DFD1] hover:text-[#1B6B4A] dark:hover:text-[#ECF5F0]'
                    }`}
                  >
                    {t('Solicitar Proposta Técnica', 'Request Technical Proposal')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contacto')}
                    className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                      activeTab === 'contacto'
                        ? 'bg-[#1B6B4A] text-white dark:bg-[#8BC53F] dark:text-[#182C61] shadow-xs'
                        : 'text-[#29332F] dark:text-[#C5DFD1] hover:text-[#1B6B4A] dark:hover:text-[#ECF5F0]'
                    }`}
                  >
                    {t('Formulário de Contacto Geral', 'General Contact Form')}
                  </button>
                </div>

                {activeTab === 'proposta' ? (
                  <div>
                    <div className="mb-5">
                      <DynamicHeading
                        as="h2"
                        title={t(
                          'Formulário de Solicitação de Proposta',
                          'Proposal Request Form'
                        )}
                        titleClassName="!text-xl"
                      />
                      <p className="text-xs sm:text-sm text-[#29332F]/75 dark:text-[#A8CBB9] mt-1">
                        {t(
                          'Preencha os requisitos do seu projecto. A solicitação será encaminhada para',
                          'Complete your project requirements. Your request will be sent to'
                        )}{' '}
                        <span className="font-medium text-[#1B6B4A] dark:text-[#7FD1A8]">
                          {settings.generalEmail}
                        </span>
                        .
                      </p>
                    </div>
                    <ProposalForm />
                  </div>
                ) : (
                  <div>
                    <div className="mb-5">
                      <DynamicHeading
                        as="h2"
                        title={t('Enviar Mensagem Geral', 'Send a General Message')}
                        titleClassName="!text-xl"
                      />
                      <p className="text-xs sm:text-sm text-[#29332F]/75 dark:text-[#A8CBB9] mt-1">
                        {t(
                          'Para questões institucionais, parcerias ou esclarecimentos gerais.',
                          'For institutional inquiries, partnerships, or general questions.'
                        )}
                      </p>
                    </div>

                    {contactSuccess ? (
                      <div className="bg-[#F4F7F5] dark:bg-[#163127] border border-[#1E7E54]/30 dark:border-[#7FD1A8]/35 rounded-xl p-8 text-center">
                        <CheckCircle2
                          className="w-8 h-8 text-[#1E7E54] dark:text-[#8BC53F] mx-auto mb-3"
                          aria-hidden="true"
                        />
                        <h3 className="text-lg font-semibold text-[#1B6B4A] dark:text-[#ECF5F0]">
                          {t('Mensagem Enviada com Sucesso', 'Message Sent Successfully')}
                        </h3>
                        <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] mt-2">
                          {t(
                            'Agradecemos o seu contacto. A nossa equipa responderá com a maior brevidade.',
                            'Thank you for reaching out. Our team will respond promptly.'
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => setContactSuccess(false)}
                          className="mt-5 px-5 py-2.5 text-sm font-medium bg-[#1B6B4A] text-white rounded-lg hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354]"
                        >
                          {t('Enviar Outra Mensagem', 'Send Another Message')}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
                        <input
                          type="text"
                          name="company_website"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          className="hidden"
                        />

                        {contactError && (
                          <div
                            role="alert"
                            className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-sm text-red-800 dark:text-red-200"
                          >
                            {contactError}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
                              {t('Nome Completo *', 'Full Name *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder={t('O seu nome', 'Your full name')}
                              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
                              {t('E-mail *', 'Email *')}
                            </label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={t('nome@empresa.ao', 'name@company.ao')}
                              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
                              {t('Telefone', 'Phone')}
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+244 9XX XXX XXX"
                              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
                              {t('Assunto *', 'Subject *')}
                            </label>
                            <input
                              type="text"
                              required
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              placeholder={t('Assunto do contacto', 'Inquiry subject')}
                              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#29332F] dark:text-[#DCECE3] mb-1.5">
                            {t('Mensagem *', 'Message *')}
                          </label>
                          <textarea
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t(
                              'Escreva a sua mensagem...',
                              'Write your message...'
                            )}
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 dark:border-[#2B5946] bg-white dark:bg-[#0D1E18] text-[#29332F] dark:text-[#ECF5F0] placeholder:text-neutral-400 dark:placeholder:text-[#7DA894]/70 focus:outline-none focus:border-[#1E7E54] dark:focus:border-[#7FD1A8]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={sendingContact}
                          className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-[#1B6B4A] hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] disabled:opacity-60 rounded-lg transition-colors min-h-[44px]"
                        >
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>
                            {sendingContact
                              ? t('A Enviar...', 'Sending...')
                              : t('Enviar Mensagem', 'Send Message')}
                          </span>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
