import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { ProposalForm } from './ProposalForm';

export const ProposalModal: React.FC = () => {
  const { proposalModalOpen, closeProposalModal, preselectedService } = useSite();
  const { t } = useLanguage();

  useEffect(() => {
    if (!proposalModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProposalModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [proposalModalOpen, closeProposalModal]);

  if (!proposalModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#11261E] rounded-2xl border border-neutral-200 dark:border-[#224738] shadow-2xl my-8 overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-neutral-200 dark:border-[#224738] bg-[#F4F7F5] dark:bg-[#0D1E18]">
          <div>
            <p className="text-xs font-semibold text-[#1E7E54] dark:text-[#BCE87D] uppercase tracking-wider">
              {t('BIOSFERA – Consultoria Ambiental', 'BIOSFERA – Environmental Consultancy')}
            </p>
            <h2
              id="proposal-modal-title"
              className="text-xl font-bold text-[#1B6B4A] dark:text-[#7FD1A8] mt-0.5"
            >
              {t('Solicitar Proposta Técnica', 'Request Technical Proposal')}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeProposalModal}
            aria-label={t('Fechar janela', 'Close modal')}
            className="p-2 rounded-lg text-[#29332F]/70 dark:text-[#A8CBB9] hover:text-[#1B6B4A] dark:hover:text-[#BCE87D] hover:bg-white dark:hover:bg-[#163127] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <ProposalForm initialService={preselectedService} compact />
        </div>
      </div>
    </div>
  );
};
