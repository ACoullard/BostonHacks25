import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // === 1. Generate image using free Pollinations API ===
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    // Optionally verify the image URL works
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error("Failed to fetch image");
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = imgRes.headers.get("content-type") || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // === 2. Return the image as a data URL ===
    return NextResponse.json({ image: dataUrl });
  } catch (err) {
    console.error("Image generation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
