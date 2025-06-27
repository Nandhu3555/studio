"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateBookSummary } from "@/ai/flows/generate-book-summary";
import { categories as bookCategories, recentActivity, type Activity, type Book } from "@/lib/mock-data";
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
import { Loader2, Trash2, UploadCloud, Users, BookOpen, FolderKanban, Download, UserPlus, Bookmark } from "lucide-react";
import { useBooks } from "@/context/BookContext";
import { useUsers } from "@/context/UserContext";

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

function StatCard({ icon, title, value, color }: { icon: ReactNode, title: string, value: string | number, color: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
};

const activityIcons: Record<Activity['type'], ReactNode> = {
    download: <Download className="h-4 w-4 text-primary" />,
    new_user: <UserPlus className="h-4 w-4 text-green-500" />,
    bookmark: <Bookmark className="h-4 w-4 text-orange-500" />,
};

const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'download':
        return <p className="text-sm text-muted-foreground"><strong>{activity.user}</strong> downloaded <strong>{activity.book}</strong></p>;
      case 'new_user':
        return <p className="text-sm text-muted-foreground"><strong>{activity.user}</strong> created an account</p>;
      case 'bookmark':
        return <p className="text-sm text-muted-foreground"><strong>{activity.user}</strong> bookmarked <strong>{activity.book}</strong></p>;
      default:
        return null;
    }
};

function AdminDashboard() {
  const { books, deleteBook } = useBooks();
  const { users } = useUsers();
  const totalCategories = bookCategories.filter(c => c !== "All").length;

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your digital library</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard icon={<Users className="h-5 w-5" />} title="Total Users" value={users.length} color="text-blue-500" />
            <StatCard icon={<BookOpen className="h-5 w-5" />} title="Total Books" value={books.length} color="text-green-500" />
            <StatCard icon={<FolderKanban className="h-5 w-5" />} title="Categories" value={totalCategories} color="text-orange-500" />
        </div>
      
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <UploadBookForm />
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
                        {books.map(book => (
                            <TableRow key={book.id}>
                            <TableCell className="font-medium">{book.title}</TableCell>
                            <TableCell>{book.category}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => deleteBook(book.id)}>
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
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="bg-secondary p-2 rounded-full mt-1">
                                    {activityIcons[activity.type]}
                                </div>
                                <div className="flex-1">
                                    {getActivityText(activity)}
                                    <p className="text-xs text-muted-foreground/70">{getTimeAgo(activity.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

function UploadBookForm() {
  const { addBook } = useBooks();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const summaryResult = await generateBookSummary({
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
        addBook(newBook);
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
    } finally {
        setLoading(false);
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
