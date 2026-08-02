"use client";

import { usePathname } from "next/navigation";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { BottomNav } from "@/components/layout/BottomNav";

export function RouteAwareNavbar() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return <AuthNavbar />;
}

export function RouteAwareBottomNav() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return <BottomNav />;
}
