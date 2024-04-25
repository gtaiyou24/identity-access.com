import NextAuth from "next-auth";

import authConfig from "@/auth.config";

export default NextAuth(authConfig).auth;

// 以下のパスへルーティングする前に middleware を発火させる
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};