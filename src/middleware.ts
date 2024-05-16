import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes} from "@/route";
import {encode, getToken, JWT} from "@auth/core/jwt";
import {TokenSet} from "next-auth";

let isRefreshing = false;

const sessionCookieName = process.env.NEXTAUTH_URL?.startsWith("https://")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

async function refreshAccessToken(token: JWT): Promise<JWT> {
    if (isRefreshing) {
        return token;
    }
    isRefreshing = true;
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token.refreshToken}`
        }})
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Token refresh failed with status: ${response.status}`);
            }
            return response.json()
        })
        .then((tokenSet: TokenSet) => {
            console.log(`Token is Refreshed!! : ${tokenSet}`);
            return {
                ...token,
                accessToken: tokenSet.access_token,
                refreshToken: tokenSet.refresh_token,
                expiresAt: tokenSet.expires_at
            };
        })
        .catch((error) => {
            console.error(error);
            return token;
        })
        .finally(() => {
            isRefreshing = false;
        });
}

export function updateCookie(
    sessionToken: string | null,
    request: NextRequest,
    response: NextResponse
): NextResponse<unknown> {
    /*
     * BASIC IDEA:
     *
     * 1. Set request cookies for the incoming getServerSession to read new session
     * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
     * 3. Set response cookies to send back to browser
     */

    if (sessionToken) {
        // Set the session token in the request and response cookies for a valid session
        request.cookies.set(sessionCookieName, sessionToken);
        response = NextResponse.next({
            request: {
                headers: request.headers
            }
        });
        response.cookies.set(sessionCookieName, sessionToken, {
            httpOnly: true,
            sameSite: "lax"
        });
    } else {
        request.cookies.delete(sessionCookieName);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return response;
}

export async function middleware(req: NextRequest) {
    const { nextUrl } = req;
    const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });
    const isLoggedIn = token !== null;

    let response = NextResponse.next();

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute || isPublicRoute) {
        // /api/auth or 公開ページはアクセス可能
        return response;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            // すでにログイン済みの場合は、リダイレクトさせる
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        // 未ログインで認証ページの場合は、アクセス可能
        return response;
    }

    // 以降はログインが必要なページの処理
    if (isLoggedIn) {
        const isTokenExpired = token?.expiresAt !== undefined && (Date.now() / 1000) > token?.expiresAt;
        if (isTokenExpired) {
            try {
                const newSessionToken = await encode({
                    salt: sessionCookieName,
                    secret: process.env.AUTH_SECRET!,
                    token: await refreshAccessToken(token),
                });
                response = updateCookie(newSessionToken, req, response);
            } catch (error) {
                console.log("Error refreshing token: ", error);
                return updateCookie(null, req, response);
            }
        }
        return response;
    }
    return Response.redirect(new URL("/auth/login", nextUrl));
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}