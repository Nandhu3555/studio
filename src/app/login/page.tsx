
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BookOpen, Shield } from "lucide-react";
import { useUsers } from "@/context/UserContext";

const studentLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type StudentLoginValues = z.infer<typeof studentLoginSchema>;

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { findUserByEmail } = useUsers();
  const { toast } = useToast();

  const studentForm = useForm<StudentLoginValues>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const adminForm = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onStudentSubmit = (values: StudentLoginValues) => {
    const user = findUserByEmail(values.email);

    if (user && user.password === values.password) {
      login(values.email, 'student');
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/');
    } else {
        toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
    }
  };

  const onAdminSubmit = (values: AdminLoginValues) => {
    if (values.email === "gnreddy3555@gmail.com" && values.password === "nandhu@sunny") {
      login(values.email, 'admin');
      toast({ title: "Admin Login Successful", description: "Redirecting to dashboard..." });
      router.push('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid admin credentials.",
      });
    }
  };

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
              <CardContent>
                <Form {...studentForm}>
                  <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                    <FormField control={studentForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="student@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={studentForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link href="/forgot-password" passHref>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    Forgot password?
                                </Button>
                            </Link>
                        </div>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </Form>
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
              <CardContent>
                 <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                    <FormField control={adminForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl><Input placeholder="admin@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={adminForm.control} name="password" render={({ field }) => (
                      <FormItem>
                         <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link href="/forgot-password" passHref>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    Forgot password?
                                </Button>
                            </Link>
                        </div>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full">Login as Admin</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
