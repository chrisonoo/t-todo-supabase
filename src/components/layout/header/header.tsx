"use client";

import { CircleCheckBig } from "lucide-react";
import { AuthButtons } from "./auth-buttons";
import { NavigationMenu } from "./navigation-menu";

export function Header() {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
                {/* Left side - App name with checkmark */}
                <div className="flex items-center space-x-2">
                    <CircleCheckBig className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">TodoApp</span>
                </div>

                {/* Center - Navigation menu */}
                <NavigationMenu />

                {/* Right side - Auth buttons */}
                <AuthButtons />
            </div>
        </header>
    );
}
