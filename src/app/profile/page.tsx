"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, isLoggedIn, isAdmin, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.replace('/login');
        }
    }, [isLoggedIn, router]);

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={`https://placehold.co/100x100/7E57C2/FFFFFF?text=${initials}`} alt={user.name} data-ai-hint="person portrait" />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
             <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Name</span>
                            <span>{user.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Email</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Role</span>
                            <span className="font-semibold text-primary">{isAdmin ? 'Admin' : 'Student'}</span>
                        </div>
                    </CardContent>
                </Card>

                 <Button variant="destructive" className="w-full" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
