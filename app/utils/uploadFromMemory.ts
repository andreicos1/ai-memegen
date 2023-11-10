import { Storage } from "@google-cloud/storage"

const uploadFromMemory = async (imageBuffer: Buffer, fileName: string) => {
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

  const bucket = storage.bucket("ai-memegen")
  const file = bucket.file(fileName)

  const [response] = await file.generateSignedPostPolicyV4({
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { "x-goog-meta-test": "data" },
  })
  const { url, fields } = response
  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append("file", new Blob([imageBuffer]))
  return await fetch(url, {
    method: "POST",
    body: formData,
  })
}

export default uploadFromMemory
