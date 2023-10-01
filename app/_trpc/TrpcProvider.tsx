"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { useEffect, useState } from "react"

import { trpc } from "./client"

export default function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [origin, setOrigin] = useState("")
  const [queryClient] = useState(() => new QueryClient({}))
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${origin}/api/trpc`,
        }),
      ],
    })
  )

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
