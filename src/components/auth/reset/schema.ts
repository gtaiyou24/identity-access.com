import {z} from "zod";

export const ResetSchema = z.object({
    email: z.string().email({
        message: "メールアドレスを入力してください。",
    }),
});