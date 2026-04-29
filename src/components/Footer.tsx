'use client';

import { Sparkles, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
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
              Powerful AI tools for everyone. Chat, create, translate, and more — all in one platform.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Tools</h4>
            <ul className="space-y-2">
              {['AI Chat', 'Image Generator', 'Summarizer', 'Text Rewriter', 'Translator', 'QR Code', 'URL Shortener'].map((tool) => (
                <li key={tool}>
                  <span className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    {tool}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI Tools Hub. All rights reserved.
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
