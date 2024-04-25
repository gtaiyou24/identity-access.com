import {z} from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "メールアドレスを入力してください。",
    }),
    password: z.string().min(1, {
        message: "パスワードを入力してください。",
    })
});