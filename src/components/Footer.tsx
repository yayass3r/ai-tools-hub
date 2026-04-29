'use client';

import { Sparkles, Github, Twitter, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import type { TranslationKey } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();

  const toolLabels: TranslationKey[] = [
    'tools.chat.title',
    'tools.image.title',
    'tools.summarize.title',
    'tools.rewrite.title',
    'tools.translate.title',
    'tools.qrcode.title',
    'tools.shorten.title',
  ];

  const companyLabels: TranslationKey[] = [
    'footer.about',
    'footer.blog',
    'footer.careers',
    'footer.press',
    'footer.partners',
  ];

  const legalLabels: TranslationKey[] = [
    'footer.privacy',
    'footer.terms',
    'footer.cookies',
    'footer.gdpr',
  ];

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                AI Tools Hub
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {t('footer.desc')}
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">{t('footer.tools')}</h4>
            <ul className="space-y-2">
              {toolLabels.map((key) => (
                <li key={key}>
                  <span className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {companyLabels.map((key) => (
                <li key={key}>
                  <span className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              {legalLabels.map((key) => (
                <li key={key}>
                  <span className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI Tools Hub. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
              <Github className="h-5 w-5" />
            </span>
            <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
              <Twitter className="h-5 w-5" />
            </span>
            <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
              <Mail className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
