import { useAppContext } from "@/app.context"
import type { Result } from "@shared/result"
import type { YoutubeSubscription } from "@shared/youtube"
import { useEffect } from "react"
import { io } from "socket.io-client"

const SOCKET_URL = "ws://localhost:8080"

const socketClient = io(SOCKET_URL)

export const useSocket = () => {
  const { setResult, setIsLoading, setYoutubeSubscriptions, setStage } =
    useAppContext()

  useEffect(() => {
    socketClient.on(
      "youtube-subscriptions",
      (subscriptions: YoutubeSubscription[]) => {
        setIsLoading(true)
        setYoutubeSubscriptions(subscriptions)
        setStage("checking-vibe-words")
      }
    )
    socketClient.on("image-generation-started", () => {
      setStage("image-generation-started")
    })
    socketClient.on("image-generation-result", (result: Result) => {
      setIsLoading(false)
      setStage("image-generation-result")
      setResult(result)
    })
    return () => {
      socketClient.off("youtube-subscriptions")
      socketClient.off("image-generation-result")
      socketClient.off("image-generation-started")
    }
  }, [])
}
