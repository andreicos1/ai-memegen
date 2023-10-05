import GenerateMemeSection from "@/components/GenerateMemeSection"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center py-8 md:py-12 lg:py-24 gap-4">
      <h1 className="text-xl text-center">Generate a Stable Diffusion image with any image.</h1>
      <h2 className="text-lg text-center">
        <b> All images are automatically processed for controlnet</b>
        <br />
        <i>More options coming soon...</i>
      </h2>
      <GenerateMemeSection />
    </main>
  )
}
