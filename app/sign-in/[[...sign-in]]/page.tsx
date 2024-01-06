"use client";

import { SignIn as ClerkSignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const SignIn: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const clerkTheme = resolvedTheme === "dark" ? { baseTheme: dark } : undefined;

    return (
        <div className="flex justify-center h-screen py-24">
            <ClerkSignUp appearance={clerkTheme} />
        </div>
    );
};

export default SignIn;