
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { sendOtp } from "@/ai/flows/send-otp-flow";
import { BookOpen, Loader2 } from "lucide-react";
import { useUsers } from "@/context/UserContext";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type EmailValues = z.infer<typeof emailSchema>;

const resetSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
  newPassword: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
type ResetValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { findUserByEmail } = useUsers();
  
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [userEmail, setUserEmail] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
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

    try {
        const { otp } = await sendOtp({ email: values.email });
        setGeneratedOtp(otp);
        setUserEmail(values.email);
        setStep('reset');
        toast({
            title: "OTP Sent!",
            description: "An OTP has been sent to your email. Check the console for the preview link.",
        });
    } catch (error) {
        console.error("Failed to get OTP:", error);
        toast({
            variant: "destructive",
            title: "OTP Generation Failed",
            description: "Could not generate an OTP. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetSubmit = (values: ResetValues) => {
    setIsLoading(true);
    if (values.otp === generatedOtp) {
      // In a real app, you would now update the user's password in your database.
      // For this prototype, we'll just simulate success.
      console.log(`Password for ${userEmail} has been reset to: ${values.newPassword}`);
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
      router.push('/login');
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
      });
      setIsLoading(false);
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
          <CardTitle className="font-headline text-2xl mt-4">
            {step === 'email' ? 'Forgot Password' : 'Reset Your Password'}
          </CardTitle>
          <CardDescription>
            {step === 'email' ? "Enter your email to receive a reset code." : `Enter the OTP sent to ${userEmail} and your new password.`}
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
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Code...</> : "Send Reset Code"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password (OTP)</FormLabel>
                      <FormControl><Input placeholder="6-digit code" maxLength={6} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : "Reset Password"}
                </Button>
              </form>
            </Form>
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
