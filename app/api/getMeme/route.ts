import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json()
    const predictionResponse = await fetch(
      `https://54285744-illusion-diffusion.gateway.alpha.fal.ai/fal/queue/${id}/get`,
      {
        headers: {
          Authorization: `Key ${process.env.FALAI_TOKEN}`,
        },
      }
    )

    const prediction = await predictionResponse.json()

    return NextResponse.json({ output: prediction }, { status: 200 })
  } catch (error) {
    console.log("Error in generateMeme:", error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
