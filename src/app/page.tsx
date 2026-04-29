'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ChatTool from '@/components/ChatTool';
import ImageTool from '@/components/ImageTool';
import SummarizeTool from '@/components/SummarizeTool';
import RewriteTool from '@/components/RewriteTool';
import TranslateTool from '@/components/TranslateTool';
import QRCodeTool from '@/components/QRCodeTool';
import URLShortenerTool from '@/components/URLShortenerTool';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';
import AdManager from '@/components/AdManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';
import { useLanguage } from '@/hooks/use-language';
import type { TranslationKey } from '@/lib/i18n';

const toolComponents: Record<string, React.ReactNode> = {
  chat: <ChatTool />,
  image: <ImageTool />,
  summarize: <SummarizeTool />,
  rewrite: <RewriteTool />,
  translate: <TranslateTool />,
  qrcode: <QRCodeTool />,
  shorten: <URLShortenerTool />,
};

const toolGrid = [
  { id: 'chat', icon: '💬', titleKey: 'tools.chat.title' as TranslationKey, descKey: 'tools.chat.desc' as TranslationKey },
  { id: 'image', icon: '🎨', titleKey: 'tools.image.title' as TranslationKey, descKey: 'tools.image.desc' as TranslationKey },
  { id: 'summarize', icon: '📝', titleKey: 'tools.summarize.title' as TranslationKey, descKey: 'tools.summarize.desc' as TranslationKey },
  { id: 'rewrite', icon: '✍️', titleKey: 'tools.rewrite.title' as TranslationKey, descKey: 'tools.rewrite.desc' as TranslationKey },
  { id: 'translate', icon: '🌐', titleKey: 'tools.translate.title' as TranslationKey, descKey: 'tools.translate.desc' as TranslationKey },
  { id: 'qrcode', icon: '📱', titleKey: 'tools.qrcode.title' as TranslationKey, descKey: 'tools.qrcode.desc' as TranslationKey },
  { id: 'shorten', icon: '🔗', titleKey: 'tools.shorten.title' as TranslationKey, descKey: 'tools.shorten.desc' as TranslationKey },
];

const upgradeFeatureKeys: TranslationKey[] = [
  'upgrade.feature1',
  'upgrade.feature2',
  'upgrade.feature3',
  'upgrade.feature4',
  'upgrade.feature5',
];

export default function Home() {
  const [activeTool, setActiveTool] = useState('');
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);
  const { settings, loading } = useSettings();
  const { t, isRTL } = useLanguage();

  const handleToolChange = (tool: string) => {
    if (tool === 'admin') {
      setShowAdmin(true);
      setActiveTool('');
      return;
    }
    setShowAdmin(false);
    setActiveTool(tool);
    setTimeout(() => {
      document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSectionClick = (section: string) => {
    if (section === 'pricing') {
      pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    setActiveTool('chat');
    setTimeout(() => {
      document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUpgrade = () => {
    if (!settings.proEnabled) {
      toast.info(t('upgrade.unavailable'));
      return;
    }
    setShowPricingDialog(true);
  };

  // Maintenance mode
  if (!loading && settings.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">{t('maintenance.title')}</h1>
          <p className="text-gray-400 mb-6">{t('maintenance.desc', { name: settings.siteName })}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {t('maintenance.refresh')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar
        activeTool={activeTool}
        onToolChange={handleToolChange}
        onSectionClick={handleSectionClick}
        onAdminClick={() => handleToolChange('admin')}
        proEnabled={settings.proEnabled}
      />

      <main className="flex-1">
        {showAdmin ? (
          <section className="py-8">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <AdminDashboard />
            </div>
          </section>
        ) : (
          <>
            {/* Top Ad */}
            <AdManager position="top" className="mx-auto max-w-4xl px-4 pt-4" />

            {/* Hero Section */}
            <HeroSection onGetStarted={handleGetStarted} onViewPricing={() => handleSectionClick('pricing')} />

            {/* Tools Section */}
            <section id="tools-section" className="py-16 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent" />
              <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                  {activeTool ? (
                    <motion.div
                      key={activeTool}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {toolComponents[activeTool]}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tool-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {toolGrid.map((tool, index) => (
                        <motion.button
                          key={tool.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 }}
                          onClick={() => handleToolChange(tool.id)}
                          className={`group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-emerald-500/30 hover:bg-gray-800/80 ${isRTL ? 'text-right' : 'text-left'} transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5`}
                        >
                          <div className={`text-3xl mb-3`}>{tool.icon}</div>
                          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
                            {t(tool.titleKey)}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{t(tool.descKey)}</p>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Pricing Section */}
            <div ref={pricingRef}>
              <PricingSection
                onUpgrade={handleUpgrade}
                proEnabled={settings.proEnabled}
                proPrice={settings.proPrice}
                enterprisePrice={settings.enterprisePrice}
                freeDailyLimit={settings.freeDailyLimit}
              />
            </div>

            {/* Bottom Ad */}
            <AdManager position="bottom" className="mx-auto max-w-4xl px-4 pb-4" />
          </>
        )}
      </main>

      <Footer />

      {/* Upgrade Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-xl">{t('upgrade.title')}</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              {t('upgrade.desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-800 rounded-xl p-4 space-y-2">
              {upgradeFeatureKeys.map((key) => (
                <div key={key} className="flex items-center gap-2 text-sm text-gray-300">
                  <Sparkles className={`h-3.5 w-3.5 text-emerald-400 flex-shrink-0 ${isRTL ? 'ml-0' : 'mr-0'}`} />
                  {t(key)}
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-100">${settings.proPrice}</span>
              <span className="text-gray-500">{t('upgrade.perMonth')}</span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6"
              onClick={() => {
                toast.success(t('upgrade.thanks'));
                setShowPricingDialog(false);
              }}
            >
              <Sparkles className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              {t('upgrade.cta')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
