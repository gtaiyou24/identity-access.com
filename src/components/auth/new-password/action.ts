"use server";

import * as z from "zod";

import {postResetPassword} from "@/lib/api";
import {NewPasswordSchema} from "@/components/auth/new-password/schema";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token: string | null
) => {
    if (!token) {
        return { error: "トークンがありません！" };
    }

    const validateFields = NewPasswordSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: "Invalid fields!" };
    }

    const { password } = validateFields.data;
    const error = await postResetPassword(password, token);
    if (error) {
        return { error: error };
    }
    return { success: "Password updated!" };
};
