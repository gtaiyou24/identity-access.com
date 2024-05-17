import "next-auth/jwt"

declare module "next-auth" {
    interface TokenSet {
        access_token: string;
        refresh_token: string;
        token_type: 'bearer';
        expires_at: number;
    }
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
    interface User {
        user: {email?: string | null};
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}