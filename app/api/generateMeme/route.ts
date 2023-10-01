import { checkLimitReached } from "@/app/utils/ipInvocationsCheck"
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

export const POST = async (request: NextRequest) => {
  try {
    const isLimitReached = await checkLimitReached(request)
    if (isLimitReached) {
      return NextResponse.json({ error: "Limit reached." }, { status: 429 })
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_TOKEN!,
    })
    const MODEL = "andreasjansson/illusion:75d51a73fce3c00de31ed9ab4358c73e8fc0f627dc8ce975818e653317cb919b"
    const { image, prompt } = await request.json()
    const origin = process.env.IS_PROD !== "false" ? request.headers.get("origin") : "https://ai-memegen.vercel.app"

    const output = await replicate.run(MODEL, {
      input: {
        prompt,
        qr_code_content: "",
        image: `${origin}/${image}`,
        num_inference_steps: 50,
        controlnet_conditioning_scale: 1.8,
      },
    })
    return NextResponse.json({ output }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

// export const runtime = "edge"
