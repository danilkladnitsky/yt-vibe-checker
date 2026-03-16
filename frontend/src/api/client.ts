import { QueryClient } from "@tanstack/react-query"
import { readStoredToken } from "@/lib/auth"
import { Api } from "./sdk/Api"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const api = new Api({
  securityWorker: async () => {
    return {
      headers: {
        Authorization: `Bearer ${readStoredToken()}`,
      },
    }
  },
})
