import { StreamingTextResponse, OpenAIStream, Message, streamText } from 'ai';
import fs from 'fs/promises';
import path from 'path';

const N = 6;
const MESSAGE = `generate a ${N} by ${N} array where the elements are from the list [P, Q]. Must randomly specify one \"starting point\" labelled \"S\", and one \"ending point\" labelled \"F\". The \"P\" elements must and form a complete connected path from \"S\" to \"F\" (diagonals are allowed). The path length should be at least ${N} entries long. Output this array in the format: {\"map\":[[], [], [], [], []]}`;
const MAP_PATH = path.join(process.cwd(), 'public', 'map.json');

export async function POST(req) {
  // Use Vercel AI SDK v5 to call LLM
  const response = await streamText({
    model: 'openai/gpt-4o', // Replace with your model
    messages: [
      { role: 'user', content: MESSAGE }
    ],
    temperature: 0.7,
    responseMimeType: 'application/json',
  });

  let text = '';
  for await (const chunk of response) {
    text += chunk;
  }

  // Store map JSON
  await fs.writeFile(MAP_PATH, text);

  return new Response(text, {
    headers: { 'Content-Type': 'application/json' }
  });
}
