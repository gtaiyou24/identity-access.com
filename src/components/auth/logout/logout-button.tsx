"use client";

import {logout} from "@/components/auth/logout/actions";

interface LogoutButtonProps {
    children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
    const onClick = () => logout();

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};
