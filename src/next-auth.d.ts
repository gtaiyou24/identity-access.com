import NextAuth, { type DefaultSession } from "next-auth";

// 独自のログインユーザーの型を定義
export type ExtendedUser = DefaultSession['user'] & {
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

declare module "next-auth" {
    interface TokenSet {
        access_token: string;
        refresh_token: string;
        token_type: 'bearer';
        expires_at: number;
    }
    interface Session {
        user: ExtendedUser;
    }
}