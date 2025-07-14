
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBooks } from '@/context/BookContext';
import { useEffect, useState } from 'react';
import { type Book } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ReadBookPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params.id as string;
    const { findBookById } = useBooks();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bookId) {
            const foundBook = findBookById(bookId);
            setBook(foundBook || null);
        }
        setLoading(false);
    }, [bookId, findBookById]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="flex flex-col h-screen items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-4">Book not found</h2>
                <p className="text-muted-foreground mb-8">The book you are looking for does not exist.</p>
                <Button asChild>
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-screen bg-neutral-900">
             <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
                <div className="flex items-center justify-between p-2 md:p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-lg font-semibold font-headline truncate px-2">{book.title}</h1>
                    <div className="w-9 h-9"></div> 
                </div>
            </header>
            <main className="flex-1">
                <iframe
                    src={book.documentUrl}
                    title={`Document viewer for ${book.title}`}
                    className="w-full h-full border-0"
                />
            </main>
        </div>
    );
}
