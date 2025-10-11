import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export async function POST(req) {
  const { messages } = await req.json();

  const resultStream = await streamText({
    model: google('gemini-2.0-flash-lite'),
    messages: convertToModelMessages(messages),
  });

  return resultStream.toUIMessageStreamResponse();
}



// return a text description to output. This is what the user will see
// return a tag for what type of action was taken.