
"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Moon, Sun, Laptop, Camera, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ProfilePage() {
    const { user, isLoggedIn, isAdmin, logout, isAuthReady, updateUser } = useAuth();
    const router = useRouter();
    const { setTheme } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isAuthReady && !isLoggedIn) {
            router.replace('/login');
        }
    }, [isAuthReady, isLoggedIn, router]);

    if (!isAuthReady || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({
                    variant: "destructive",
                    title: "Image too large",
                    description: "Please select an image smaller than 2MB.",
                });
                return;
            }
            try {
                const dataUrl = await fileToDataUrl(file);
                updateUser({ avatarUrl: dataUrl });
                toast({
                    title: "Profile picture updated!",
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Update failed",
                    description: "Could not update profile picture.",
                });
            }
        }
    };

    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
        
    const memberSince = user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : 'N/A';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center text-center">
             <div className="relative group">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                </Avatar>
                <Button 
                    onClick={handleAvatarClick}
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-4 right-0 rounded-full h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Change profile picture"
                >
                    <Camera className="h-4 w-4" />
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
            </div>
            <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
             <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
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
                        {!isAdmin && (
                            <>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Branch</span>
                                    <span>{user.branch || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Year</span>
                                    <span>{user.year || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Member Since</span>
                                    <span>{memberSince}</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the app.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-2">
                         <Button variant="outline" onClick={() => setTheme("light")}>
                           <Sun className="mr-2 h-4 w-4" /> Light
                         </Button>
                         <Button variant="outline" onClick={() => setTheme("dark")}>
                           <Moon className="mr-2 h-4 w-4" /> Dark
                         </Button>
                         <Button variant="outline" onClick={() => setTheme("system")}>
                            <Laptop className="mr-2 h-4 w-4" /> System
                         </Button>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Contact Us
                        </CardTitle>
                         <CardDescription>Need help? Reach out to support.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <a 
                            href="mailto:gnreddy3555@gmail.com" 
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            gnreddy3555@gmail.com
                        </a>
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
