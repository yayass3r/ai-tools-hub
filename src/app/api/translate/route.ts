import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = 'English' } = await req.json();
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: `You are a professional translator. Translate the given text to ${targetLang}. Only output the translation, nothing else.` },
        { role: 'user', content: text },
      ],
    });
    return Response.json({ translation: completion.choices[0]?.message?.content || '' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
