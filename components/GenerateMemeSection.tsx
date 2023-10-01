"use client"

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
    const response = await fetch("/api/generateMeme", {
      method: "POST",
      body: JSON.stringify({ image: selectedMeme.grayscaleImage, ...values }),
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()
    setOutputImage(data.output[0])
    setIsLoading(false)
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
