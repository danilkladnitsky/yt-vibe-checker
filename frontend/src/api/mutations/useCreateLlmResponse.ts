import { useMutation } from "@tanstack/react-query"
import { api } from "../client"

export const useCreateLlmResponse = () => {
  return useMutation({
    mutationFn: () =>
      api.vibe
        .vibeControllerCreateVibe({ secure: true })
        .then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.error(error)
    },
  })
}
