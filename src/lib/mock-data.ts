

export type Remark = {
  id: string;
  text: string;
  author: string;
  avatarUrl?: string;
  timestamp: string;
}

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  imageUrl: string;
  data_ai_hint: string;
  likes: number;
  dislikes: number;
  documentUrl: string;
  summary?: string;
  year: number;
  studyYear: number;
  rating: number;
  language: string;
  pages: number;
  publisher: string;
  remarks?: Remark[];
};

export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    branch: string;
    year: number;
    avatarUrl?: string;
};

export type Activity = {
    id: string;
    type: 'new_user' | 'download' | 'bookmark';
    user: string;
    book?: string;
    timestamp: Date;
};

export type Notification = {
    id: string;
    type: 'new_book' | 'new_user' | 'password_changed';
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
};

export type QuestionPaper = {
  id: string;
  subject: string;
  year: number;
  semester: string;
  examType: string;
  branch: string;
  studyYear: string;
  documentUrl: string;
};


export const categories = [
  "All",
  "Computer Science",
  "Mechanical",
  "Electronics",
  "Civil",
  "Mathematics",
];

export const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john.d@example.com', createdAt: new Date('2024-07-26T10:00:00Z'), branch: 'Computer Science', year: 3 },
    { id: '2', name: 'Emily Davis', email: 'emily.d@example.com', createdAt: new Date('2024-07-28T14:30:00Z'), branch: 'Mechanical', year: 2 },
    { id: '3', name: 'Jane Smith', email: 'jane.s@example.com', createdAt: new Date('2024-07-29T09:00:00Z'), branch: 'Electronics', year: 4 },
];

