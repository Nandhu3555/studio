"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooks } from '@/context/BookContext';

// A placeholder for the PDF viewer component
function PdfViewer({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><FileText /> Book Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[4/5] bg-muted rounded-md flex items-center justify-center relative">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground animate-pulse">Rendering PDF...</p>
            </div>
          )}
          <iframe
            src={url}
            className={`w-full h-full border-0 rounded-md transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            title="Book PDF Preview"
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const { findBookById } = useBooks();

  useEffect(() => {
    const foundBook = findBookById(bookId) || null;
    setBook(foundBook);
  }, [bookId, findBookById]);

  if (!book) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                    <Skeleton className="h-10 w-full mt-4" />
                </div>
                <div className="md:col-span-2">
                    <Skeleton className="h-12 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-6" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
      </Button>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 flex flex-col gap-4">
            <Card className="overflow-hidden">
                <Image
                    src={book.imageUrl}
                    alt={`Cover of ${book.title}`}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover"
                    data-ai-hint={book.data_ai_hint}
                    priority
                />
            </Card>
            <Card>
                <CardContent className="p-4 flex justify-around items-center">
                    <div className="flex items-center gap-2 text-lg font-semibold text-like">
                        <ThumbsUp />
                        <span>{book.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-dislike">
                        <ThumbsDown />
                        <span>{book.dislikes}</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
            <Badge variant="secondary" className="mb-2">{book.category}</Badge>
            <h1 className="text-4xl font-bold font-headline text-primary">{book.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">by {book.author} ({book.year})</p>
            
            <Card className="my-6">
                <CardHeader>
                    <CardTitle className="font-headline">Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80">{book.description}</p>
                </CardContent>
            </Card>

            {book.summary && (
                <Card className="my-6 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="font-headline">AI-Generated Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/90 italic">{book.summary}</p>
                    </CardContent>
                </Card>
            )}

            <PdfViewer url={book.pdfUrl} />
        </div>
      </div>
    </div>
  );
}
