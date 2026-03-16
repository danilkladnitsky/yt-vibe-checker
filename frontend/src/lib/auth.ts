import { AUTH_TOKEN_KEY } from "@/config/auth";

export function readStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
}