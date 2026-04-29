import QRCode from 'qrcode';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, size = 300 } = await req.json();
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return Response.json({ qrCode: dataUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
