'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link2, Loader2, Copy, Check, ExternalLink, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { useUsage } from '@/hooks/use-usage';

export default function URLShortenerTool() {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [clicks, setClicks] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkingClicks, setCheckingClicks] = useState(false);
  const { remaining, incrementUsage } = useUsage('shorten');

  const handleShorten = async () => {
    if (!url.trim() || loading) return;
    if (remaining <= 0) {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
      return;
    }

    let processedUrl = url.trim();
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }

    setLoading(true);
    setShortCode('');
    setClicks(null);

    try {
      const canUse = await incrementUsage();
      if (!canUse) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: processedUrl }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setShortCode(data.shortCode);
        toast.success('URL shortened successfully!');
      }
    } catch {
      toast.error('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const shortUrl = `${window.location.origin}/api/shorten?code=${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Short URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const checkClicks = async () => {
    if (!shortCode) return;
    setCheckingClicks(true);
    try {
      const res = await fetch(`/api/shorten?code=${shortCode}`);
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setClicks(data.clicks);
      }
    } catch {
      toast.error('Failed to fetch analytics.');
    } finally {
      setCheckingClicks(false);
    }
  };

  const shortUrl = shortCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/shorten?code=${shortCode}` : '';

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-gray-100">URL Shortener</h3>
        </div>
        <span className="text-xs text-gray-500">{remaining}/{5} uses remaining today</span>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Long URL</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url..."
            className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
            disabled={loading}
          />
        </div>

        <Button
          onClick={handleShorten}
          disabled={loading || !url.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            <>
              <Link2 className="mr-2 h-4 w-4" />
              Shorten URL
            </>
          )}
        </Button>

        {shortCode && (
          <div className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-gray-300">Short URL</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-3">
                <code className="text-emerald-400 text-sm flex-1 truncate">{shortUrl}</code>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-200 flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Code: <span className="text-gray-300 font-mono">{shortCode}</span></span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={checkClicks}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                disabled={checkingClicks}
              >
                {checkingClicks ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="mr-2 h-4 w-4" />
                )}
                Check Clicks
              </Button>
              <Button
                onClick={() => window.open(shortUrl, '_blank')}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit URL
              </Button>
            </div>

            {clicks !== null && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{clicks}</div>
                <div className="text-sm text-gray-400">total clicks</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
