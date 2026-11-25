import React from 'react';
import {
  Activity,
  Anchor,
  Building2,
  ClipboardCheck,
  Compass,
  Factory,
  FileSearch,
  Flame,
  HardHat,
  Layers,
  Leaf,
  Recycle,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Truck,
  Zap,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Anchor,
  Building2,
  ClipboardCheck,
  Compass,
  Factory,
  FileSearch,
  Flame,
  HardHat,
  Layers,
  Leaf,
  Recycle,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Truck,
  Zap,
};

export const ServiceIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-5 h-5',
}) => {
  const Icon = ICON_MAP[name] || Leaf;
  return <Icon className={className} aria-hidden="true" />;
};
