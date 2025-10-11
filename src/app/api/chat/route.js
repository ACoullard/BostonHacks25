import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req) {
  const { messages } = await req.json();

  const resultStream = await streamText({
    model: google('gemini-2.0-flash-lite-001'),
    messages: convertToModelMessages(messages),
  });

  return resultStream.toUIMessageStreamResponse();
}
