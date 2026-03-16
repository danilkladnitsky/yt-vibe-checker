/* eslint-disable react-refresh/only-export-components -- AppProvider is the context provider, not a page component */
import { useCallback, useMemo, useState } from "react"
import { getStrictContext } from "./lib/get-strict-context"
import type { Result } from "@shared/result"
import { AUTH_TOKEN_KEY, getApiBaseUrl } from "@/config/auth"
import { readStoredToken } from "./lib/auth"
import { useCreateLlmResponse } from "./api/mutations/useCreateLlmResponse"
import type { YoutubeSubscription } from "@shared/youtube"

type Stage = "youtube-subscriptions" | "checking-vibe-words" | "image-generation-started" | "image-generation-result"

type AppContext = {
    isLoggedIn: boolean
    result: Result | null
    isLoading: boolean
    accessToken: string | null
    youtubeSubscriptions: YoutubeSubscription[]
    stage: Stage
    logout: () => void
    setYoutubeSubscriptions: (youtubeSubscriptions: YoutubeSubscription[]) => void
    checkVibe: () => void
    setStage: (stage: Stage) => void
    setIsLoggedIn: (isLoggedIn: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    setResult: (result: Result) => void
    setAccessToken: (token: string | null) => void
    loginWithGoogle: () => void
}

export const [Provider, useAppContext] =
    getStrictContext<AppContext>("AppContext")

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [stage, setStage] = useState<Stage>("youtube-subscriptions")

    const [accessToken, setAccessTokenState] = useState<string | null>(
        readStoredToken
    )
    const [result, setResult] = useState<Result | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [youtubeSubscriptions, setYoutubeSubscriptions] = useState<
        YoutubeSubscription[]
    >([])

    const { mutateAsync: createLlmResponse } = useCreateLlmResponse()

    const checkVibe = useCallback(() => {
        setStage("youtube-subscriptions")
        createLlmResponse()
    }, [createLlmResponse])

    const setAccessToken = useCallback((token: string | null) => {
        setAccessTokenState(token)
        if (token) localStorage.setItem(AUTH_TOKEN_KEY, token)
        else localStorage.removeItem(AUTH_TOKEN_KEY)
    }, [])

    const setIsLoggedIn = useCallback((loggedIn: boolean) => {
        if (!loggedIn) {
            setAccessTokenState(null)
            localStorage.removeItem(AUTH_TOKEN_KEY)
        }
    }, [])

    const logout = useCallback(() => {
        setAccessTokenState(null)
        localStorage.removeItem(AUTH_TOKEN_KEY)
        setIsLoggedIn(false)
    }, [setIsLoggedIn])

    const isLoggedIn = Boolean(accessToken)

    const loginWithGoogle = useCallback(() => {
        const base = getApiBaseUrl()

        window.location.href = base ? `${base}/auth/google` : "/auth/google"
    }, [])

    const value = useMemo(
        () => ({
            isLoggedIn,
            setIsLoggedIn,
            result,
            setResult,
            isLoading,
            setIsLoading,
            youtubeSubscriptions,
            setYoutubeSubscriptions,
            accessToken,
            setAccessToken,
            loginWithGoogle,
            checkVibe,
            logout,
            stage,
            setStage,
        }),
        [
            isLoggedIn,
            result,
            isLoading,
            accessToken,
            checkVibe,
            setAccessToken,
            setIsLoggedIn,
            loginWithGoogle,
            logout,
            youtubeSubscriptions,
            setYoutubeSubscriptions,
            stage,
            setStage,
        ]
    )

    return <Provider value={value}>{children}</Provider>
}

export const withAppContext = <T extends object>(
    Component: React.ComponentType<T>
) => {
    return (props: React.ComponentProps<typeof Component>) => (
        <AppProvider>
            <Component {...props} />
        </AppProvider>
    )
}
