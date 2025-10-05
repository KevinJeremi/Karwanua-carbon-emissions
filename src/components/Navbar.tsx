"use client";

import { MiniNavbar } from "./ui/mini-navbar";

interface NavbarProps {
    currentPage?: string;
    onPageChange?: (page: string) => void;
}

export default function Navbar({ currentPage = "dashboard", onPageChange }: NavbarProps) {
    return <MiniNavbar currentPage={currentPage} onPageChange={onPageChange} />;
}
