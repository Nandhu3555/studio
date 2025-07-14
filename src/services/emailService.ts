// To load environment variables from .env file
import 'dotenv/config';
import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10),
    secure: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

/**
 * Sends an email. In a real app, this would use a transactional email service.
 * For this demo, it uses nodemailer with ethereal.email, which catches emails
 * and displays them in a preview URL in the console, so no actual email is sent.
 * @param options - Email options
 */
export async function sendEmail(options: EmailOptions) {
    try {
        // For a real app, you wouldn't use a test account.
        // This setup is for demonstration purposes.
        if (process.env.EMAIL_SERVER_HOST === "smtp.ethereal.email") {
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
                from: `B-Tech Lib <${process.env.EMAIL_FROM}>`,
                ...options,
            });

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        } else {
            // This would be for your actual production email provider
             const info = await transporter.sendMail({
                from: `B-Tech Lib <${process.env.EMAIL_FROM}>`,
                ...options,
            });
            console.log('Production email sent:', info.messageId);
        }

    } catch (error) {
        console.error('Error sending email:', error);
        // In a real app, you might want to throw the error or handle it differently
    }
}
