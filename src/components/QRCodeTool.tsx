'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Loader2, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useUsage } from '@/hooks/use-usage';

const QR_SIZES = [
  { value: '200', label: '200 × 200 (Small)' },
  { value: '300', label: '300 × 300 (Medium)' },
  { value: '400', label: '400 × 400 (Large)' },
  { value: '600', label: '600 × 600 (Extra Large)' },
];

export default function QRCodeTool() {
  const [text, setText] = useState('');
  const [size, setSize] = useState('300');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, incrementUsage } = useUsage('qrcode');

  const handleGenerate = async () => {
    if (!text.trim() || loading) return;
    if (remaining <= 0) {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
      return;
    }

    setLoading(true);
    setQrCode('');

    try {
      const canUse = await incrementUsage();
      if (!canUse) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, size: parseInt(size) }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setQrCode(data.qrCode);
        toast.success('QR Code generated!');
      }
    } catch {
      toast.error('Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
    toast.success('QR Code downloaded!');
  };

  const copyQR = () => {
    if (!qrCode) return;
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    toast.success('QR Code data copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-gray-100">QR Code Generator</h3>
        </div>
        <span className="text-xs text-gray-500">{remaining}/{5} uses remaining today</span>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Text or URL</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com or any text..."
            className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">QR Code Size</Label>
          <Select value={size} onValueChange={setSize} disabled={loading}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {QR_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-gray-200 focus:bg-gray-700">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </>
          )}
        </Button>

        {qrCode && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl inline-block">
                <img src={qrCode} alt="QR Code" className="max-w-[300px]" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={downloadQR}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={copyQR}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? 'Copied' : 'Copy Data'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
