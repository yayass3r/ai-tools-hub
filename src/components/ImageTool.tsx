'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, Loader2, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useUsage } from '@/hooks/use-usage';

const SIZES = [
  { value: '1024x1024', label: '1024 × 1024 (Square)' },
  { value: '768x1344', label: '768 × 1344 (Portrait)' },
  { value: '1344x768', label: '1344 × 768 (Landscape)' },
];

export default function ImageTool() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { remaining, incrementUsage } = useUsage('image');

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    if (remaining <= 0) {
      toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
      return;
    }

    setLoading(true);
    setImage('');

    try {
      const canUse = await incrementUsage();
      if (!canUse) {
        toast.error('Daily limit reached! Upgrade to Pro for unlimited uses.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setImage(data.image);
        toast.success('Image generated successfully!');
      }
    } catch {
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image}`;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
    toast.success('Image downloaded!');
  };

  const copyBase64 = () => {
    if (!image) return;
    navigator.clipboard.writeText(`data:image/png;base64,${image}`);
    setCopied(true);
    toast.success('Image data copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-gray-100">AI Image Generator</h3>
        </div>
        <span className="text-xs text-gray-500">{remaining}/{5} uses remaining today</span>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Describe your image</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city with flying cars and neon lights at sunset..."
            className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 resize-none min-h-[100px]"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-sm font-medium">Image Size</Label>
          <Select value={size} onValueChange={setSize} disabled={loading}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-gray-200 focus:bg-gray-700">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>

        {image && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-800 p-2">
              <img
                src={`data:image/png;base64,${image}`}
                alt="Generated"
                className="w-full rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={downloadImage}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={copyBase64}
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
