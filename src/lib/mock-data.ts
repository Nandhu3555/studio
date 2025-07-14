
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
  pdfUrl: string;
  summary?: string;
  year: number;
  rating: number;
  language: string;
  pages: number;
  publisher: string;
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
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This book provides a comprehensive introduction to the modern study of computer algorithms. It covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
    year: 2010,
    rating: 4.5,
    language: "English",
    pages: 450,
    publisher: "Academic Press",
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
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Shigley's Mechanical Engineering Design is the standard for teaching students the theory and practice of mechanical design. The book provides a solid foundation in the concepts of design and analysis.",
    year: 2014,
    rating: 4.7,
    language: "English",
    pages: 1056,
    publisher: "McGraw-Hill",
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
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This market-leading textbook continues its standard of excellence and innovation by building on the solid pedagogical foundation that instructors expect from Adel S. Sedra and Kenneth C. Smith.",
    year: 2015,
    rating: 4.6,
    language: "English",
    pages: 1280,
    publisher: "Oxford University Press",
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
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Structural Analysis is a textbook that provides students with a clear and thorough presentation of the theory and application of structural analysis as it applies to trusses, beams, and frames.",
    year: 2011,
    rating: 4.4,
    language: "English",
    pages: 864,
    publisher: "Prentice Hall",
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
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This market-leading text is known for its comprehensive coverage, careful and correct mathematics, outstanding exercises, and self-contained subject matter parts for maximum flexibility.",
    year: 2011,
    rating: 4.8,
    language: "English",
    pages: 1152,
    publisher: "Wiley",
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
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Often referred to as K&R, this book is a classic in the field of computer science. It provides a complete guide to the C programming language, with an emphasis on system programming.",
    year: 1988,
    rating: 4.9,
    language: "English",
    pages: 272,
    publisher: "Prentice Hall",
  }
];
