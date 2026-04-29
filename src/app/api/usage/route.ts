import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

const DEMO_USER_ID = 'demo-user';

async function getFreeLimit(): Promise<number> {
  try {
    let settings = await db.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await db.settings.create({ data: { id: 'global' } });
    }
    return settings.freeDailyLimit;
  } catch {
    return 5;
  }
}

export async function GET(req: NextRequest) {
  try {
    const tool = req.nextUrl.searchParams.get('tool');
    const today = new Date().toISOString().split('T')[0];
    const freeLimit = await getFreeLimit();

    if (tool) {
      const usage = await db.usage.findUnique({
        where: { userId_tool_date: { userId: DEMO_USER_ID, tool, date: today } },
      });
      const count = usage?.count || 0;
      return Response.json({ count, limit: freeLimit, remaining: Math.max(0, freeLimit - count) });
    }

    const usages = await db.usage.findMany({
      where: { userId: DEMO_USER_ID, date: today },
    });
    return Response.json({ usages, limit: freeLimit });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tool } = await req.json();
    const today = new Date().toISOString().split('T')[0];
    const freeLimit = await getFreeLimit();

    const usage = await db.usage.upsert({
      where: { userId_tool_date: { userId: DEMO_USER_ID, tool, date: today } },
      update: { count: { increment: 1 } },
      create: { userId: DEMO_USER_ID, tool, count: 1, date: today },
    });

    return Response.json({ count: usage.count, limit: freeLimit, remaining: Math.max(0, freeLimit - usage.count) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
