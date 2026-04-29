import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = '1024x1024' } = await req.json();
    const zai = await ZAI.create();
    const response = await zai.images.generations.create({
      prompt,
      size,
    });
    return Response.json({ image: response.data[0]?.base64 || '' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
