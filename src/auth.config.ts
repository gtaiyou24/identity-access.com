import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import {apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes} from "@/route";
import {ExtendedUser} from "@/next-auth";
import {TokenSet} from "@auth/core/types";

const refreshToken = async (refreshToken: string): Promise<TokenSet> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${refreshToken}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const json = await response.json();
    return json as TokenSet;
}

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            token: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github/token`,
            userinfo: {
                async request({ tokens }: { tokens: TokenSet }) {
                    // Backend API で返却されたアクセストークンをもとにプロフィール情報を取得する
                    const me = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
                        headers: { 'Authorization': `bearer ${tokens.access_token}` }
                    }).then((res) => res.json());

                    return { email: me.email_address };
                }
            },
            profile(profile, tokens) {
                return {
                    email: profile.email,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiresAt: tokens.expires_at
                } as ExtendedUser;
            }
        }),
        Credentials({
            credentials: {
                email: { label: "メールアドレス", type: "email" },
                password: { label: "パスワード", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email_address: credentials?.email,
                        password: credentials?.password
                    })
                });

                if (res.status !== 200) return null;

                const tokens: TokenSet = await res.json();
                if (tokens) {
                    return {
                        email: credentials?.email,
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                        expiresAt: tokens.expires_at
                    } as ExtendedUser;
                }
                return null;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/auth/login',
        error: '/auth/error'
    },
    callbacks: {
        authorized({ request, auth }) {
            // ログイン / 未ログイン時の画面遷移を制御する

            const { nextUrl } = request;
            const isLoggedIn = !!auth;

            const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
            const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
            const isAuthRoute = authRoutes.includes(nextUrl.pathname);

            if (isApiAuthRoute) {
                // /api/auth は未認証でもアクセス可能
                return true;
            }

            if (isAuthRoute) {
                if (isLoggedIn) {
                    // すでにログイン済みの場合は、リダイレクトさせる
                    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
                }

                // 未ログインで認証ページの場合は、アクセス可能
                return true;
            }

            return isPublicRoute || isLoggedIn;
        },
        async jwt({ token, user, account}) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.expiresAt = user.expiresAt;
                return token;
            }
            return token;
        },
        async session({ session, token }) {
            return {...session, ...token};
        },
    }
} satisfies NextAuthConfig;