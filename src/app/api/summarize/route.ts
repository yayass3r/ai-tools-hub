import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a text summarization expert. Provide clear, concise summaries that capture the key points. Use the same language as the input text.' },
        { role: 'user', content: `Please summarize the following text:\n\n${text}` },
      ],
    });
    return Response.json({ summary: completion.choices[0]?.message?.content || '' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
