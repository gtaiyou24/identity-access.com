"use server";

import {postVerificationToken} from "@/lib/api";

export const newVerification = async (token: string) => {
    try {
        await postVerificationToken(token);
    } catch (e) {
        return { error: "トークンの検証に失敗しました。トークンが存在しない、もしくは有効期限が切れています。" };
    }
    return { success: "メールアドレスの確認が完了しました！" };
};
