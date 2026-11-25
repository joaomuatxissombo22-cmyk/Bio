import React, { useEffect, useRef, useState } from 'react';
import { Leaf } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  zoomOnHover?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
  zoomOnHover = false,
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setFailed(false);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1B6B4A] to-[#2EA36F] text-white p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Leaf className="w-8 h-8 text-[#7FD1A8] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-white/90 max-w-[200px]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-[opacity,transform,filter] duration-700 ease-out will-change-transform ${
        loaded ? 'opacity-100' : 'opacity-0'
      } ${zoomOnHover ? 'group-hover:scale-[1.05] hover:scale-[1.04]' : ''}`}
    />
  );
};
