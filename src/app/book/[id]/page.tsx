"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, ThumbsDown, ThumbsUp, Send, Mic, Loader2, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooks } from '@/context/BookContext';
import { Input } from '@/components/ui/input';
import { chatAboutBook } from '@/ai/flows/chat-about-book';

// A placeholder for the PDF viewer component
function PdfViewer({ url }: { url: string }) {
  // The <object> tag is generally more reliable for embedding PDF data URIs.
  // We provide a fallback link for browsers that might not support it.
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><FileText /> Book Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[4/5] bg-muted rounded-md">
            <object
                data={url}
                type="application/pdf"
                width="100%"
                height="100%"
                className="rounded-md"
            >
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <p className="text-muted-foreground mb-4">Your browser does not support embedded PDFs.</p>
                    <Button asChild>
                        <a href={url} download="book.pdf">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </a>
                    </Button>
                </div>
            </object>
        </div>
      </CardContent>
    </Card>
  )
}

function BookChat({ book }: { book: Book }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const response = await chatAboutBook({
        query,
        bookTitle: book.title,
        bookDescription: book.description,
        bookSummary: book.summary,
      });
      setAnswer(response.answer);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Card className="my-6 bg-transparent shadow-none border-none">
          <CardContent className="p-0">
              <div className="text-center mb-6">
                  <h2 className="text-3xl font-headline">What can I help with?</h2>
              </div>
              <form onSubmit={handleSubmit}>
                  <div className="relative w-full max-w-3xl mx-auto">
                      <Input
                          placeholder="Ask anything about this book..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className="w-full rounded-full py-6 pl-6 pr-28 text-base shadow-lg"
                          disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center gap-1">
                          <Button type="button" size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-foreground" disabled>
                              <Mic className="h-5 w-5" />
                          </Button>
                          <Button type="submit" size="icon" variant="default" className="h-10 w-10 rounded-full" disabled={isLoading || !query.trim()}>
                              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                          </Button>
                      </div>
                  </div>
              </form>

              {(isLoading || answer || error) && (
                  <div className="max-w-3xl mx-auto mt-6">
                      {isLoading && (
                          <div className="flex items-center justify-center text-muted-foreground rounded-lg bg-card p-4 border">
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Thinking...
                          </div>
                      )}
                      {error && (
                          <div className="text-center text-destructive rounded-lg bg-card p-4 border border-destructive">
                              {error}
                          </div>
                      )}
                      {answer && (
                          <Card>
                              <CardContent className="p-6">
                                  <p className="whitespace-pre-wrap">{answer}</p>
                              </CardContent>
                          </Card>
                      )}
                  </div>
              )}
          </CardContent>
      </Card>
  );
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

            <BookChat book={book} />

            <PdfViewer url={book.pdfUrl} />
        </div>
      </div>
    </div>
  );
}
