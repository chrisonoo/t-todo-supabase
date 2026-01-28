"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LoginButton } from "./login-button";
import { LogoutButton } from "./logout-button";
import { ModeToggle } from "./mode-toggle";
import { SignUpButton } from "./sign-up-button";

export function AuthButtons() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        // Check initial auth state
        const checkAuthState = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                setIsLoggedIn(!!user);
                setUserEmail(user?.email || null);
            } catch (error) {
                console.error("Error checking auth state:", error);
                setIsLoggedIn(false);
                setUserEmail(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthState();

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggedIn(!!session?.user);
            setUserEmail(session?.user?.email || null);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center space-x-2">
                <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                <div className="h-9 w-16 bg-muted animate-pulse rounded" />
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2">
            {isLoggedIn ? (
                <>
                    {userEmail && (
                        <span className="text-sm text-muted-foreground">
                            {userEmail}
                        </span>
                    )}
                    <LogoutButton />
                    <ModeToggle />
                </>
            ) : (
                <>
                    <LoginButton />
                    <SignUpButton />
                    <ModeToggle />
                </>
            )}
        </div>
    );
}
