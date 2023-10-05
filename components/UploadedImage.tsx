function UploadedImage({ imageFile }: { imageFile?: string }) {
  return (
    <div className="absolute top-0 bottom-0 right-0 h-full upload-preview-wrapper">
      <img src={imageFile} alt="Uploaded image" />
    </div>
  )
}

export default UploadedImage
