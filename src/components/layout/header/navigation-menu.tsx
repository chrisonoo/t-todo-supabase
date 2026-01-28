"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Todos", href: "/todos" },
];

export function NavigationMenu() {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground",
                    )}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}
