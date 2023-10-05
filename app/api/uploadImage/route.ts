import { NextRequest, NextResponse } from "next/server"
import Jimp from "jimp"
import { put } from "@vercel/blob"

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
    const blob = await put("my-image.jpg", imageBuffer, { access: "public" })

    return NextResponse.json({ url: blob.url }, { status: response.status })
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
