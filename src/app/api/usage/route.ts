import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

const FREE_DAILY_LIMIT = 5;
const DEMO_USER_ID = 'demo-user';

export async function GET(req: NextRequest) {
  try {
    const tool = req.nextUrl.searchParams.get('tool');
    const today = new Date().toISOString().split('T')[0];

    if (tool) {
      const usage = await db.usage.findUnique({
        where: { userId_tool_date: { userId: DEMO_USER_ID, tool, date: today } },
      });
      const count = usage?.count || 0;
      return Response.json({ count, limit: FREE_DAILY_LIMIT, remaining: Math.max(0, FREE_DAILY_LIMIT - count) });
    }

    const usages = await db.usage.findMany({
      where: { userId: DEMO_USER_ID, date: today },
    });
    return Response.json({ usages, limit: FREE_DAILY_LIMIT });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tool } = await req.json();
    const today = new Date().toISOString().split('T')[0];

    const usage = await db.usage.upsert({
      where: { userId_tool_date: { userId: DEMO_USER_ID, tool, date: today } },
      update: { count: { increment: 1 } },
      create: { userId: DEMO_USER_ID, tool, count: 1, date: today },
    });

    return Response.json({ count: usage.count, limit: FREE_DAILY_LIMIT, remaining: Math.max(0, FREE_DAILY_LIMIT - usage.count) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
