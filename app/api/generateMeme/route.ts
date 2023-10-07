import { checkLimitReached } from "@/app/utils/ipInvocationsCheck"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
  try {
    const isLimitReached = await checkLimitReached(request)
    if (isLimitReached) {
      return NextResponse.json({ error: "Limit reached." }, { status: 429 })
    }

    const illusionDiffusionUrl = "https://54285744-illusion-diffusion.gateway.alpha.fal.ai/fal/queue/submit"
    const { image, prompt, guidanceScale } = await request.json()

    const predictionResponse = await fetch(illusionDiffusionUrl, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        negative_prompt:
          "((frame)), ((framed)), ((framed painting)), signature, signed, bad artist, ugly, nsfw, boring, distorted, poor quality, low quality, low resolution",
        image_url: image,
        num_inference_steps: 50,
        controlnet_conditioning_scale: parseFloat(guidanceScale),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${process.env.FALAI_TOKEN}`,
      },
    })
    const prediction = await predictionResponse.json()

    return NextResponse.json({ id: prediction.request_id }, { status: 200 })
  } catch (error) {
    console.log("Error in generateMeme:", error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
