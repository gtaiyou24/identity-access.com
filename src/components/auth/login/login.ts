"use server";

import {z} from "zod";
import {LoginSchema} from "@/components/auth/login/login-schema";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/route";
import {AuthError} from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null): Promise<{ error?: string; success?: string; }|undefined> => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: validatedFields.error.message };
    }

    const { email, password } = validatedFields.data;
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "メールアドレスもしくはパスワードが間違っています。" };
                // case "NewVerification":
                //     return { success: "確認メールを送信しました！" };
                default:
                    return { error: "エラーが発生しました。しばらくお待ちください。" };
            }
        }
        throw error;
    }
}