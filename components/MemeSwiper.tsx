"use client"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useState } from "react"

import Image from "next/image"
import "swiper/css"
import "swiper/css/pagination"
import ImageUploader from "./ImageUploader"
import Uploady from "@rpldy/uploady"
import UploadedImage from "./UploadedImage"

const origin = process.env.NEXT_PUBLIC_VERCEL_URL || "https://ai-memegen.vercel.app"
const memeImages = [
  {
    id: 1,
    originalImage: "/memes/BuffDogevsCheems.png",
    name: "Buff Doge vs Cheems",
    grayscaleImage: `${origin}/memes-grayscale/BuffDogevsCheems.png`,
  },
  {
    id: 3,
    originalImage: "/memes/DistractedBoyfriend.png",
    name: "Distracted Boyfriend",
    grayscaleImage: `${origin}/memes-grayscale/DistractedBoyfriend.png`,
  },
  {
    id: 4,
    originalImage: "/memes/DrakeHotlineBling.png",
    name: "Drake Hotline Bling",
    grayscaleImage: `${origin}/memes-grayscale/DrakeHotlineBling.png`,
  },
  {
    id: 5,
    originalImage: "/memes/EpicHandshake.png",
    name: "Epic Handshake",
    grayscaleImage: `${origin}/memes-grayscale/EpicHandshake.png`,
  },
  {
    id: 8,
    originalImage: "/memes/SurprisedPikachu.png",
    name: "Surprised Pikachu",
    grayscaleImage: `${origin}/memes-grayscale/SurprisedPikachu.png`,
  },
  {
    id: 9,
    originalImage: "/memes/TwoButtons.png",
    name: "Two Buttons",
    grayscaleImage: `${origin}/memes-grayscale/TwoButtons.png`,
  },
  {
    id: 11,
    originalImage: "/memes/WaitingSkeleon.png",
    name: "Waiting Skeleton",
    grayscaleImage: `${origin}/memes-grayscale/WaitingSkeleon.png`,
  },
  {
    id: 12,
    originalImage: "/memes/WomanYellingAtCat.png",
    name: "Woman Yelling At Cat",
    grayscaleImage: `${origin}/memes-grayscale/WomanYellingAtCat.png`,
  },
  {
    id: 13,
    originalImage: "/memes/ShiddingToothpaste.png",
    name: "Shidding Toothpaste",
    grayscaleImage: `${origin}/memes-grayscale/ShiddingToothpaste.png`,
  },
]

interface Props {
  onSelectMeme: (memeImage: any) => void
  selectedMeme: any
}

function MemeSwiper({ onSelectMeme, selectedMeme }: Props) {
  const [imageFile, setImageFile] = useState("")
  const uploadedImage = { id: 0, name: "Uploaded image", grayscaleImage: imageFile }
  const onUploadImage = (fileUrl: string) => {
    setImageFile(() => fileUrl)
    onSelectMeme(uploadedImage)
  }

  return (
    <div className="max-w-screen-2xl w-full p-6">
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 40,
          },
        }}
      >
        <SwiperSlide>
          <Uploady multiple={false} noPortal destination={{ url: "/api/uploadImage" }}>
            <ImageUploader onUploadImage={onUploadImage} />
          </Uploady>
        </SwiperSlide>
        {imageFile && (
          <SwiperSlide onClick={() => onSelectMeme(uploadedImage)} className="cursor-pointer">
            {selectedMeme?.id === 0 && <p className="absolute -top-[1.75rem]">Uploaded image</p>}
            <UploadedImage imageFile={imageFile} />
          </SwiperSlide>
        )}
        {memeImages.map((memeImage) => {
          return (
            <SwiperSlide
              key={memeImage.id}
              onClick={() => onSelectMeme(memeImage)}
              className={selectedMeme?.id === memeImage.id ? "border-1 border-white" : ""}
            >
              {selectedMeme?.id === memeImage.id && <p className="absolute -top-[1.75rem]">{memeImage.name}</p>}
              <Image
                loading="eager"
                alt={memeImage.name}
                className="object-cover cursor-pointer"
                src={memeImage.originalImage}
                fill
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default MemeSwiper
