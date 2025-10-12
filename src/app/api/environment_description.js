import { streamText } from 'ai';

export async function POST(req) {
  const { environment_choice } = await req.json();
  const MESSAGE = `write me a paragraph of 4 sentences with a description of the ${environment_choice} environment, include details of what the user might see, feel and hear in the surroundings.`;

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

  return new Response(text, {
    headers: { 'Content-Type': 'application/json' }
  });
}
