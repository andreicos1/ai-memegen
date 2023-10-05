"use client"

import { asUploadButton } from "@rpldy/upload-button"
import { useItemFinalizeListener, useItemStartListener } from "@rpldy/uploady"
import { ButtonHTMLAttributes, ForwardedRef, forwardRef, useState } from "react"
import UploadIcon from "./icons/UploadIcon"

interface Props {
  onUploadImage: (file: any) => void
  initialImage?: string | null
}

const MyUploadButton = asUploadButton(
  forwardRef(function MyButton(props: ButtonHTMLAttributes<HTMLButtonElement>, ref: ForwardedRef<HTMLButtonElement>) {
    return <button type="button" ref={ref} {...props} />
  })
)

MyUploadButton.displayName = "MyUploadButton"

export default function UploadProfilePicture({ onUploadImage, initialImage }: Props) {
  useItemFinalizeListener((item) => {
    onUploadImage(item.uploadResponse?.data.url)
  })

  return (
    <div className="h-full border-[1px] border-gray-500 relative">
      <MyUploadButton className="flex flex-col justify-center h-full items-center box-content w-full">
        <UploadIcon className="fill-primary w-6 h-6 mb-2" />
        <p className="text-center text-sm px-3 text-primary font-semibold">Upload your own image</p>
      </MyUploadButton>
    </div>
  )
}
