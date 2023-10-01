import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

export const POST = async (request: NextRequest) => {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_TOKEN!,
    })
    const { id } = await request.json()
    const prediction = await replicate.predictions.get(id)

    return NextResponse.json({ output: prediction }, { status: 200 })
  } catch (error) {
    console.log("Error in generateMeme:", error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
