"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold font-headline">
                    B-Tech Lib
                </span>
            </Link>
            <p className="text-muted-foreground mt-2">Welcome back! Please login to your account.</p>
        </div>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <Card className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-500">
              <CardHeader>
                <CardTitle className="font-headline">Student Login</CardTitle>
                <CardDescription>Enter your credentials to access the library.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-student">Email</Label>
                  <Input id="email-student" type="email" placeholder="student@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-student">Password</Label>
                  <Input id="password-student" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline text-primary">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-500">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Shield size={24} /> Admin Login</CardTitle>
                <CardDescription>Enter your admin credentials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-admin">Admin Email</Label>
                  <Input id="email-admin" type="email" placeholder="admin@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin">Password</Label>
                  <Input id="password-admin" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
