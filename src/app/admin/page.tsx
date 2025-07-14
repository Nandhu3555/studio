
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { recentActivity, type Activity, type Book } from "@/lib/mock-data";
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
import { Loader2, Trash2, UploadCloud, Users, BookOpen, FolderKanban, Download, UserPlus, Bookmark, PlusCircle } from "lucide-react";
import { useBooks } from "@/context/BookContext";
import { useUsers } from "@/context/UserContext";
import { useCategories } from "@/context/CategoryContext";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];


const uploadBookSchema = z.object({
  bookTitle: z.string().min(3, "Title must be at least 3 characters"),
  bookAuthor: z.string().min(3, "Author must be at least 3 characters"),
  year: z.coerce.number().min(1000, "Please enter a valid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  bookDescription: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  imageFile: z
    .any()
    .refine((files) => files?.length === 1, "Book image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  documentFile: z
    .any()
    .refine((files) => files?.length === 1, "A document file is required.")
    .refine(
      (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .doc, .docx, .ppt, .pptx files are accepted."
    ),
});
type UploadBookValues = z.infer<typeof uploadBookSchema>;

const addCategorySchema = z.object({
    categoryName: z.string().min(3, "Category name must be at least 3 characters"),
});
type AddCategoryValues = z.infer<typeof addCategorySchema>;


export default function AdminPage() {
    const { isAdmin, isLoggedIn, isAuthReady } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthReady) {
            if (!isLoggedIn || !isAdmin) {
                router.replace('/login');
            }
        }
    }, [isLoggedIn, isAdmin, isAuthReady, router]);

    if (!isAuthReady || !isLoggedIn || !isAdmin) {
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
  const { books } = useBooks();
  const { users } = useUsers();
  const { categories } = useCategories();
  const totalCategories = categories.filter(c => c !== "All").length;

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
                 <div className="grid md:grid-cols-2 gap-8">
                    <ManageBooksCard />
                    <ManageCategoriesCard />
                 </div>
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

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function UploadBookForm() {
  const { addBook } = useBooks();
  const { categories } = useCategories();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<UploadBookValues>({
    resolver: zodResolver(uploadBookSchema),
    defaultValues: {
      bookTitle: "",
      bookAuthor: "",
      bookDescription: "",
      category: "",
      year: undefined,
      imageFile: undefined,
      documentFile: undefined,
    },
  });

  async function onSubmit(values: UploadBookValues) {
    setLoading(true);
    try {
      const [imageUrl, documentUrl] = await Promise.all([
        fileToDataUrl(values.imageFile[0]),
        fileToDataUrl(values.documentFile[0]),
      ]);

      const newBook: Book = {
          id: (Math.random() * 1000).toString(),
          title: values.bookTitle,
          author: values.bookAuthor,
          year: values.year,
          description: values.bookDescription,
          category: values.category,
          imageUrl: imageUrl,
          data_ai_hint: "",
          likes: 0,
          dislikes: 0,
          documentUrl: documentUrl,
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
          language: "English",
          pages: Math.floor(Math.random() * 300) + 200,
          publisher: "Tech Books Inc.",
      };
      addBook(newBook);
      toast({
        title: "Book Uploaded Successfully!",
        description: `"${values.bookTitle}" has been added to the library.`,
      });
      form.reset();
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
        <CardDescription>Fill in the details to add a new book to the library.</CardDescription>
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
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Year</FormLabel>
                  <FormControl><Input type="number" placeholder={`e.g. ${new Date().getFullYear()}`} {...field} value={field.value ?? ''} /></FormControl>
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
                            {categories.filter(c => c !== "All").map(cat => (
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
              name="imageFile"
              render={({ field }) => (
                 <FormItem>
                    <FormLabel>Book Image</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                 </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentFile"
              render={({ field }) => (
                 <FormItem>
                    <FormLabel>Book Document</FormLabel>
                    <FormControl>
                        <Input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                 </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
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

function ManageBooksCard() {
    const { books, deleteBook } = useBooks();
    return (
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Manage Books</CardTitle>
            <CardDescription>View and delete existing books.</CardDescription>
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
    );
}

function ManageCategoriesCard() {
    const { categories, addCategory, deleteCategory } = useCategories();
    const form = useForm<AddCategoryValues>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: { categoryName: "" },
    });

    function onSubmit(values: AddCategoryValues) {
        addCategory(values.categoryName);
        form.reset();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manage Categories</CardTitle>
                <CardDescription>Add or delete book categories.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 mb-4">
                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl><Input placeholder="New category name..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" size="icon" aria-label="Add category">
                            <PlusCircle className="h-5 w-5" />
                        </Button>
                    </form>
                </Form>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.filter(c => c !== "All").map(category => (
                            <TableRow key={category}>
                                <TableCell className="font-medium">{category}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(category)}>
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
    );
}
