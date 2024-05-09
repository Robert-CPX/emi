// app/api/tts/route.ts
import { NextRequest, NextResponse } from "next/server";

const TTS_BACKEND_URL = process.env.TTS_BACKEND_URL;

export async function GET() {
  return NextResponse.json({ Hello: "World" });
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Missing 'text' field in request body" }, { status: 400 });
  }

  try {
    // Make a POST request to the FastAPI TTS endpoint using fetch
    const response = await fetch(`${TTS_BACKEND_URL}?text=${encodeURIComponent(text)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error in TTS service request: ${response.status} ${errorText}`);
    }

    // Fetch the audio content as an ArrayBuffer
    const audioArrayBuffer = await response.arrayBuffer();
    const audioContent = Buffer.from(audioArrayBuffer);

    // Convert Node.js readable stream to Web Stream using Web Streams API
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(audioContent);
        controller.close();
      },
    });

    // Set appropriate headers for the response
    const headers = new Headers({
      "Content-Type": "audio/wav",
      "Content-Disposition": "attachment; filename=output.wav",
    });

    return new NextResponse(readableStream, { headers });
  } catch (error) {
    console.error("Error in TTS API:", error);
    return NextResponse.json({ error: "Text-to-Speech service error" }, { status: 500 });
  }
}
