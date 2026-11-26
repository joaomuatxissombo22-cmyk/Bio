import React from 'react';
import { isChristmasSeasonActive } from '../config/festive';

export interface SantaHatOverlayProps {
  /** Override the global festive configuration (`src/config/festive.ts`) if needed. */
  enabled?: boolean;
  /** Optional positioning/sizing classes for placing the hat over the target logo icon. */
  className?: string;
}

/**
 * Componente decorativo condicional de Chapéu de Natal para o logótipo da BIOSFERA.
 * Renderiza apenas quando a época festiva está activa em `src/config/festive.ts`.
 */
export const SantaHatOverlay: React.FC<SantaHatOverlayProps> = ({
  enabled = isChristmasSeasonActive(),
  className = '',
}) => {
  if (!enabled) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none block z-20 animate-santa-hat-sway ${className}`}
    >
      <svg
        viewBox="0 0 120 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_3px_4px_rgba(15,33,27,0.28)]"
      >
        <defs>
          <linearGradient id="biosfera-hat-crimson" x1="16" y1="8" x2="96" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F0383C" />
            <stop offset="52%" stopColor="#CC1922" />
            <stop offset="100%" stopColor="#8E0E16" />
          </linearGradient>
          <linearGradient id="biosfera-hat-sheen" x1="22" y1="16" x2="66" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF8A8A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F0383C" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="biosfera-hat-fur" x1="52" y1="52" x2="52" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="72%" stopColor="#F3F7FA" />
            <stop offset="100%" stopColor="#D7E2EB" />
          </linearGradient>
          <radialGradient id="biosfera-hat-pom" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="72%" stopColor="#F1F6FA" />
            <stop offset="100%" stopColor="#CDDCE7" />
          </radialGradient>
        </defs>

        <g transform="rotate(-11 54 64)">
          {/* Soft shadow grounding the fur trim on the BIOSFERA diamond apex */}
          <ellipse cx="52" cy="72" rx="33" ry="6" fill="#0B1F17" fillOpacity="0.18" />

          {/* Crimson velvet cone and drooping tip */}
          <path
            d="M20 62 C23 32, 42 10, 68 11 C86 12, 98 25, 97 46 C88 44, 80 40, 72 46 C77 51, 80 56, 82 62 Z"
            fill="url(#biosfera-hat-crimson)"
            stroke="#7B0C13"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Soft crown velvet highlight */}
          <path
            d="M28 57 C32 34, 46 18, 65 17 C55 25, 46 38, 44 57 Z"
            fill="url(#biosfera-hat-sheen)"
          />

          {/* Fold shadow beneath drooping tail */}
          <path
            d="M66 36 C75 35, 84 39, 93 45 C85 45, 78 43, 71 47 Z"
            fill="#6E0910"
            fillOpacity="0.34"
          />

          {/* Fluffy white fur cuff */}
          <path
            d="M14 66 C12 59, 18 54, 25 55 C30 51, 40 50, 47 53 C54 50, 65 51, 71 54 C79 53, 88 57, 89 64 C90 71, 83 75, 75 75 C67 77, 56 76, 50 75 C42 77, 30 76, 22 74 C16 74, 15 70, 14 66 Z"
            fill="url(#biosfera-hat-fur)"
            stroke="#B7C8D5"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          {/* Subtle cuff contour highlight */}
          <path
            d="M21 66 C36 62, 65 62, 81 66"
            stroke="#E2EBF2"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Fluffy white pom-pom */}
          <circle
            cx="102"
            cy="51"
            r="10.5"
            fill="url(#biosfera-hat-pom)"
            stroke="#B7C8D5"
            strokeWidth="1.7"
          />
          <circle cx="99" cy="48" r="3.4" fill="#FFFFFF" fillOpacity="0.92" />

          {/* Crisp warm gold star accent */}
          <path
            d="M108 32 L109.5 36.2 L113.8 37.8 L109.5 39.3 L108 43.5 L106.5 39.3 L102.2 37.8 L106.5 36.2 Z"
            fill="#F4B942"
          />
        </g>
      </svg>
    </span>
  );
};
