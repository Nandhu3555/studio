"use client"

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { type Book } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Share2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooks } from '@/context/BookContext';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';


function StarRating({ rating }: { rating: number }) {
  // Guard against invalid rating values that could cause a crash.
  if (typeof rating !== 'number' || isNaN(rating)) {
    // Don't render anything if the rating is invalid.
    return null;
  }
  
  const fullStars = Math.min(5, Math.max(0, Math.round(rating)));
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 text-primary fill-primary" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground/30" />
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="flex justify-between py-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-foreground">{value}</dd>
        </div>
    );
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { findBookById } = useBooks();
  const { toast } = useToast();

  useEffect(() => {
    if (bookId) {
      const foundBook = findBookById(bookId) || null;
      setBook(foundBook);
    }
  }, [bookId, findBookById]);

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied!", description: "The link to this book has been copied to your clipboard." });
  };

  const handleShare = async () => {
    if (navigator.share && book) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out this book: ${book.title} by ${book.author}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
        // Fallback to copying the link if the user denies permission or an error occurs
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  if (!book) {
    return (
        <div className="bg-background min-h-screen">
             <div className="flex items-center justify-between p-4 border-b">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="p-4 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 border-b">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-lg font-semibold font-headline truncate px-2">{book.title}</h1>
            <Button variant="ghost" size="icon" onClick={() => setIsBookmarked(!isBookmarked)}>
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'text-primary fill-primary' : ''}`} />
                <span className="sr-only">Bookmark</span>
            </Button>
        </div>
      </header>
      
      <main className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-6">
            <h2 className="text-3xl font-bold font-headline text-primary">{book.title}</h2>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
            <Badge variant="secondary">{book.category}</Badge>
            <div className="flex items-center gap-4">
                <StarRating rating={book.rating} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button asChild size="lg">
            <Link href={`/book/${book.id}/read`}>
              Read Book
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
        
        <Card>
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold font-headline mb-2">Description</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">{book.description}</p>
                </div>
                <Separator />
                <div>
                     <h3 className="text-lg font-semibold font-headline mb-2">Details</h3>
                     <dl>
                        <DetailRow label="Language" value={book.language} />
                        <DetailRow label="Pages" value={book.pages} />
                        <DetailRow label="Publisher" value={book.publisher} />
                        <DetailRow label="Year" value={book.year} />
                     </dl>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
