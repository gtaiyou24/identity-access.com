import {z} from "zod";

export const NewPasswordSchema = z.object({
    password: z.string().min(4, {
        message: "パスワードは4文字以上を入力してください。",
    }),
});