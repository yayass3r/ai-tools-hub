'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PenLine, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useUsage } from '@/hooks/use-usage';

const STYLES = [
  { value: 'professional', label: '👔 Professional' },
  { value: 'casual', label: '😊 Casual' },
  { value: 'academic', label: '🎓 Academic' },
  { value: 'creative', label: '✨ Creative' },
];

export default function RewriteTool() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('professional');
  const [rewritten, setRewritten] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, incrementUsage } = useUsage('rewrite');

  const handleRewrite = async () => {
    if (!text.trim() || loading) return;
    if (remaining <= 0) {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
      return;
    }

    setLoading(true);
    setRewritten('');

    try {
      const canUse = await incrementUsage();
      if (!canUse) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setRewritten(data.rewritten);
        toast.success('Text rewritten successfully!');
      }
    } catch {
      toast.error('Failed to rewrite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewritten);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-gray-100">Text Rewriter</h3>
        </div>
        <span className="text-xs text-gray-500">{remaining}/{5} uses remaining today</span>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Text to Rewrite</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to rewrite..."
            className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 resize-none min-h-[140px]"
            rows={6}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Writing Style</Label>
          <Select value={style} onValueChange={setStyle} disabled={loading}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {STYLES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-gray-200 focus:bg-gray-700">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleRewrite}
          disabled={loading || !text.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rewriting...
            </>
          ) : (
            <>
              <PenLine className="mr-2 h-4 w-4" />
              Rewrite Text
            </>
          )}
        </Button>

        {rewritten && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm font-medium">Rewritten Text</Label>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className="h-7 text-gray-400 hover:text-gray-200"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {rewritten}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
