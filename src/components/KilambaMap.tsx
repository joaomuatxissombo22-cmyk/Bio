import React, { useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  APILoadingStatus,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Coordenadas da Centralidade do Kilamba, Belas, Luanda, Angola
const KILAMBA_COORDS = { lat: -8.9994, lng: 13.2665 };

const MapMarkerContent: React.FC<{ address: string }> = ({ address }) => {
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return null;
  }

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={KILAMBA_COORDS}
        onClick={() => setInfoOpen((prev) => !prev)}
        title="BIOSFERA – Consultoria Ambiental, Lda."
      >
        <Pin background="#1B6B4A" borderColor="#8BC53F" glyphColor="#FFFFFF" />
      </AdvancedMarker>
      {infoOpen && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={() => setInfoOpen(false)}>
          <div className="p-1 text-[#29332F]">
            <p className="font-semibold text-sm text-[#1B6B4A]">
              BIOSFERA – Consultoria Ambiental, Lda.
            </p>
            <p className="text-xs text-[#29332F]/80 mt-1">{address}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const KilambaMap: React.FC<{ address: string }> = ({ address }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [mapFailed, setMapFailed] = useState(false);
  const { lang, t } = useLanguage();

  const mapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Centralidade do Kilamba Edificio Q19 Belas Luanda Angola'
  )}`;

  if (!apiKey || mapFailed) {
    return (
      <div className="w-full h-[380px] rounded-xl border border-neutral-200 dark:border-[#224738] bg-[#F4F7F5] dark:bg-[#11261E] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#1B6B4A]/10 dark:bg-[#1E7E54]/25 text-[#1B6B4A] dark:text-[#BCE87D] flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-[#1B6B4A] dark:text-[#7FD1A8]">
          {t('Localização da Sede – Luanda, Angola', 'Headquarters Location – Luanda, Angola')}
        </h3>
        <p className="text-sm text-[#29332F]/80 dark:text-[#C5DFD1] max-w-md mt-2">{address}</p>
        <p className="text-xs font-mono text-[#29332F]/60 dark:text-[#A8CBB9] mt-2 tabular-nums">
          8°59&apos;57.8&quot;S 13°15&apos;59.4&quot;E
        </p>
        <a
          href={mapsExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#1B6B4A] text-white rounded-lg hover:bg-[#1E7E54] dark:bg-[#8BC53F] dark:text-[#182C61] dark:hover:bg-[#9FD354] transition-colors"
        >
          <span>{t('Abrir no Google Maps', 'Open in Google Maps')}</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden border border-neutral-200 dark:border-[#224738] relative bg-[#F4F7F5] dark:bg-[#11261E]">
      <APIProvider
        apiKey={apiKey}
        libraries={['marker']}
        language={lang}
        region="AO"
        onError={() => setMapFailed(true)}
      >
        <GoogleMap
          mapId="DEMO_MAP_ID"
          defaultCenter={KILAMBA_COORDS}
          defaultZoom={15}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <MapMarkerContent address={address} />
        </GoogleMap>
      </APIProvider>
    </div>
  );
};
