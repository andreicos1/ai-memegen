"use client"

import { sleep } from "@/app/utils/others"
import { useState } from "react"
import LoadingBar from "./LoadingBar"
import MemeSwiper from "./MemeSwiper"
import SettingsForm from "./SettingsForm"

function GenerateMemeSection() {
  const [selectedMeme, setSelectedMeme] = useState<any>(null)
  const [noMemeSelectedError, setNoMemeSelectedError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [outputImage, setOutputImage] = useState("")

  const onSelectMeme = (meme: any) => {
    setSelectedMeme(meme)
    setNoMemeSelectedError(false)
  }

  const onSubmit = async (values: any) => {
    if (!selectedMeme) {
      setNoMemeSelectedError(true)
      return
    }
    setIsLoading(true)
    try {
      // Send request to start the generation
      const initialResponse = await fetch("/api/generateMeme", {
        method: "POST",
        body: JSON.stringify({ image: selectedMeme.grayscaleImage, ...values }),
        headers: { "Content-Type": "application/json" },
      })
      const initialData = await initialResponse.json()
      await sleep(9000)

      let status = "pending"
      for (let i = 0; i < 20; i++) {
        const response = await fetch("/api/getMeme", {
          method: "POST",
          body: JSON.stringify({ id: initialData.id }),
          headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()
        status = data.output.status
        console.log({ status })
        if (status === "succeeded") {
          setOutputImage(data.output.output[0])
          break
        }
        if (status === "failed") {
          throw new Error("Failed to generate meme. Sorry :(")
        }
        await sleep(2000)
      }
    } catch (error) {
      alert(
        "Failed to generate meme. Sorry :(. Please try again later, and feel free to reach out if this error persists."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <MemeSwiper selectedMeme={selectedMeme} onSelectMeme={onSelectMeme} />
      {noMemeSelectedError && (
        <div className="max-w-7xl p-6 w-full">
          <p className="text-red">Please select a meme</p>
        </div>
      )}
      <SettingsForm onSubmit={onSubmit} />
      {isLoading && <LoadingBar />}
      {outputImage && <img className="mt-6 lg:mt-10 px-6" src={outputImage} alt="output" />}
    </>
  )
}

export default GenerateMemeSection
