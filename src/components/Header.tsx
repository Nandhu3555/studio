
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogIn, UserPlus, Shield, LogOut, Home, Bell, BookCheck, UserRoundPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Skeleton } from "./ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { type Notification, notifications } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "./ui/avatar";

const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const notificationIcons: Record<Notification['type'], React.ReactNode> = {
    new_book: <BookCheck className="h-4 w-4 text-primary" />,
    new_user: <UserRoundPlus className="h-4 w-4 text-green-500" />,
    password_changed: <Shield className="h-4 w-4 text-orange-500" />,
};


export default function Header() {
    const pathname = usePathname();
    const { isLoggedIn, isAdmin, logout, isAuthReady } = useAuth();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) {
        return null;
    }

    const renderAuthButtons = () => {
        if (!isAuthReady) {
            return (
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            );
        }
        if (isLoggedIn) {
            return (
                <>
                    {isAdmin && (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin">
                                <Shield className="mr-2 h-4 w-4" />
                                Admin Panel
                            </Link>
                        </Button>
                    )}
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                             <Button asChild variant="ghost" size="icon">
                                <div>
                                    <Bell className="h-5 w-5" />
                                    <span className="sr-only">Notifications</span>
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0">
                            <div className="p-4 font-medium border-b">
                                Notifications
                            </div>
                            <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                                {notifications.map(notif => (
                                     <div key={notif.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary">
                                        <Avatar className="h-8 w-8 mt-1 border">
                                            <AvatarFallback className="bg-transparent">{notificationIcons[notif.type]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{notif.title}</p>
                                            <p className="text-sm text-muted-foreground">{notif.description}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">{getTimeAgo(notif.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                                {notifications.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center p-4">No new notifications</p>
                                )}
                            </div>
                            <div className="p-2 border-t text-center">
                                <Button variant="link" size="sm" asChild>
                                    <Link href="#">View all notifications</Link>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button asChild variant="ghost" size="icon">
                        <Link href="/profile">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Profile</span>
                        </Link>
                    </Button>
                     <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </>
            );
        }
        return (
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
        );
    }

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
                    {renderAuthButtons()}
                </div>
            </div>
        </header>
    );
}
