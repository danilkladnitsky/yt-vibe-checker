import { useAppContext } from "@/app.context"
import { RadialIntro } from "@/components/animate-ui/components/community/radial-intro"
import { useMemo } from "react"


export const LoadingPage = () => {
    const { youtubeSubscriptions, stage } = useAppContext()

    const orbitItems = useMemo(() => {
        return youtubeSubscriptions.map((subscription, index) => ({
            id: index,
            name: subscription.channelTitle,
            src: subscription.channelThumbnail,
        }))
    }, [youtubeSubscriptions])

    const getLoadingText = () => {
        if (stage === "youtube-subscriptions") {
            return <>Fetching<br />YouTube subscriptions...</>
        }

        if (stage === "checking-vibe-words") {
            return <>Checking<br />vibe words...</>
        }

        if (stage === "image-generation-started") {
            return <>Generating<br />vibe image.<br /> Please wait...</>
        }

        return <>Processing<br />vibe words</>
    }


    return (
        <div className="flex items-center justify-center relative">
            <p className="text-sm font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">{getLoadingText()}</p>
            <RadialIntro orbitItems={orbitItems} stageSize={250} imageSize={50} />
        </div>
    )
}
