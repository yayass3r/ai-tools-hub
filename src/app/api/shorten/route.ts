import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }
    const shortCode = Math.random().toString(36).substring(2, 8);
    const link = await db.shortLink.create({
      data: { shortCode, originalUrl: url },
    });
    return Response.json({ shortCode: link.shortCode });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) {
      return Response.json({ error: 'Code required' }, { status: 400 });
    }
    const link = await db.shortLink.findUnique({ where: { shortCode: code } });
    if (!link) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    await db.shortLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });
    return Response.json({ url: link.originalUrl, clicks: link.clicks + 1 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
