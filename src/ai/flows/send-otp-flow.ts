'use server';
/**
 * @fileOverview A flow to generate and "send" a One-Time Password (OTP).
 *
 * In a real application, this flow would integrate with an email or SMS service.
 * For this prototype, it returns the OTP directly to be displayed to the user.
 *
 * - sendOtp - A function that generates an OTP for a given email.
 * - SendOtpInput - The input type for the sendOtp function.
 * - SendOtpOutput - The return type for the sendOtp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendOtpInputSchema = z.object({
  email: z.string().email().describe("The user's email address to send the OTP to."),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

const SendOtpOutputSchema = z.object({
  otp: z.string().length(6).describe("The 6-digit One-Time Password."),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;

export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email }) => {
    // In a real-world scenario, you would generate a secure random OTP.
    // For this example, we'll generate a simple 6-digit code.
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Here you would integrate with an email service like SendGrid, Nodemailer, etc.
    // to send the OTP to the user's email address.
    // For example: await emailService.send({ to: email, body: `Your OTP is: ${otp}` });

    console.log(`Generated OTP for ${email}: ${otp}`);

    // For this prototype, we return the OTP to the frontend to simulate the process.
    return { otp };
  }
);
