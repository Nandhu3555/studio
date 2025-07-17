
"use client"

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { type Book } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Star, Download, BookOpen, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBooks } from '@/context/BookContext';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
        >
            <path
                d="M16.75 13.96c.25.42.42.88.5 1.39.08.51.08 1.05-.03 1.56-.13 1.14-.68 2.2-1.55 3.04-.87.84-1.93 1.39-3.08 1.55-1.14.16-2.31.03-3.38-.4-1.07-.43-2.05-.99-2.91-1.68l-3.33 1.11 1.12-3.27a11.1 11.1 0 0 1-1.95-3.32c-.44-1.15-.55-2.38-.3-3.56.24-1.18.8-2.29 1.6-3.23.81-.94 1.84-1.68 3-2.18s2.4-.73 3.69-.64c1.29.09 2.54.5 3.62 1.2s2.02 1.6 2.68 2.68c.66 1.08 1.03 2.3 1.1 3.55.07 1.25-.15 2.48-.64 3.62-.49 1.14-1.24 2.16-2.18 3.01zm-5.18-1.42c-.13 0-.26-.03-.38-.08-.12-.05-.24-.13-.35-.22-.11-.09-.23-.2-.34-.33s-.22-.29-.33-.45c-.11-.16-.21-.34-.3-.54s-.16-.4-.18-.63c-.02-.23.01-.46.08-.68.07-.22.19-.43.35-.61.16-.18.35-.34.56-.47.21-.13.44-.23.68-.28.24-.05.49-.06.73-.02.24.04.48.12.7.24.22.12.42.28.59.48.17.2.31.43.41.68s.15.52.14.79c-.01.27-.08.54-.21.79s-.31.48-.53.66c-.22.18-.48.31-.76.39-.28.08-.58.11-.88.08-.3-.03-.59-.11-.86-.23-.27-.12-.52-.28-.74-.48-.22-.2-.42-.44-.58-.71-.16-.27-.29-.56-.36-.87-.07-.31-.09-.62-.05-.93.04-.31.14-.61.29-.89.15-.28.35-.54.59-.75.24-.21.52-.39.82-.51.3-.12.62-.18.94-.18.32,0,.64.06.94.18.3.12.58.29.82.51.24.22.44.47.59.75.15.28.25.58.29.89.04.31.02.62-.05.93-.07.31-.19.6-.36.87-.16.27-.36.51-.58.71-.22.2-.47.36-.74.48-.27.12-.56.2-.86.23-.3.03-.6.01-.88-.08z"
            ></path>
        </svg>
    );
}


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

const isPdfUrl = (url: string): boolean => {
    if (!url) return false;
    if (url.startsWith('data:application/pdf')) return true;
    if (url.toLowerCase().endsWith('.pdf')) return true;
    return false;
};

const getFileExtensionFromUrl = (url: string): string => {
    if (!url) return 'bin';
    if (url.startsWith('data:')) {
        const mimeType = url.substring(url.indexOf(':') + 1, url.indexOf(';'));
        switch (mimeType) {
            case 'application/pdf': return 'pdf';
            case 'application/msword': return 'doc';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'docx';
            case 'application/vnd.ms-powerpoint': return 'ppt';
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return 'pptx';
            default:
                const parts = mimeType.split('/');
                return parts[parts.length - 1] || 'bin';
        }
    }
    try {
        const path = new URL(url).pathname;
        const extension = path.split('.').pop();
        return extension || 'bin';
    } catch (e) {
        return 'bin';
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


  const handleShare = () => {
    if (!book) return;

    const shareText = `Check out this book: "${book.title}" by ${book.author}`;
    const shareUrl = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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

  const fileExtension = getFileExtensionFromUrl(book.documentUrl);
  const isPdf = isPdfUrl(book.documentUrl);

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
          <Button asChild size="lg" className="md:col-span-1" disabled={!isPdf}>
            {isPdf ? (
              <Link href={`/book/${book.id}/read`}>
                <BookOpen className="mr-2 h-4 w-4" /> Read Book
              </Link>
            ) : (
               <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" /> Read Book
                </div>
            )}
          </Button>
          <Button asChild size="lg" variant="secondary" className="md:col-span-1">
            <a href={book.documentUrl} download={`${book.title}.${fileExtension}`}>
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={handleShare} className="md:col-span-1">
            <WhatsAppIcon className="mr-2 h-5 w-5" /> Share
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
