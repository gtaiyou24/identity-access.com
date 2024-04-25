/**
 * 未認証でもアクセス可能なページパスの一覧
 * @type {string[]}
 */
export const publicRoutes = ["/auth/new-verification"];

/**
 * 認証系で利用するページパスの一覧
 * ログイン済みの場合は、DEFAULT_LOGIN_REDIRECT に遷移する
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

/**
 * 認証で用いる API パスのプレフィックス
 * `src/app/api/auth/[...nextauth]/route.ts` へルーティングできるように定義する
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * ログイン済みのユーザーがデフォルトでリダイレクトするページパス
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";