"use client"
import TrpcProvider from "@/app/_trpc/TrpcProvider"
import { NextUIProvider } from "@nextui-org/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <TrpcProvider>{children}</TrpcProvider>
    </NextUIProvider>
  )
}