export const recentActivity: Activity[] = [
    { id: '1', type: 'download', user: 'John Doe', book: 'Data Structures & Algorithms', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', type: 'new_user', user: 'Emily Davis', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: '3', type: 'bookmark', user: 'Jane Smith', book: 'Digital Electronics', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
];

export const notifications: Notification[] = [
    {
        id: '1',
        type: 'new_book',
        title: 'New Book Added!',
        description: '"Artificial Intelligence: A Modern Approach" is now available.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
    },
    {
        id: '2',
        type: 'new_user',
        title: 'Account Created',
        description: 'Welcome to B-Tech Lib! Start exploring our collection.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false,
    },
    {
        id: '3',
        type: 'password_changed',
        title: 'Security Alert',
        description: 'Your password was changed successfully.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true,
    }
];

export const questionPapers: QuestionPaper[] = [
  { id: "1", subject: "Data Structures & Algorithms", year: 2023, semester: "3rd Sem", examType: "Mid-1", branch: "Computer Science", studyYear: "2nd Year", documentUrl: "" },
  { id: "2", subject: "Computer Networks", year: 2023, semester: "6th Sem", examType: "Sem", branch: "Computer Science", studyYear: "3rd Year", documentUrl: "" },
  { id: "3", subject: "Advanced Engineering Mathematics", year: 2022, semester: "2nd Sem", examType: "Sem", branch: "Mathematics", studyYear: "1st Year", documentUrl: "" },
  { id: "4", subject: "Shigley's Mechanical Engineering Design", year: 2023, semester: "5th Sem", examType: "Mid-2", branch: "Mechanical", studyYear: "3rd Year", documentUrl: "" },
  { id: "5", subject: "Structural Analysis", year: 2022, semester: "8th Sem", examType: "Sem", branch: "Civil", studyYear: "4th Year", documentUrl: "" },
  { id: "6", subject: "Microelectronic Circuits", year: 2023, semester: "4th Sem", examType: "Sem", branch: "Electronics", studyYear: "2nd Year", documentUrl: "" },
  { id: "7", subject: "Theory of Machines", year: 2022, semester: "4th Sem", examType: "Sem", branch: "Mechanical", studyYear: "2nd Year", documentUrl: "" },
  { id: "8", subject: "Database Management Systems", year: 2023, semester: "4th Sem", examType: "Mid-1", branch: "Computer Science", studyYear: "2nd Year", documentUrl: "" },
];


export const books: Book[] = [
  {
    id: "1",
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    category: "Computer Science",
    imageUrl: "https://placehold.co/400x600/3F51B5/E8EAF6",
    data_ai_hint: "book cover",
    likes: 125,
    dislikes: 10,
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This book provides a comprehensive introduction to the modern study of computer algorithms. It covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
    year: 2010,
    studyYear: 3,
    rating: 4.5,
    language: "English",
    pages: 450,
    publisher: "Academic Press",
    remarks: [],
  },
  {
    id: "2",
    title: "Shigley's Mechanical Engineering Design",
    author: "Richard G. Budynas",
    description: "The definitive book on mechanical engineering design, providing a solid foundation in the concepts of design and analysis.",
    category: "Mechanical",
    imageUrl: "https://placehold.co/400x600/7E57C2/E8EAF6",
    data_ai_hint: "gears machinery",
    likes: 98,
    dislikes: 5,
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Shigley's Mechanical Engineering Design is the standard for teaching students the theory and practice of mechanical design. The book provides a solid foundation in the concepts of design and analysis.",
    year: 2014,
    studyYear: 2,
    rating: 4.7,
    language: "English",
    pages: 1056,
    publisher: "McGraw-Hill",
    remarks: [],
  },
  {
    id: "3",
    title: "Microelectronic Circuits",
    author: "Adel S. Sedra",
    description: "A classic text for electronics engineering students, this book continues its standard of excellence and innovation by building on a solid pedagogical foundation.",
    category: "Electronics",
    imageUrl: "https://placehold.co/400x600/3F51B5/E8EAF6",
    data_ai_hint: "circuit board",
    likes: 150,
    dislikes: 8,
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This market-leading textbook continues its standard of excellence and innovation by building on the solid pedagogical foundation that instructors expect from Adel S. Sedra and Kenneth C. Smith.",
    year: 2015,
    studyYear: 3,
    rating: 4.6,
    language: "English",
    pages: 1280,
    publisher: "Oxford University Press",
    remarks: [],
  },
  {
    id: "4",
    title: "Structural Analysis",
    author: "R. C. Hibbeler",
    description: "Learn the principles of structural analysis. This textbook provides students with a clear and thorough presentation of the theory and application of structural analysis as it applies to trusses, beams, and frames.",
    category: "Civil",
    imageUrl: "https://placehold.co/400x600/7E57C2/E8EAF6",
    data_ai_hint: "bridge architecture",
    likes: 77,
    dislikes: 12,
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Structural Analysis is a textbook that provides students with a clear and thorough presentation of the theory and application of structural analysis as it applies to trusses, beams, and frames.",
    year: 2011,
    studyYear: 4,
    rating: 4.4,
    language: "English",
    pages: 864,
    publisher: "Prentice Hall",
    remarks: [],
  },
  {
    id: "5",
    title: "Advanced Engineering Mathematics",
    author: "Erwin Kreyszig",
    description: "A comprehensive mathematics reference for engineers, known for its comprehensive coverage, careful and correct mathematics, and outstanding exercises.",
    category: "Mathematics",
    imageUrl: "https://placehold.co/400x600/3F51B5/E8EAF6",
    data_ai_hint: "math equations",
    likes: 210,
    dislikes: 3,
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This market-leading text is known for its comprehensive coverage, careful and correct mathematics, outstanding exercises, and self-contained subject matter parts for maximum flexibility.",
    year: 2011,
    studyYear: 1,
    rating: 4.8,
    language: "English",
    pages: 1152,
    publisher: "Wiley",
    remarks: [],
  },
  {
    id: "6",
    title: "The C Programming Language",
    author: "Brian W. Kernighan",
    description: "The original and definitive book on the C language. Often referred to as K&R, this book is a classic in the field of computer science.",
    category: "Computer Science",
    imageUrl: "https://placehold.co/400x600/7E57C2/E8EAF6",
    data_ai_hint: "code computer",
    likes: 300,
    dislikes: 2,
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Often referred to as K&R, this book is a classic in the field of computer science. It provides a complete guide to the C programming language, with an emphasis on system programming.",
    year: 1988,
    studyYear: 2,
    rating: 4.9,
    language: "English",
    pages: 272,
    publisher: "Prentice Hall",
    remarks: [],
  }
];
