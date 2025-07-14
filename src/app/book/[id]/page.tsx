
"use client"

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { type Book } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Share2, Star, Download, BookOpen, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooks } from '@/context/BookContext';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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

const getMimeTypeFromDataUrl = (dataUrl: string): string => {
    if (!dataUrl || !dataUrl.startsWith('data:')) return 'application/octet-stream';
    return dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
};

const getFileExtensionFromDataUrl = (dataUrl: string): string => {
    if (!dataUrl || !dataUrl.startsWith('data:')) return 'bin';
    const mimeType = getMimeTypeFromDataUrl(dataUrl);
    switch (mimeType) {
        case 'application/pdf':
            return 'pdf';
        case 'application/msword':
            return 'doc';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'docx';
        case 'application/vnd.ms-powerpoint':
            return 'ppt';
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'pptx';
        default:
            const parts = mimeType.split('/');
            return parts[parts.length - 1] || 'bin';
    }
};

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { findBookById, updateBook } = useBooks();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newRemark, setNewRemark] = useState("");


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
        // This checks if the user cancelled the share dialog.
        // We only fall back to clipboard copy if it's an actual error.
        if (error instanceof DOMException && (error.name === "AbortError" || error.name === "NotAllowedError")) {
          // User cancelled the share, do nothing.
        } else {
          console.error("Share failed, falling back to clipboard:", error);
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const handleRemarkSubmit = () => {
    if (!newRemark.trim() || !user || !book) return;
    const remark = {
        id: Date.now().toString(),
        text: newRemark,
        author: user.name,
        avatarUrl: user.avatarUrl,
        timestamp: new Date().toISOString()
    };
    const updatedRemarks = [...(book.remarks || []), remark];
    updateBook(book.id, { remarks: updatedRemarks });
    setBook(prev => prev ? { ...prev, remarks: updatedRemarks } : null);
    setNewRemark("");
    toast({ title: "Remark added!" });
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

  const fileExtension = getFileExtensionFromDataUrl(book.documentUrl);
  const isPdf = getMimeTypeFromDataUrl(book.documentUrl) === 'application/pdf';

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button asChild size="lg" className="md:col-span-1">
            {isPdf ? (
              <Link href={`/book/${book.id}/read`}>
                <BookOpen className="mr-2 h-4 w-4" /> Read Book
              </Link>
            ) : (
               <a href={book.documentUrl} download={`${book.title}.${fileExtension}`}>
                <BookOpen className="mr-2 h-4 w-4" /> Read Book
              </a>
            )}
          </Button>
          <Button asChild size="lg" variant="secondary" className="md:col-span-1">
            <a href={book.documentUrl} download={`${book.title}.${fileExtension}`}>
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={handleShare} className="md:col-span-1">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
        
        <Card>
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="text-xl font-bold font-headline mb-4">Description</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">{book.description}</p>
                </div>
                <Separator />
                <div>
                     <h3 className="text-xl font-bold font-headline mb-4">Remarks</h3>
                     <div className="space-y-4">
                        {user && (
                            <div className="flex gap-4">
                                <Textarea 
                                    placeholder="Leave a remark..."
                                    value={newRemark}
                                    onChange={(e) => setNewRemark(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button onClick={handleRemarkSubmit} size="icon" disabled={!newRemark.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <div className="space-y-4">
                            {book.remarks && book.remarks.length > 0 ? (
                                book.remarks.slice().reverse().map(remark => (
                                    <div key={remark.id} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={remark.avatarUrl} />
                                            <AvatarFallback>{remark.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm">{remark.author}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(remark.timestamp).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm text-foreground/80 mt-1">{remark.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No remarks yet. Be the first to leave one!</p>
                            )}
                        </div>
                     </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
