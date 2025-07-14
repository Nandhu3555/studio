import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { BookProvider } from '@/context/BookContext';
import { UserProvider } from '@/context/UserContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';

export const metadata: Metadata = {
  title: 'B-Tech Lib',
  description: 'A digital library for B.Tech students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <UserProvider>
              <AuthProvider>
                <BookProvider>
                  <CategoryProvider>
                    <NotificationProvider>
                      <Header />
                      <main className="py-4">{children}</main>
                      <Toaster />
                    </NotificationProvider>
                  </CategoryProvider>
                </BookProvider>
              </AuthProvider>
            </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
