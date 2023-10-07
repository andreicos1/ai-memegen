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
      credentials: {
        type: "service_account",
        project_id: "ai-memegen",
        private_key_id: process.env.GCS_PRIVATE_KEY_ID,
        private_key: Buffer.from(process.env.GCS_PRIVATE_KEY!, "base64").toString().replace(/\\n/g, "\n"),
        client_email: process.env.GCS_CLIENT_EMAIL,
        client_id: process.env.GCS_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.GCS_CLIENT_CERT_URL,
        universe_domain: "googleapis.com",
      } as any,
    })

    const fileName = `uploaded-images/${Math.random().toString(36).substring(2, 9)}-${Date.now()}.jpg`
    const bucket = storage.bucket("ai-memegen")
    const file = bucket.file(fileName)

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
