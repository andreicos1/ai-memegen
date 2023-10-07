import { NextRequest, NextResponse } from "next/server"
import Jimp from "jimp"
import { Storage } from "@google-cloud/storage"

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
    const storage = new Storage({
      projectId: "memegen-ai",
      keyFilename: "./google-cloud-storage-key.json",
    })

    const bucket = storage.bucket("ai-memegen")
    const file = bucket.file("uploaded-images/plm.jpg")

    const fileUrl = await new Promise((resolve, reject) => {
      file.save(imageBuffer, async (err) => {
        if (!err) {
          resolve(file.publicUrl())
        } else {
          console.log("error " + err)
          reject(err)
        }
      })
    })

    return NextResponse.json({ url: fileUrl }, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
