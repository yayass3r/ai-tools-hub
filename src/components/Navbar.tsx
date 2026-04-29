'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Sun, Moon, Wrench, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/hooks/use-language';
import type { TranslationKey } from '@/lib/i18n';

const toolKeys = [
  { id: 'chat', labelKey: 'nav.chat' as TranslationKey, icon: '💬' },
  { id: 'image', labelKey: 'nav.image' as TranslationKey, icon: '🎨' },
  { id: 'summarize', labelKey: 'nav.summarize' as TranslationKey, icon: '📝' },
  { id: 'rewrite', labelKey: 'nav.rewrite' as TranslationKey, icon: '✍️' },
  { id: 'translate', labelKey: 'nav.translate' as TranslationKey, icon: '🌐' },
  { id: 'qrcode', labelKey: 'nav.qrcode' as TranslationKey, icon: '📱' },
  { id: 'shorten', labelKey: 'nav.shorten' as TranslationKey, icon: '🔗' },
];

interface NavbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onSectionClick: (section: string) => void;
  onAdminClick: () => void;
  proEnabled: boolean;
}

export default function Navbar({ activeTool, onToolChange, onSectionClick, onAdminClick, proEnabled }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              AI Tools Hub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {toolKeys.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTool === tool.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <span className={isRTL ? 'ml-1' : 'mr-1'}>{tool.icon}</span>
                {t(tool.labelKey)}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-gray-400 hover:text-emerald-400"
              title={language === 'en' ? 'العربية' : 'English'}
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-400 hover:text-gray-200"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onAdminClick}
              className="text-gray-400 hover:text-emerald-400"
              title={t('nav.admin')}
            >
              <Wrench className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSectionClick('pricing')}
              className="hidden sm:flex text-gray-400 hover:text-gray-200"
            >
              {t('nav.pricing')}
            </Button>
            {proEnabled && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium"
                onClick={() => onSectionClick('pricing')}
              >
                {t('nav.upgradePro')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {toolKeys.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onToolChange(tool.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTool === tool.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <span className={isRTL ? 'ml-2' : 'mr-2'}>{tool.icon}</span>
                  {t(tool.labelKey)}
                </button>
              ))}
              <button
                onClick={() => {
                  onSectionClick('pricing');
                  setMobileMenuOpen(false);
                }}
                className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/50`}
              >
                💰 {t('nav.pricing')}
              </button>
              <button
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-gray-800/50`}
              >
                🔧 {t('nav.admin')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
