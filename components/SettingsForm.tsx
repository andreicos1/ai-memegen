"use client"

import { Button, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"

interface SettingsFormInput {
  prompt: string
  negativePrompt: string
  guidanceScale: number
  steps: number
}

interface Props {
  onSubmit: (data: any) => void
}

function SettingsForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { prompt: "An oil painting of a medieval English town" } })

  return (
    <form className="pt-8 lg:pt-14 max-w-2xl w-full px-6" onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        label="Prompt"
        variant="bordered"
        placeholder="Enter prompt"
        minRows={1}
        isInvalid={!!errors.prompt}
        errorMessage={!!errors.prompt && "Please enter a prompt"}
        classNames={{
          inputWrapper: ["p-0 pb-1"],
          input: ["bg-transparent", "border-[1px] border-white rounded-md", "px-3 py-2", "resize-none"],
        }}
        {...register("prompt", { required: true })}
      />
      <Button type="submit" radius="full" className="bg-primary shadow-lg rounded-full px-5 py-3 mt-3 leading-none">
        Generate Image
      </Button>
    </form>
  )
}

export default SettingsForm
