'use client';

import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import type { TranslationKey } from '@/lib/i18n';

interface PricingSectionProps {
  onUpgrade: () => void;
  proEnabled: boolean;
  proPrice: string;
  enterprisePrice: string;
  freeDailyLimit: number;
}

export default function PricingSection({ onUpgrade, proEnabled, proPrice, enterprisePrice, freeDailyLimit }: PricingSectionProps) {
  const { t, isRTL } = useLanguage();

  const plans = [
    {
      nameKey: 'pricing.free' as TranslationKey,
      icon: <Zap className="h-5 w-5" />,
      price: '$0',
      periodKey: 'pricing.free.forever' as TranslationKey,
      descKey: 'pricing.free.desc' as TranslationKey,
      featureKeys: [
        t('pricing.free.feature1', { limit: freeDailyLimit }),
        t('pricing.free.feature2'),
        t('pricing.free.feature3'),
        t('pricing.free.feature4'),
      ],
      ctaKey: 'pricing.free.cta' as TranslationKey,
      highlighted: false,
      color: 'gray',
    },
    {
      nameKey: 'pricing.pro' as TranslationKey,
      icon: <Sparkles className="h-5 w-5" />,
      price: `$${proPrice}`,
      periodKey: 'pricing.pro.perMonth' as TranslationKey,
      descKey: 'pricing.pro.desc' as TranslationKey,
      featureKeys: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4'),
        t('pricing.pro.feature5'),
        t('pricing.pro.feature6'),
        t('pricing.pro.feature7'),
      ],
      ctaKey: 'pricing.pro.cta' as TranslationKey,
      highlighted: true,
      color: 'emerald',
      enabled: proEnabled,
    },
    {
      nameKey: 'pricing.enterprise' as TranslationKey,
      icon: <Building2 className="h-5 w-5" />,
      price: `$${enterprisePrice}`,
      periodKey: 'pricing.enterprise.perMonth' as TranslationKey,
      descKey: 'pricing.enterprise.desc' as TranslationKey,
      featureKeys: [
        t('pricing.enterprise.feature1'),
        t('pricing.enterprise.feature2'),
        t('pricing.enterprise.feature3'),
        t('pricing.enterprise.feature4'),
        t('pricing.enterprise.feature5'),
        t('pricing.enterprise.feature6'),
        t('pricing.enterprise.feature7'),
        t('pricing.enterprise.feature8'),
      ],
      ctaKey: 'pricing.enterprise.cta' as TranslationKey,
      highlighted: false,
      color: 'gray',
    },
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('pricing.subtitle', { limit: freeDailyLimit })}
          </p>
        </motion.div>

        <div className={`grid gap-6 lg:gap-8 ${proEnabled ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl mx-auto'}`}>
          {plans.filter(p => t(p.nameKey) !== t('pricing.pro') || proEnabled).map((plan, index) => (
            <motion.div
              key={t(plan.nameKey)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                  : 'bg-gray-900 border border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.highlighted && (
                <div className={`absolute -top-4 ${isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold`}>
                  {t('pricing.pro.popular')}
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className={plan.highlighted ? 'text-emerald-400' : 'text-gray-400'}>{plan.icon}</span>
                <h3 className="text-xl font-bold text-gray-100">{t(plan.nameKey)}</h3>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-100">{plan.price}</span>
                <span className={`text-gray-500 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t(plan.periodKey)}</span>
              </div>

              <p className="text-gray-400 text-sm mb-6">{t(plan.descKey)}</p>

              <ul className="space-y-3 mb-8">
                {plan.featureKeys.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-emerald-400' : 'text-gray-500'}`} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onUpgrade}
                className={`w-full py-5 rounded-xl font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                }`}
              >
                {t(plan.ctaKey)}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
