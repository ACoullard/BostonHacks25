import { getCurrentLocationDescription } from '@/lib/actions/resources';



export async function GET(req) {
    const description = await getCurrentLocationDescription();
    console.log("ss description", description);
    return new Response(JSON.stringify({description: description}), {
        headers: { 'Content-Type': 'application/json' },
      });
}