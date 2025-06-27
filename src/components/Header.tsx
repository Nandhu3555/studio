"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogIn, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) {
        return null;
    }

    // This is a mock state. In a real app, this would come from an auth context.
    const isLoggedIn = false; 
    const isAdmin = false;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline sm:inline-block">
                        B-Tech Lib
                    </span>
                </Link>
                <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
                    {/* Add more nav links here if needed */}
                </nav>
                <div className="flex items-center justify-end space-x-2">
                    {isLoggedIn ? (
                        <>
                            {isAdmin && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/admin">Admin Panel</Link>
                                </Button>
                            )}
                            <Button asChild variant="ghost" size="icon">
                                <Link href="/profile">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">Profile</span>
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/signup">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Sign Up
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
