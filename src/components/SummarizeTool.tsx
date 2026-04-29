'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, Copy, Check, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useUsage } from '@/hooks/use-usage';

export default function SummarizeTool() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, incrementUsage } = useUsage('summarize');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const summaryWordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;

  const handleSummarize = async () => {
    if (!text.trim() || loading) return;
    if (remaining <= 0) {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const canUse = await incrementUsage();
      if (!canUse) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setSummary(data.summary);
        toast.success('Text summarized successfully!');
      }
    } catch {
      toast.error('Failed to summarize. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-gray-100">Text Summarizer</h3>
        </div>
        <span className="text-xs text-gray-500">{remaining}/{5} uses remaining today</span>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-sm font-medium">Input Text</Label>
            <span className="text-xs text-gray-500">{wordCount} words</span>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type the text you want to summarize..."
            className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 resize-none min-h-[180px]"
            rows={8}
            disabled={loading}
          />
        </div>

        <Button
          onClick={handleSummarize}
          disabled={loading || !text.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Summarize Text
            </>
          )}
        </Button>

        {summary && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm font-medium">Summary</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{summaryWordCount} words</span>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-gray-400 hover:text-gray-200"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
            {wordCount > 0 && summaryWordCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <ArrowRightLeft className="h-3 w-3" />
                Reduced from {wordCount} to {summaryWordCount} words ({Math.round((1 - summaryWordCount / wordCount) * 100)}% shorter)
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
