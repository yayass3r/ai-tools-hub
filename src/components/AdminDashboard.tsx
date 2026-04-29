'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, DollarSign, Eye, EyeOff, Save,
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
      toast.error('Failed to load settings');
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
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Failed to save settings');
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
              <CardTitle className="text-gray-100">Admin Access</CardTitle>
              <CardDescription className="text-gray-400">Enter admin password to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Password</Label>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && adminPassword === ADMIN_PASSWORD) {
                        setIsAuthenticated(true);
                      }
                    }}
                    placeholder="Enter admin password"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (adminPassword === ADMIN_PASSWORD) {
                      setIsAuthenticated(true);
                    } else {
                      toast.error('Invalid password');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  Login to Dashboard
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
            Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage your AI Tools Hub platform</p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Server className="h-4 w-4 mr-1.5" />General
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <DollarSign className="h-4 w-4 mr-1.5" />Pricing
          </TabsTrigger>
          <TabsTrigger value="ads" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Megaphone className="h-4 w-4 mr-1.5" />Ads
          </TabsTrigger>
          <TabsTrigger value="mobile-ads" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Palette className="h-4 w-4 mr-1.5" />Mobile Ads
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Server className="h-5 w-5 text-emerald-400" />Site Settings
                </CardTitle>
                <CardDescription className="text-gray-400">Basic site configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Site Name</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Site Description</Label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Maintenance Mode</Label>
                    <p className="text-xs text-gray-500 mt-0.5">Show maintenance page to visitors</p>
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
                  <Users className="h-5 w-5 text-emerald-400" />Free Tier
                </CardTitle>
                <CardDescription className="text-gray-400">Configure free user limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Daily Free Limit (per tool)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={settings.freeDailyLimit}
                    onChange={(e) => updateSetting('freeDailyLimit', parseInt(e.target.value) || 5)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of free uses per tool per day</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-300">Lower limits encourage more upgrades. Recommended: 3-5 per day.</p>
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
                  <DollarSign className="h-5 w-5 text-emerald-400" />Pro Plan
                </CardTitle>
                <CardDescription className="text-gray-400">Configure Pro subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Enable Pro Plan</Label>
                    <p className="text-xs text-gray-500 mt-0.5">Show Pro upgrade option</p>
                  </div>
                  <Switch
                    checked={settings.proEnabled}
                    onCheckedChange={(checked) => updateSetting('proEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">Pro Price (USD/month)</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={settings.proPrice}
                      onChange={(e) => updateSetting('proPrice', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 pl-7"
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
                    {settings.proEnabled ? 'Pro plan is active and visible to users.' : 'Pro plan is disabled. Users will only see the free tier.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />Enterprise Plan
                </CardTitle>
                <CardDescription className="text-gray-400">Configure Enterprise plan pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Enterprise Price (USD/month)</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={settings.enterprisePrice}
                      onChange={(e) => updateSetting('enterprisePrice', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 pl-7"
                    />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Enterprise plan is always visible when Pro is enabled. It includes team features, custom models, and SLA guarantees.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Price Preview</CardTitle>
              <CardDescription className="text-gray-400">How pricing appears to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl p-4 bg-gray-800 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400">Free</p>
                  <p className="text-2xl font-bold text-gray-100">$0</p>
                  <p className="text-xs text-gray-500">{settings.freeDailyLimit} uses/day</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${settings.proEnabled ? 'bg-emerald-500/10 border-2 border-emerald-500/30' : 'bg-gray-800 border border-gray-700 opacity-50'}`}>
                  <p className="text-sm text-gray-400">Pro</p>
                  <p className="text-2xl font-bold text-gray-100">${settings.proPrice}</p>
                  <p className="text-xs text-gray-500">/month</p>
                </div>
                <div className="rounded-xl p-4 bg-gray-800 border border-gray-700 text-center">
                  <p className="text-sm text-gray-400">Enterprise</p>
                  <p className="text-2xl font-bold text-gray-100">${settings.enterprisePrice}</p>
                  <p className="text-xs text-gray-500">/month</p>
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
                  <Megaphone className="h-5 w-5 text-yellow-400" />Google AdSense
                </CardTitle>
                <CardDescription className="text-gray-400">Google display advertising</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Enable AdSense</Label>
                    <p className="text-xs text-gray-500 mt-0.5">Show Google ads on your site</p>
                  </div>
                  <Switch
                    checked={settings.adsenseEnabled}
                    onCheckedChange={(checked) => updateSetting('adsenseEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">AdSense Client ID</Label>
                  <Input
                    value={settings.adsenseClientId}
                    onChange={(e) => updateSetting('adsenseClientId', e.target.value)}
                    placeholder="ca-pub-xxxxxxxxxx"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.adsenseEnabled}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Ad Slot ID</Label>
                  <Input
                    value={settings.adsenseSlotId}
                    onChange={(e) => updateSetting('adsenseSlotId', e.target.value)}
                    placeholder="xxxxxxxxxx"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.adsenseEnabled}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for auto ads</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Auto Ads</Label>
                    <p className="text-xs text-gray-500 mt-0.5">Let Google place ads automatically</p>
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
                  <Megaphone className="h-5 w-5 text-blue-400" />Media.net
                </CardTitle>
                <CardDescription className="text-gray-400">Yahoo! Bing contextual ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Enable Media.net</Label>
                    <p className="text-xs text-gray-500 mt-0.5">Show Yahoo/Bing ads</p>
                  </div>
                  <Switch
                    checked={settings.mediaNetEnabled}
                    onCheckedChange={(checked) => updateSetting('mediaNetEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">CID</Label>
                  <Input
                    value={settings.mediaNetCid}
                    onChange={(e) => updateSetting('mediaNetCid', e.target.value)}
                    placeholder="8XXXXXX"
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                    disabled={!settings.mediaNetEnabled}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">CRID</Label>
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
                  <Megaphone className="h-5 w-5 text-purple-400" />Propeller Ads
                </CardTitle>
                <CardDescription className="text-gray-400">Pop-under and display ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Enable Propeller Ads</Label>
                    <p className="text-xs text-gray-500 mt-0.5">Show Propeller ads</p>
                  </div>
                  <Switch
                    checked={settings.propellerEnabled}
                    onCheckedChange={(checked) => updateSetting('propellerEnabled', checked)}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <Label className="text-gray-300">Zone ID</Label>
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
                  <Eye className="h-5 w-5 text-emerald-400" />Ad Placement
                </CardTitle>
                <CardDescription className="text-gray-400">Control where and how often ads appear</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Ad Position</Label>
                  <Select value={settings.adPosition} onValueChange={(value) => updateSetting('adPosition', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="top">Top Only</SelectItem>
                      <SelectItem value="bottom">Bottom Only</SelectItem>
                      <SelectItem value="both">Both Top & Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Ad Frequency</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={settings.adFrequency}
                    onChange={(e) => updateSetting('adFrequency', parseInt(e.target.value) || 3)}
                    className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Show ad every N tool uses</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs text-emerald-300">Active ad networks are tried in priority order: AdSense &rarr; Media.net &rarr; Propeller Ads</p>
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
                <Palette className="h-5 w-5 text-pink-400" />AdMob (Mobile App Ads)
              </CardTitle>
              <CardDescription className="text-gray-400">Google AdMob for mobile app monetization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Enable AdMob</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Show AdMob mobile ads</p>
                </div>
                <Switch
                  checked={settings.admobEnabled}
                  onCheckedChange={(checked) => updateSetting('admobEnabled', checked)}
                />
              </div>
              <Separator className="bg-gray-800" />
              <div>
                <Label className="text-gray-300">AdMob App ID</Label>
                <Input
                  value={settings.admobAppId}
                  onChange={(e) => updateSetting('admobAppId', e.target.value)}
                  placeholder="ca-app-pub-xxxxxxxxxx~xxxxxxxxxx"
                  className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  disabled={!settings.admobEnabled}
                />
              </div>
              <div>
                <Label className="text-gray-300">Banner Ad Unit ID</Label>
                <Input
                  value={settings.admobBannerId}
                  onChange={(e) => updateSetting('admobBannerId', e.target.value)}
                  placeholder="ca-app-pub-xxxxxxxxxx/xxxxxxxxxx"
                  className="bg-gray-800 border-gray-700 text-gray-100 mt-1.5"
                  disabled={!settings.admobEnabled}
                />
              </div>
              <div>
                <Label className="text-gray-300">Interstitial Ad Unit ID</Label>
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
