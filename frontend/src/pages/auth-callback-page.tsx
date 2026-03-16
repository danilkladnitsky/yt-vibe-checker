import { useEffect } from "react";
import { useAppContext } from "@/app.context";
import { AUTH_TOKEN_KEY, getAuthCallbackPath } from "@/config/auth";

function parseHashParams(hash: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!hash.startsWith('#')) return params;
  const pairs = hash.slice(1).split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    if (key && value) params[key] = value;
  }
  return params;
}

export const AuthCallbackPage = () => {
  const { setAccessToken, setIsLoggedIn } = useAppContext();

  useEffect(() => {
    const params = parseHashParams(window.location.hash);
    const accessToken = params.access_token;
    if (accessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      setAccessToken(accessToken);
      setIsLoggedIn(true);
    }
    window.history.replaceState(null, '', '/');
  }, [setAccessToken, setIsLoggedIn]);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground">Completing sign in…</p>
    </div>
  );
};

export function isAuthCallbackPath(): boolean {
  return typeof window !== 'undefined' && window.location.pathname === getAuthCallbackPath();
}
