
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Book, type QuestionPaper } from "@/lib/mock-data";
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
import { Loader2, Trash2, UploadCloud, Users, BookOpen, FolderKanban, Download, UserPlus, Bookmark, PlusCircle, FileText, UserRound } from "lucide-react";
import { useBooks } from "@/context/BookContext";
import { useUsers } from "@/context/UserContext";
import { useCategories } from "@/context/CategoryContext";
import { useNotifications } from "@/context/NotificationContext";
import { useQuestionPapers } from "@/context/QuestionPaperContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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
  studyYear: z.string().min(1, "Please select a study year"),
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

const uploadPaperSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  year: z.coerce.number().min(2000, "Please enter a valid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  semester: z.string().min(1, "Please select a semester"),
  branch: z.string().min(1, "Please select a branch"),
  studyYear: z.string().min(1, "Please select a study year"),
  documentFile: z
    .any()
    .refine((files) => files?.length === 1, "A document file is required.")
    .refine(
      (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .doc, .docx, .ppt, .pptx files are accepted."
    ),
});
type UploadPaperValues = z.infer<typeof uploadPaperSchema>;


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

function AdminDashboard() {
  const { books } = useBooks();
  const { users } = useUsers();
  const { categories } = useCategories();
  const { papers } = useQuestionPapers();
  const totalCategories = categories.filter(c => c !== "All").length;

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your digital library</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard icon={<Users className="h-5 w-5" />} title="Total Users" value={users.length} color="text-blue-500" />
            <StatCard icon={<BookOpen className="h-5 w-5" />} title="Total Books" value={books.length} color="text-green-500" />
            <StatCard icon={<FileText className="h-5 w-5" />} title="Total Papers" value={papers.length} color="text-purple-500" />
            <StatCard icon={<FolderKanban className="h-5 w-5" />} title="Categories" value={totalCategories} color="text-orange-500" />
        </div>
      
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <UploadBookForm />
                <UploadExamPaperForm />
                 <div className="grid md:grid-cols-2 gap-8">
                    <ManageBooksCard />
                    <ManageCategoriesCard />
                 </div>
                <ManageQuestionPapersCard />
            </div>
            <div className="lg:col-span-1">
                <ManageUsersCard />
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
  const { addNotification } = useNotifications();
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
      studyYear: "",
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
          studyYear: parseInt(values.studyYear),
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
      addNotification({
        type: 'new_book',
        title: 'New Book Added!',
        description: `"${values.bookTitle}" is now available in the library.`,
      });
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
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  name="studyYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Study Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a year" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="1">1st Year</SelectItem>
                                <SelectItem value="2">2nd Year</SelectItem>
                                <SelectItem value="3">3rd Year</SelectItem>
                                <SelectItem value="4">4th Year</SelectItem>
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
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

function UploadExamPaperForm() {
    const { addPaper } = useQuestionPapers();
    const { categories } = useCategories();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<UploadPaperValues>({
        resolver: zodResolver(uploadPaperSchema),
        defaultValues: {
            subject: "",
            year: undefined,
            semester: "",
            branch: "",
            studyYear: "",
            documentFile: undefined,
        },
    });

    async function onSubmit(values: UploadPaperValues) {
        setLoading(true);
        try {
            const documentUrl = await fileToDataUrl(values.documentFile[0]);
            
            const newPaper: Omit<QuestionPaper, 'id'> = {
              subject: values.subject,
              year: values.year,
              semester: values.semester,
              branch: values.branch,
              studyYear: `${values.studyYear}${parseInt(values.studyYear) === 1 ? 'st' : parseInt(values.studyYear) === 2 ? 'nd' : parseInt(values.studyYear) === 3 ? 'rd' : 'th'} Year`,
              documentUrl: documentUrl
            };
            addPaper(newPaper);
            
            toast({
                title: "Exam Paper Uploaded!",
                description: `"${values.subject}" paper has been uploaded.`,
            });
            form.reset();
        } catch (error) {
            console.error("Error uploading exam paper:", error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "There was an error processing the exam paper.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><FileText /> Upload Exam Paper</CardTitle>
                <CardDescription>Add a new question paper to the collection.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl><Input placeholder="Data Structures & Algorithms" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Exam Year</FormLabel>
                                        <FormControl><Input type="number" placeholder={`e.g. ${new Date().getFullYear()}`} {...field} value={field.value ?? ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="semester"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semester</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a semester" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                                                <SelectItem value="Final">Final</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a branch" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.filter(c => c !== "All" && c !== "Mathematics").map(cat => (
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
                                name="studyYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Study Year</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a year" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">1st Year</SelectItem>
                                                <SelectItem value="2">2nd Year</SelectItem>
                                                <SelectItem value="3">3rd Year</SelectItem>
                                                <SelectItem value="4">4th Year</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="documentFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Paper Document</FormLabel>
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
                                    Uploading Paper...
                                </>
                            ) : (
                                "Upload Paper"
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

function ManageQuestionPapersCard() {
    const { papers, deletePaper } = useQuestionPapers();
    return (
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Manage Question Papers</CardTitle>
            <CardDescription>View and delete existing question papers.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {papers.map(paper => (
                    <TableRow key={paper.id}>
                    <TableCell className="font-medium">{paper.subject}</TableCell>
                    <TableCell>{paper.year}</TableCell>
                    <TableCell>{paper.branch}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deletePaper(paper.id)}>
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
    
function ManageUsersCard() {
    const { users } = useUsers();

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><UserRound /> Manage Users</CardTitle>
                <CardDescription>View registered student accounts.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                                <Avatar>
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        ))}
                         {users.length === 0 && (
                            <p className="text-sm text-center text-muted-foreground py-4">No users have signed up yet.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

