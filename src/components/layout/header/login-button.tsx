"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginButton() {
    return (
        <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
        </Button>
    );
}
