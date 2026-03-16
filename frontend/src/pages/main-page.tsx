import { useAppContext } from "@/app.context";
import { RippleButton, RippleButtonRipples } from "@/components/animate-ui/components/buttons/ripple"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
import { LogIn } from "@/components/animate-ui/icons/log-in"

export const MainPage = () => {
    const { loginWithGoogle, checkVibe, isLoggedIn, logout } = useAppContext();

    return (
        <main className="text-center">
            <h1 className="font-bold text-4xl mb-2 text-center">
                YouTube Vibe Checker
            </h1>
            {!isLoggedIn && <p className="mb-4 text-center">Login with your YouTube account<br />to start vibin'</p>}
            {isLoggedIn && <p className="mb-4 text-center">Click the button below to check your vibe!</p>}
            {!isLoggedIn && <RippleButton size="lg" className="gap-1" variant='outline' onClick={loginWithGoogle}>
                Login
                <LogIn animateOnHover />
                <AnimateIcon animateOnHover>
                    <LogIn />
                </AnimateIcon>
                <RippleButtonRipples />
            </RippleButton>}
            {isLoggedIn && <div className="flex flex-col gap-2">
                <RippleButton size="lg" className="gap-1" onClick={checkVibe}>
                    Check my vibe
                </RippleButton>
                <RippleButton size="lg" className="gap-1" variant='outline' onClick={logout}>
                    Log out
                </RippleButton>
            </div>}
        </main>
    )
}
