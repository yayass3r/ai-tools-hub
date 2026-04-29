'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
}

export default function HeroSection({ onGetStarted, onViewPricing }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-gray-950 to-teal-950/30" />

      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-1/3 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            7 AI-Powered Tools — All in One Place
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              AI-Powered Tools
            </span>
            <br />
            <span className="text-gray-100">at Your Fingertips</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10">
            Chat, generate images, summarize, rewrite, translate, create QR codes, and shorten URLs — all powered by cutting-edge AI. Start free, upgrade when you need more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/20"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onViewPricing}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100 px-8 py-6 text-lg rounded-xl"
            >
              View Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">7</div>
              <div className="text-sm text-gray-500">AI Tools</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-teal-400">5/day</div>
              <div className="text-sm text-gray-500">Free Uses</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">$9.99</div>
              <div className="text-sm text-gray-500">Pro/month</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
