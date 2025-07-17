// To load environment variables from .env file
import 'dotenv/config';
import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

/**
 * Sends an email. In a real app, this would use a transactional email service.
 * For this demo, it defaults to using ethereal.email, which catches emails
 * and displays them in a preview URL in the console, so no actual email is sent.
 * @param options - Email options
 */
export async function sendEmail(options: EmailOptions) {
    try {
        // Check if a real email server is configured. If not, use Ethereal.
        if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_PORT) {
             const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
                secure: parseInt(process.env.EMAIL_SERVER_PORT, 10) === 465,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            });
            const info = await transporter.sendMail({
                from: `B-Tech Lib <${process.env.EMAIL_FROM}>`,
                ...options,
            });
            console.log('Production email sent:', info.messageId);
        } else {
            // Use Ethereal test account as a fallback for demonstration
            const testAccount = await nodemailer.createTestAccount();
            const etherealTransporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log("Using Ethereal test account to 'send' email.");
            
            const info = await etherealTransporter.sendMail({
                from: `B-Tech Lib <no-reply@btechlib.com>`,
                ...options,
            });

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

    } catch (error) {
        console.error('Error sending email:', error);
        // Re-throw the error to be caught by the calling function (e.g., the Genkit flow)
        throw new Error('Failed to send email.');
    }
}