export const WsEvents = {
  // When user receives his youtube subscriptions
  YOUTUBE_SUBSCRIPTIONS: "youtube-subscriptions",
  // When user receives his image generation
  IMAGE_GENERATION_STARTED: "image-generation-started",
  // When user receives his vibe result
  IMAGE_GENERATION_RESULT: "image-generation-result",
  // Ping-pong
  PING: "ping",
} as const;
