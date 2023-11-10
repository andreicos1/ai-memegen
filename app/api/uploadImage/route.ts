import { NextRequest, NextResponse } from "next/server"
import Jimp from "jimp"
import uploadFromMemory from "@/app/utils/uploadFromMemory"

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("file")

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json({ error: "No valid image file provided" }, { status: 400 })
    }

    const arrayBuffer = await imageFile.arrayBuffer()
    const image = await Jimp.read(arrayBuffer as any)

    image.grayscale().contrast(0.4)
    const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)
    const fileName = `uploaded-images/${Math.random().toString(36).substring(2, 9)}-${Date.now()}.jpg`

    await uploadFromMemory(imageBuffer, fileName)

    return NextResponse.json(
      { url: `https://storage.googleapis.com/ai-memegen/${fileName}` },
      { status: response.status }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
