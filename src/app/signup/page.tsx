
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { useUsers } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/mock-data";

export default function SignupPage() {
  const router = useRouter();
  const { addUser, findUserByEmail } = useUsers();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const branch = formData.get('branch') as string;
    const year = formData.get('year') as string;

    if (findUserByEmail(email)) {
        toast({
            variant: "destructive",
            title: "Account Exists",
            description: "An account with this email already exists. Please login.",
        });
        return;
    }

    if (name && email && password && branch && year) {
      const newUser = addUser({ name, email, branch, year: parseInt(year) });
      login(newUser.email, 'student');
      toast({
        title: "Account Created!",
        description: "Welcome to B-Tech Lib.",
      });
      router.push('/');
    } else {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all fields to create an account.",
        });
    }
  };
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>
      <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-500">
        <CardHeader className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold font-headline">
                    B-Tech Lib
                </span>
            </Link>
          <CardTitle className="font-headline text-2xl mt-4">Create an account</CardTitle>
          <CardDescription>Enter your information to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="student@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select name="branch" required>
                    <SelectTrigger id="branch">
                        <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.filter(c => c !== "All" && c !== "Mathematics").map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Select name="year" required>
                    <SelectTrigger id="year">
                        <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-primary">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
