export async function postRegisterUser({
    email,
    password
}: {
    email: string;
    password: string;
}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email_address: email,
            password: password
        })
    });
    if (res.status !== 200) {
        throw Error();
    }
}


export async function postVerificationToken(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    if (res.status !== 200) {
        throw Error()
    }
}


export async function pastForgotPassword(email: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email_address: email
        })
    });
    if (res.status !== 200) {
        const errorJson = await res.json() as ErrorJson;
        switch (errorJson.type) {
            case 'USER_DOES_NOT_EXISTS':
                return 'メールアドレスが存在しません。';
            default:
                return 'システムエラーが発生しました。しばらくお待ちください。';
        }
    }
}

export async function postResetPassword(password: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password: password,
            token: token
        })
    });
    if (res.status !== 200) {
        const errorJson = await res.json() as ErrorJson;
        switch (errorJson.type) {
            case 'VALID_TOKEN_DOES_NOT_EXISTS':
                return 'トークンの検証に失敗しました。トークンが存在しない、もしくは有効期限が切れています。';
            default:
                return 'システムエラーが発生しました。しばらくお待ちください。';
        }
    }
}