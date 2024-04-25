'use client';

import {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {CardWrapper} from "@/components/auth/card-wrapper";
import {FormSuccess} from "@/components/form-success";
import {FormError} from "@/components/form-error";
import {BeatLoader} from "react-spinners";
import {newVerification} from "@/components/auth/new-verification/actions";

export default function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;
        if (!token) {
            setError("トークンが見つかりませんでした！");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError('エラーが発生しました。しばらくお待ちください。')
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerTitle="Confirm your verification!"
            backButtonLabel="ログインする"
            backButtonHref="/auth/login"
        >
            <div className="w-full flex items-center justify-center">
                {!success && !error && <BeatLoader />}
                <FormSuccess message={success} />
                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
}