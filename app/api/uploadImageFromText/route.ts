import { NextRequest, NextResponse } from "next/server"
import Jimp from "jimp"
import uploadFromMemory from "@/app/utils/uploadFromMemory"
import path from "path"

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No valid text provided" }, { status: 400 })
    }

    const emptyImage = new Jimp(512, 512, "#ffffff")
    let x = 0
    let y = 0

    const jimpFont = path.resolve("./public/jimp/fonts/open-sans/open-sans-64-black/open-sans-64-black.fnt")

    const font = await Jimp.loadFont(jimpFont)
    const image = emptyImage.print(
      font,
      x,
      y,
      {
        text: text.toUpperCase(),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      512,
      512
    )
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
