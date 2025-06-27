import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { BookProvider } from '@/context/BookContext';

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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <BookProvider>
            <Header />
            <main>{children}</main>
            <Toaster />
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
