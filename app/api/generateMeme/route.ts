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
    const MODEL = "75d51a73fce3c00de31ed9ab4358c73e8fc0f627dc8ce975818e653317cb919b"
    const { image, prompt, guidanceScale } = await request.json()

    const prediction = await replicate.predictions.create({
      version: MODEL,
      input: {
        prompt,
        qr_code_content: "",
        image,
        num_inference_steps: 50,
        controlnet_conditioning_scale: parseFloat(guidanceScale),
      },
    })
    return NextResponse.json({ id: prediction.id }, { status: 200 })
  } catch (error) {
    console.log("Error in generateMeme:", error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
