"use server";

import * as z from "zod";

import {ResetSchema} from "@/components/auth/reset/schema";
import {pastForgotPassword} from "@/lib/api";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validateFields = ResetSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "メールアドレスが不正です！" };
    }

    const { email } = validateFields.data;
    const error = await pastForgotPassword(email);
    if (error) {
        return { error: error };
    }

    return { success: "ご指定のメールアドレスにリセットメールを送信しました！" };
};
