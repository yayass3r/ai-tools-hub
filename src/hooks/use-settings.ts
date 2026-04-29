'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SiteSettings {
  proEnabled: boolean;
  proPrice: string;
  enterprisePrice: string;
  freeDailyLimit: number;
  adsenseEnabled: boolean;
  adsenseClientId: string;
  adsenseSlotId: string;
  adsenseAutoAds: boolean;
  mediaNetEnabled: boolean;
  mediaNetCid: string;
  mediaNetCrid: string;
  propellerEnabled: boolean;
  propellerZoneId: string;
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  adPosition: string;
  adFrequency: number;
}

const defaultSettings: SiteSettings = {
  proEnabled: true,
  proPrice: '9.99',
  enterprisePrice: '49.99',
  freeDailyLimit: 5,
  adsenseEnabled: false,
  adsenseClientId: '',
  adsenseSlotId: '',
  adsenseAutoAds: true,
  mediaNetEnabled: false,
  mediaNetCid: '',
  mediaNetCrid: '',
  propellerEnabled: false,
  propellerZoneId: '',
  siteName: 'AI Tools Hub',
  siteDescription: 'AI-Powered Tools at Your Fingertips',
  maintenanceMode: false,
  adPosition: 'both',
  adFrequency: 3,
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/public');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, refetch: fetchSettings };
}
