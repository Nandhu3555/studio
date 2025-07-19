
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2 } from "lucide-react";
import { useUsers } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import { Label } from "@/components/ui/label";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type EmailValues = z.infer<typeof emailSchema>;


export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { findUserByEmail } = useUsers();
  const { addNotification } = useNotifications();
  
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const handleEmailSubmit = async (values: EmailValues) => {
    setIsLoading(true);
    if (!findUserByEmail(values.email)) {
        toast({
            variant: "destructive",
            title: "User Not Found",
            description: "No account found with this email address.",
        });
        setIsLoading(false);
        return;
    }
    
    // In a real app, you would send a reset link. Here we just proceed.
    setUserEmail(values.email);
    setStep('reset');
    setIsLoading(false);
  };

  const handleResetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please re-enter your new password.",
      });
      setIsLoading(false);
      return;
    }

    // In a real app, you would now update the user's password in your database.
    // For this prototype, we'll just simulate success.
    console.log(`Password for ${userEmail} has been reset to: ${newPassword}`);
    addNotification({
    type: 'password_changed',
    title: 'Security Alert',
    description: 'Your password was changed successfully.',
    });
    toast({
    title: "Password Reset Successful",
    description: "You can now log in with your new password.",
    });
    router.push('/login');
    
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
          <CardTitle className="font-headline text-2xl mt-4">
            {step === 'email' ? 'Forgot Password' : 'Reset Your Password'}
          </CardTitle>
          <CardDescription>
            {step === 'email' ? "Enter your email to reset your password." : `Enter your new password for ${userEmail}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="student@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Email...</> : "Continue"}
                </Button>
              </form>
            </Form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" name="newPassword" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : "Reset Password"}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="underline text-primary">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
