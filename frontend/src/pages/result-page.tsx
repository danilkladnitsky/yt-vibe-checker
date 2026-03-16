import { useAppContext } from "@/app.context"
import { RippleButton } from "@/components/animate-ui/components/buttons/ripple"
import { motion } from "motion/react"

// const MOCK_RESULT = {
//     imageUrl: "http://localhost:3000/generation.jpg",
//     vibeWords: ["test", "test", "test", "test", "test"],
// }

export const ResultPage = () => {
    const { result } = useAppContext();

    const checkAgain = () => {
        window.location.replace("/");
    }


    if (!result) {
        return null;
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl p-12">
            <motion.h1 className="mb-4 text-4xl font-bold">
                You literally like
            </motion.h1>
            <motion.img
                initial={{ opacity: 0, scale: 0.9, }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src={result.imageUrl}
                alt="Result"
                className="mb-4 aspect-square rounded-md object-cover"
            />
            <div className="flex flex-col gap-2 mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-2xl font-bold"
                >
                    Your vibe words
                </motion.h2>
                <ul className="list-none text-center">
                    {result.vibeWords.map((word, index) => (
                        <motion.li
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 1.5 }}
                            key={index}
                        >
                            {word}
                        </motion.li>
                    ))}
                </ul>
            </div>
            <div className="flex gap-2">
                <RippleButton size="lg" className="gap-1" variant='outline' onClick={checkAgain}>
                    Check again
                </RippleButton>
                <RippleButton size="lg" className="gap-1" variant='outline' disabled onClick={() => { }}>
                    Share
                </RippleButton>
            </div>
        </div>
    )
}
