"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFlow } from "@genkit-ai/next/client";
import { generateBookSummary } from "@/ai/flows/generate-book-summary";
import { books, categories as bookCategories, type Book } from "@/lib/mock-data";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, UploadCloud } from "lucide-react";

const uploadBookSchema = z.object({
  bookTitle: z.string().min(3, "Title must be at least 3 characters"),
  bookAuthor: z.string().min(3, "Author must be at least 3 characters"),
  bookDescription: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  pdfFile: z.any().refine(files => files?.length > 0, "A PDF file is required."),
});
type UploadBookValues = z.infer<typeof uploadBookSchema>;


export default function AdminPage() {
    const { isAdmin, isLoggedIn } = useAuth();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isLoggedIn || !isAdmin) {
                router.replace('/login');
            } else {
                setIsCheckingAuth(false);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isLoggedIn, isAdmin, router]);

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return <AdminDashboard />;
}

function AdminDashboard() {
  const [currentBooks, setCurrentBooks] = useState<Book[]>(books);
  const { toast } = useToast();

  const handleDelete = (bookId: string) => {
    setCurrentBooks(prev => prev.filter(book => book.id !== bookId));
    toast({
      title: "Book Deleted",
      description: "The book has been removed from the library.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline text-primary mb-8">Admin Dashboard</h1>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <UploadBookForm onBookAdded={(newBook) => setCurrentBooks(prev => [newBook, ...prev])} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Manage Books</CardTitle>
              <CardDescription>View and delete existing books from the library.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBooks.map(book => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function UploadBookForm({ onBookAdded }: { onBookAdded: (book: Book) => void }) {
  const { toast } = useToast();
  const [generateSummary, { data: summaryData, loading }] = useFlow(generateBookSummary);

  const form = useForm<UploadBookValues>({
    resolver: zodResolver(uploadBookSchema),
    defaultValues: {
      bookTitle: "",
      bookAuthor: "",
      bookDescription: "",
      category: "",
    },
  });

  async function onSubmit(values: UploadBookValues) {
    try {
      const summaryResult = await generateSummary({
        bookTitle: values.bookTitle,
        bookDescription: values.bookDescription,
      });

      if (summaryResult?.summary) {
        const newBook: Book = {
            id: (Math.random() * 1000).toString(),
            title: values.bookTitle,
            author: values.bookAuthor,
            description: values.bookDescription,
            category: values.category,
            imageUrl: "https://placehold.co/400x600/3F51B5/E8EAF6",
            data_ai_hint: "book cover",
            likes: 0,
            dislikes: 0,
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            summary: summaryResult.summary
        };
        onBookAdded(newBook);
        toast({
          title: "Book Uploaded Successfully!",
          description: `"${values.bookTitle}" has been added with an AI-generated summary.`,
        });
        form.reset();
      } else {
        throw new Error("Failed to generate summary.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error processing the book.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><UploadCloud /> Upload New Book</CardTitle>
        <CardDescription>Fill in the details to add a new book and generate its summary.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bookTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Title</FormLabel>
                  <FormControl><Input placeholder="Introduction to Algorithms" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookAuthor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl><Input placeholder="Thomas H. Cormen" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="A brief description of the book..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {bookCategories.filter(c => c !== "All").map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pdfFile"
              render={({ field }) => (
                 <FormItem>
                    <FormLabel>PDF File</FormLabel>
                    <FormControl>
                        <Input type="file" accept=".pdf" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                 </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating & Uploading...
                </>
              ) : (
                "Upload Book"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
