"use server";

import Schema from "@/components/auth/register/schema";
import {z} from "zod";
import {postRegisterUser} from "@/lib/api";

export const register = async (values: z.infer<typeof Schema>) => {
    const validatedFields = Schema.safeParse(values);

    if (!validatedFields.success) {
        return { error: validatedFields.error.message };
    }

    const { email, password } = validatedFields.data;
    try {
        await postRegisterUser({email, password});
    } catch (e) {
        return { error: 'エラーが発生しました。しばらくお待ちください。' };
    }
    return { success: "確認メールを送信しました！" }
}