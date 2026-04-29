'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Loader2, Copy, Check, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useUsage } from '@/hooks/use-usage';

const LANGUAGES = [
  { value: 'English', label: '🇬🇧 English' },
  { value: 'Spanish', label: '🇪🇸 Spanish' },
  { value: 'French', label: '🇫🇷 French' },
  { value: 'German', label: '🇩🇪 German' },
  { value: 'Italian', label: '🇮🇹 Italian' },
  { value: 'Portuguese', label: '🇵🇹 Portuguese' },
  { value: 'Chinese', label: '🇨🇳 Chinese' },
  { value: 'Japanese', label: '🇯🇵 Japanese' },
  { value: 'Korean', label: '🇰🇷 Korean' },
  { value: 'Arabic', label: '🇸🇦 Arabic' },
  { value: 'Hindi', label: '🇮🇳 Hindi' },
  { value: 'Russian', label: '🇷🇺 Russian' },
  { value: 'Dutch', label: '🇳🇱 Dutch' },
  { value: 'Swedish', label: '🇸🇪 Swedish' },
  { value: 'Turkish', label: '🇹🇷 Turkish' },
];

export default function TranslateTool() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, incrementUsage } = useUsage('translate');

  const handleTranslate = async () => {
    if (!text.trim() || loading) return;
    if (remaining <= 0) {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
      return;
    }

    setLoading(true);
    setTranslation('');

    try {
      const canUse = await incrementUsage();
      if (!canUse) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setTranslation(data.translation);
        toast.success('Translation complete!');
      }
    } catch {
      toast.error('Failed to translate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-gray-100">Translator</h3>
        </div>
        <span className="text-xs text-gray-500">{remaining}/{5} uses remaining today</span>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm font-medium">Source Text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate..."
              className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 resize-none min-h-[200px]"
              rows={8}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm font-medium">Translation</Label>
              {translation && (
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-gray-400 hover:text-gray-200"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              )}
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm min-h-[200px] whitespace-pre-wrap">
              {translation || <span className="text-gray-500">Translation will appear here...</span>}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Target Language</Label>
          <Select value={targetLang} onValueChange={setTargetLang} disabled={loading}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 max-h-[240px]">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="text-gray-200 focus:bg-gray-700">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Translate to {targetLang}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
