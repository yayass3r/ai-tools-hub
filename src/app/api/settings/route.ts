import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

// GET - fetch all settings
export async function GET() {
  try {
    let settings = await db.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await db.settings.create({ data: { id: 'global' } });
    }
    return Response.json(settings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}

// PUT - update settings (admin only - in production add auth)
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    let settings = await db.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await db.settings.create({ data: { id: 'global', ...data } });
    } else {
      settings = await db.settings.update({
        where: { id: 'global' },
        data,
      });
    }
    return Response.json(settings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
