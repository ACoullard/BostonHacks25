import { getCurrentLocationDescription } from '@/lib/actions/resources';



export async function GET(req) {
    const description = await getCurrentLocationDescription();
    return new Response(JSON.stringify({description: description}), {
        headers: { 'Content-Type': 'application/json' },
      });
}