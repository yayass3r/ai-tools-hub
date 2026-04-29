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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown } from 'lucide-react';
import { toast } from 'sonner';

const toolComponents: Record<string, React.ReactNode> = {
  chat: <ChatTool />,
  image: <ImageTool />,
  summarize: <SummarizeTool />,
  rewrite: <RewriteTool />,
  translate: <TranslateTool />,
  qrcode: <QRCodeTool />,
  shorten: <URLShortenerTool />,
};

export default function Home() {
  const [activeTool, setActiveTool] = useState('');
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleToolChange = (tool: string) => {
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
    setShowPricingDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar
        activeTool={activeTool}
        onToolChange={handleToolChange}
        onSectionClick={handleSectionClick}
      />

      <main className="flex-1">
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
                  {[
                    { id: 'chat', icon: '💬', title: 'AI Chat', desc: 'Conversational AI assistant' },
                    { id: 'image', icon: '🎨', title: 'Image Generator', desc: 'Create images from text prompts' },
                    { id: 'summarize', icon: '📝', title: 'Summarizer', desc: 'Condense long text into key points' },
                    { id: 'rewrite', icon: '✍️', title: 'Text Rewriter', desc: 'Rewrite in different styles' },
                    { id: 'translate', icon: '🌐', title: 'Translator', desc: 'Translate between 15+ languages' },
                    { id: 'qrcode', icon: '📱', title: 'QR Code', desc: 'Generate QR codes instantly' },
                    { id: 'shorten', icon: '🔗', title: 'URL Shortener', desc: 'Shorten URLs with analytics' },
                  ].map((tool, index) => (
                    <motion.button
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleToolChange(tool.id)}
                      className="group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-emerald-500/30 hover:bg-gray-800/80 text-left transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
                    >
                      <div className="text-3xl mb-3">{tool.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Pricing Section */}
        <div ref={pricingRef}>
          <PricingSection onUpgrade={handleUpgrade} />
        </div>
      </main>

      <Footer />

      {/* Upgrade Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-xl">Upgrade to Pro</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Get unlimited access to all AI tools with priority processing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-800 rounded-xl p-4 space-y-2">
              {['Unlimited uses for all tools', 'Priority processing speed', 'Advanced image sizes', 'API access', 'Priority support'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-100">$9.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6"
              onClick={() => {
                toast.success('Thank you for your interest! Payment integration coming soon.');
                setShowPricingDialog(false);
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
