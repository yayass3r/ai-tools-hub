'use client';

import { useSettings } from '@/hooks/use-settings';
import AdBanner from './AdBanner';

interface AdManagerProps {
  position: 'top' | 'bottom' | 'sidebar';
  className?: string;
}

export default function AdManager({ position, className = '' }: AdManagerProps) {
  const { settings, loading } = useSettings();

  if (loading) return null;

  // Check if position should show ads based on settings
  const shouldShow = settings.adPosition === 'both' || settings.adPosition === position;
  if (!shouldShow) return null;

  // Try AdSense first, then Media.net, then Propeller
  if (settings.adsenseEnabled && settings.adsenseClientId) {
    return <AdBanner adType="adsense" position={position} clientId={settings.adsenseClientId} slotId={settings.adsenseSlotId} className={className} />;
  }

  if (settings.mediaNetEnabled && settings.mediaNetCid) {
    return <AdBanner adType="medianet" position={position} cid={settings.mediaNetCid} crid={settings.mediaNetCrid} className={className} />;
  }

  if (settings.propellerEnabled && settings.propellerZoneId) {
    return <AdBanner adType="propeller" position={position} zoneId={settings.propellerZoneId} className={className} />;
  }

  return null;
}
