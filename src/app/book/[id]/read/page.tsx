
"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBooks } from '@/context/BookContext';
import { type Book } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const isPdfUrl = (url: string): boolean => {
    if (!url) return false;
    if (url.startsWith('data:application/pdf')) return true;
    if (url.toLowerCase().endsWith('.pdf')) return true;
    return false;
};

export default function ReadBookPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthReady, isLoggedIn } = useAuth();
    const bookId = params.id as string;
    const { findBookById } = useBooks();
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthReady) {
            if (!isLoggedIn) {
                router.replace('/login');
            } else {
                const foundBook = findBookById(bookId);
                setBook(foundBook || null);
                setIsLoading(false);
            }
        }
    }, [bookId, findBookById, isAuthReady, isLoggedIn, router]);

    if (isLoading || !isAuthReady) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!book) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
                <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold font-headline mb-2">Book Not Found</h1>
                <p className="text-muted-foreground mb-6 text-center">We couldn't find the book you were looking for.</p>
                <Button onClick={() => router.push('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Library
                </Button>
            </div>
        );
    }

    const canDisplayPdf = isPdfUrl(book.documentUrl);

    if (!canDisplayPdf) {
         return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
                <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold font-headline mb-2">Cannot Display Document</h1>
                <p className="text-muted-foreground mb-6 text-center">This document type cannot be displayed in the browser. Please download it instead.</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <header className="flex h-14 items-center justify-between border-b px-4 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Details
                </Button>
                <h1 className="text-lg font-semibold font-headline truncate mx-4">{book.title}</h1>
                <div className="w-28"></div>
            </header>
            <main className="flex-1">
                <iframe
                    src={book.documentUrl}
                    title={`PDF viewer for ${book.title}`}
                    className="h-full w-full border-none"
                />
            </main>
        </div>
    );
}
