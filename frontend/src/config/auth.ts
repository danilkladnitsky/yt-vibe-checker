export const getApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL

  if (url !== undefined && url !== "") return url.replace(/\/$/, "")
  return "" // same origin
}

export const AUTH_TOKEN_KEY = "yt_vibe_access_token"

export const getAuthCallbackPath = () => "/auth/callback"
