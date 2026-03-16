import { useSocket } from "./api/ws/useSocket";
import { useAppContext, withAppContext } from "./app.context";
import { GravityStarsBackground } from "./components/animate-ui/components/backgrounds/gravity-stars"
import { AuthCallbackPage, isAuthCallbackPath } from "./pages/auth-callback-page";
import { LoadingPage } from "./pages/loading-page";
import { MainPage } from "./pages/main-page"
import { ResultPage } from "./pages/result-page";

export function App() {
  const { result, isLoading } = useAppContext();

  useSocket()



  if (isAuthCallbackPath()) {
    return <AuthCallbackPage />;
  }

  const getPage = () => {
    if (isLoading) {
      return <LoadingPage />;
    }

    if (!result) {
      return <MainPage />;
    }

    return <ResultPage />;
  }

  return (
    <div className="flex min-h-svh p-8 align-middle justify-center items-center">
      <GravityStarsBackground mouseGravity='repel' className="absolute inset-0 z-0" starsInteraction={false} />
      <div className="relative z-10 max-w-md mx-auto">
        {getPage()}
      </div>
    </div>
  )
}

export default withAppContext(App);
