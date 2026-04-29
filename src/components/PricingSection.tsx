'use client';

import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PricingSectionProps {
  onUpgrade: () => void;
}

const plans = [
  {
    name: 'Free',
    icon: <Zap className="h-5 w-5" />,
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI tools',
    features: [
      '5 uses per tool per day',
      'All 7 AI tools',
      'Basic response quality',
      'Community support',
    ],
    cta: 'Current Plan',
    highlighted: false,
    color: 'gray',
  },
  {
    name: 'Pro',
    icon: <Sparkles className="h-5 w-5" />,
    price: '$9.99',
    period: '/month',
    description: 'Unlimited power for professionals',
    features: [
      'Unlimited uses',
      'All 7 AI tools',
      'Priority response quality',
      'Faster processing',
      'Advanced image sizes',
      'Priority support',
      'API access',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
    color: 'emerald',
  },
  {
    name: 'Enterprise',
    icon: <Building2 className="h-5 w-5" />,
    price: '$49.99',
    period: '/month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom AI models',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'Analytics dashboard',
      'Admin controls',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    color: 'gray',
  },
];

export default function PricingSection({ onUpgrade }: PricingSectionProps) {
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free with 5 daily uses per tool. Upgrade to Pro for unlimited access and priority processing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className={plan.highlighted ? 'text-emerald-400' : 'text-gray-400'}>{plan.icon}</span>
                <h3 className="text-xl font-bold text-gray-100">{plan.name}</h3>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-100">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>

              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
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
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
