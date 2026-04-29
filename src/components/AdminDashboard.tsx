'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, DollarSign, Eye, Save,
  Shield, Megaphone, Palette, Server, Users, BarChart3,
  Check, X, AlertTriangle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/use-language';

interface AdminSettings {
  id?: string;
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
  admobEnabled: boolean;
  admobAppId: string;
  admobBannerId: string;
  admobInterstitialId: string;
  adPosition: string;
  adFrequency: number;
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
}

const defaultAdminSettings: AdminSettings = {
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
  admobEnabled: false,
  admobAppId: '',
  admobBannerId: '',
  admobInterstitialId: '',
  adPosition: 'both',
  adFrequency: 3,
  siteName: 'AI Tools Hub',
  siteDescription: 'AI-Powered Tools at Your Fingertips',
  maintenanceMode: false,
};

export default function AdminDashboard() {
  const [settings, setSettings] = useState<AdminSettings>(defaultAdminSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ADMIN_PASSWORD = 'admin2026';
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultAdminSettings, ...data });
      }
    } catch {
      toast.error(t('admin.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultAdminSettings, ...data });
        toast.success(t('admin.saved'));
      } else {
        toast.error(t('admin.saveFailed'));
      }
    } catch {
      toast.error(t('admin.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-3">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-gray-100">{t('admin.access')}</CardTitle>
              <CardDescription className="text-gray-400">{t('admin.enterPassword')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">{t('admin.password')}</Label>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && adminPassword === ADMIN_PASSWORD) {
                        setIsAuthenticated(true);
                      }
                    }}
                    placeholder={t('admin.passwordPlaceholder')}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (adminPassword === ADMIN_PASSWORD) {
                      setIsAuthenticated(true);
                    } else {
                      toast.error(t('admin.invalidPassword'));
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  {t('admin.login')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-400" />
            {t('admin.dashboard')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{t('admin.manage')}</p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          {saving ? <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} /> : <Save className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />}
          {saving ? t('admin.saving') : t('admin.save')}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Server className={`h-4 w-4 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t('admin.general')}
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <DollarSign className={`h-4 w-4 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t('admin.pricing')}
          </TabsTrigger>
          <TabsTrigger value="ads" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Megaphone className={`h-4 w-4 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t('admin.ads')}
          </TabsTrigger>
          <TabsTrigger value="mobile-ads" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Palette className={`h-4 w-4 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{t('admin.mobileAds')}
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Server className="h-5 w-5 text-emerald-400" />{t('admin.siteSettings')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.siteConfig')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">{t('admin.siteName')}</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">{t('admin.siteDescription')}</Label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">{t('admin.maintenanceMode')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">{t('admin.maintenanceDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-400" />{t('admin.freeTier')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.freeTierConfig')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">{t('admin.dailyFreeLimit')}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={settings.freeDailyLimit}
                    onChange={(e) => updateSetting('freeDailyLimit', parseInt(e.target.value) || 5)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('admin.freeLimitHint')}</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-300">{t('admin.freeLimitTip')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />{t('admin.proPlan')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.proConfig')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">{t('admin.enablePro')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">{t('admin.enableProDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.proEnabled}
                    onCheckedChange={(checked) => updateSetting('proEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">{t('admin.proPrice')}</Label>
                  <div className="relative mt-1.5">
                    <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`}>$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={settings.proPrice}
                      onChange={(e) => updateSetting('proPrice', e.target.value)}
                      className={`bg-gray-800 border-gray-700 text-gray-100 ${isRTL ? 'pr-7' : 'pl-7'}`}
                    />
                  </div>
                </div>
                <div className={`rounded-lg p-3 flex items-start gap-2 ${settings.proEnabled ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  {settings.proEnabled ? (
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <p className={`text-xs ${settings.proEnabled ? 'text-emerald-300' : 'text-red-300'}`}>
                    {settings.proEnabled ? t('admin.proActive') : t('admin.proDisabled')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />{t('admin.enterprisePlan')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.enterpriseConfig')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">{t('admin.enterprisePrice')}</Label>
                  <div className="relative mt-1.5">
                    <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`}>$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={settings.enterprisePrice}
                      onChange={(e) => updateSetting('enterprisePrice', e.target.value)}
                      className={`bg-gray-800 border-gray-700 text-gray-100 ${isRTL ? 'pr-7' : 'pl-7'}`}
                    />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{t('admin.enterpriseNote')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">{t('admin.pricePreview')}</CardTitle>
              <CardDescription className="text-gray-400">{t('admin.priceAppear')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl p-4 bg-gray-800 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400">{t('pricing.free')}</p>
                  <p className="text-2xl font-bold text-gray-100">$0</p>
                  <p className="text-xs text-gray-500">{settings.freeDailyLimit} {t('admin.usesPerDay')}</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${settings.proEnabled ? 'bg-emerald-500/10 border-2 border-emerald-500/30' : 'bg-gray-800 border border-gray-700 opacity-50'}`}>
                  <p className="text-sm text-gray-400">{t('pricing.pro')}</p>
                  <p className="text-2xl font-bold text-gray-100">${settings.proPrice}</p>
                  <p className="text-xs text-gray-500">{t('pricing.pro.perMonth')}</p>
                </div>
                <div className="rounded-xl p-4 bg-gray-800 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400">{t('pricing.enterprise')}</p>
                  <p className="text-2xl font-bold text-gray-100">${settings.enterprisePrice}</p>
                  <p className="text-xs text-gray-500">{t('pricing.enterprise.perMonth')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Google AdSense */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-yellow-400" />{t('admin.googleAdsense')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.adsenseDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">{t('admin.enableAdsense')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">{t('admin.enableAdsenseDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.adsenseEnabled}
                    onCheckedChange={(checked) => updateSetting('adsenseEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">{t('admin.adsenseClientId')}</Label>
                  <Input
                    value={settings.adsenseClientId}
                    onChange={(e) => updateSetting('adsenseClientId', e.target.value)}
                    placeholder="ca-pub-xxxxxxxxxx"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.adsenseEnabled}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">{t('admin.adsSlotId')}</Label>
                  <Input
                    value={settings.adsenseSlotId}
                    onChange={(e) => updateSetting('adsenseSlotId', e.target.value)}
                    placeholder="xxxxxxxxxx"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.adsenseEnabled}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('admin.adsAutoHint')}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">{t('admin.autoAds')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">{t('admin.autoAdsDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.adsenseAutoAds}
                    onCheckedChange={(checked) => updateSetting('adsenseAutoAds', checked)}
                    disabled={!settings.adsenseEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media.net */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-blue-400" />{t('admin.mediaNet')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.mediaNetDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">{t('admin.enableMediaNet')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">{t('admin.enableMediaNetDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.mediaNetEnabled}
                    onCheckedChange={(checked) => updateSetting('mediaNetEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">{t('admin.cid')}</Label>
                  <Input
                    value={settings.mediaNetCid}
                    onChange={(e) => updateSetting('mediaNetCid', e.target.value)}
                    placeholder="8XXXXXX"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.mediaNetEnabled}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">{t('admin.crid')}</Label>
                  <Input
                    value={settings.mediaNetCrid}
                    onChange={(e) => updateSetting('mediaNetCrid', e.target.value)}
                    placeholder="8XXXXXX"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.mediaNetEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Propeller Ads */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-purple-400" />{t('admin.propellerAds')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.propellerDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">{t('admin.enablePropeller')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">{t('admin.enablePropellerDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.propellerEnabled}
                    onCheckedChange={(checked) => updateSetting('propellerEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">{t('admin.zoneId')}</Label>
                  <Input
                    value={settings.propellerZoneId}
                    onChange={(e) => updateSetting('propellerZoneId', e.target.value)}
                    placeholder="1234567"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.propellerEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ad Position Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-emerald-400" />{t('admin.adPlacement')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('admin.adPlacementDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">{t('admin.adPosition')}</Label>
                  <Select value={settings.adPosition} onValueChange={(value) => updateSetting('adPosition', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="top">{t('admin.topOnly')}</SelectItem>
                      <SelectItem value="bottom">{t('admin.bottomOnly')}</SelectItem>
                      <SelectItem value="both">{t('admin.bothTopBottom')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">{t('admin.adFrequency')}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={settings.adFrequency}
                    onChange={(e) => updateSetting('adFrequency', parseInt(e.target.value) || 3)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('admin.adFrequencyHint')}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs text-emerald-300">{t('admin.adPriority')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mobile Ads Tab */}
        <TabsContent value="mobile-ads" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <Palette className="h-5 w-5 text-pink-400" />{t('admin.admob')}
              </CardTitle>
              <CardDescription className="text-gray-400">{t('admin.admobDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">{t('admin.enableAdmob')}</Label>
                  <p className="text-xs text-gray-500 mt-0.5">{t('admin.enableAdmobDesc')}</p>
                </div>
                <Switch
                  checked={settings.admobEnabled}
                  onCheckedChange={(checked) => updateSetting('admobEnabled', checked)}
                />
              </div>
              <Separator className="bg-gray-800" />
              <div>
                <Label className="text-gray-300">{t('admin.admobAppId')}</Label>
                <Input
                  value={settings.admobAppId}
                  onChange={(e) => updateSetting('admobAppId', e.target.value)}
                  placeholder="ca-app-pub-xxxxxxxxxx~xxxxxxxxxx"
                  className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  disabled={!settings.admobEnabled}
                />
              </div>
              <div>
                <Label className="text-gray-300">{t('admin.admobBannerId')}</Label>
                <Input
                  value={settings.admobBannerId}
                  onChange={(e) => updateSetting('admobBannerId', e.target.value)}
                  placeholder="ca-app-pub-xxxxxxxxxx/xxxxxxxxxx"
                  className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  disabled={!settings.admobEnabled}
                />
              </div>
              <div>
                <Label className="text-gray-300">{t('admin.admobInterstitialId')}</Label>
                <Input
                  value={settings.admobInterstitialId}
                  onChange={(e) => updateSetting('admobInterstitialId', e.target.value)}
                  placeholder="ca-app-pub-xxxxxxxxxx/xxxxxxxxxx"
                  className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  disabled={!settings.admobEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
