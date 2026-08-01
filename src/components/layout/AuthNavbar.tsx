"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export default function AuthNavbar() {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/auth/callback") {
        return null;
    }

    return <Navbar />;
}
