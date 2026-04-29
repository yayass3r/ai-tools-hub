import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, style = 'professional' } = await req.json();
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: `You are a text rewriting expert. Rewrite the given text in a ${style} style while preserving the original meaning. Use the same language as the input text.` },
        { role: 'user', content: `Please rewrite the following text in a ${style} style:\n\n${text}` },
      ],
    });
    return Response.json({ rewritten: completion.choices[0]?.message?.content || '' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
