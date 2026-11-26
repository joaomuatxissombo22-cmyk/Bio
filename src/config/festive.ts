/**
 * Configuração sazonal para decorações festivas da BIOSFERA.
 *
 * Como desactivar facilmente após a época festiva:
 * 1) Altere `enableChristmasHat` para `false` abaixo; OU
 * 2) Defina `VITE_CHRISTMAS_THEME=false` nas variáveis de ambiente; OU
 * 3) Ative `autoDateWindow: true` para exibir apenas entre 15 de Novembro e 10 de Janeiro.
 */
export const FESTIVE_CONFIG = {
  enableChristmasHat: import.meta.env.VITE_CHRISTMAS_THEME !== 'false',
  autoDateWindow: false,
} as const;

export function isChristmasSeasonActive(now: Date = new Date()): boolean {
  if (!FESTIVE_CONFIG.enableChristmasHat) {
    return false;
  }
  if (!FESTIVE_CONFIG.autoDateWindow) {
    return true;
  }
  const month = now.getMonth() + 1; // 1–12
  const day = now.getDate();
  return (month === 11 && day >= 15) || month === 12 || (month === 1 && day <= 10);
}
