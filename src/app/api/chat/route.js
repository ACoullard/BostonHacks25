import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

import { determineAction } from '@/lib/actions/resources';

// place holder function which just feeds the message history straight into
// gemini and sends back the results in the proper format.
// export async function POST(req) {
//   const { messages } = await req.json(); // a list of all messages so far

//   // this is the most recent message
//   console.log("last message: ", messages[messages.length - 1]);

//   const resultStream = await streamText({
//     model: google('gemini-2.0-flash-lite'),
//     messages: convertToModelMessages(messages),
//   });

//   return resultStream.toUIMessageStreamResponse();
// }

// ACTUAL FUNCTION PLAN

export async function POST(req) {

  // get the desired action
  const { messages } = await req.json(); // a list of all messages so far

  const last_message = messages[messages.length - 1]
  
  console.log("recent text: ", last_message.parts[0].text)
  const result = await determineAction(last_message.parts[0].text)
  
  const resultStream = await streamText({
    model: google('gemini-2.5-flash-lite'),
    system: result.prompt,
    messages: convertToModelMessages(messages),
  });

  return resultStream.toUIMessageStreamResponse();
}

// inputs: All messages so far
// outputs:
//  description: a text description to output. This is what the user will see
//  action-type: a tag for what type of action was taken, this should be from a list of defined types.
