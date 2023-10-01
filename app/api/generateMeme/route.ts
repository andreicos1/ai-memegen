import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

export const POST = async (request: NextRequest) => {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_TOKEN!,
    })
    const MODEL = "andreasjansson/illusion:75d51a73fce3c00de31ed9ab4358c73e8fc0f627dc8ce975818e653317cb919b"
    const { image, prompt } = await request.json()
    const origin = process.env.IS_PROD !== "false" ? request.headers.get("origin") : "https://ai-memegen.vercel.app"

    console.log(`${origin}/${image}`)

    const output = await replicate.run(MODEL, {
      input: {
        prompt,
        qr_code_content: "",
        image: `${origin}/${image}`,
      },
    })
    return NextResponse.json({ output }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export const config = {
  runtime: "edge",
}
