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
};

export const categories = [
  "All",
  "Computer Science",
  "Mechanical",
  "Electronics",
  "Civil",
  "Mathematics",
];

export const books: Book[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    description: "A comprehensive guide to algorithms and data structures.",
    category: "Computer Science",
    imageUrl: "https://placehold.co/400x600/3F51B5/E8EAF6",
    data_ai_hint: "book cover",
    likes: 125,
    dislikes: 10,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This book provides a comprehensive introduction to the modern study of computer algorithms. It covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers."
  },
  {
    id: "2",
    title: "Shigley's Mechanical Engineering Design",
    author: "Richard G. Budynas",
    description: "The definitive book on mechanical engineering design.",
    category: "Mechanical",
    imageUrl: "https://placehold.co/400x600/7E57C2/E8EAF6",
    data_ai_hint: "gears machinery",
    likes: 98,
    dislikes: 5,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Shigley's Mechanical Engineering Design is the standard for teaching students the theory and practice of mechanical design. The book provides a solid foundation in the concepts of design and analysis."
  },
  {
    id: "3",
    title: "Microelectronic Circuits",
    author: "Adel S. Sedra",
    description: "A classic text for electronics engineering students.",
    category: "Electronics",
    imageUrl: "https://placehold.co/400x600/3F51B5/E8EAF6",
    data_ai_hint: "circuit board",
    likes: 150,
    dislikes: 8,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This market-leading textbook continues its standard of excellence and innovation by building on the solid pedagogical foundation that instructors expect from Adel S. Sedra and Kenneth C. Smith."
  },
  {
    id: "4",
    title: "Structural Analysis",
    author: "R. C. Hibbeler",
    description: "Learn the principles of structural analysis.",
    category: "Civil",
    imageUrl: "https://placehold.co/400x600/7E57C2/E8EAF6",
    data_ai_hint: "bridge architecture",
    likes: 77,
    dislikes: 12,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Structural Analysis is a textbook that provides students with a clear and thorough presentation of the theory and application of structural analysis as it applies to trusses, beams, and frames."
  },
  {
    id: "5",
    title: "Advanced Engineering Mathematics",
    author: "Erwin Kreyszig",
    description: "A comprehensive mathematics reference for engineers.",
    category: "Mathematics",
    imageUrl: "https://placehold.co/400x600/3F51B5/E8EAF6",
    data_ai_hint: "math equations",
    likes: 210,
    dislikes: 3,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "This market-leading text is known for its comprehensive coverage, careful and correct mathematics, outstanding exercises, and self-contained subject matter parts for maximum flexibility."
  },
  {
    id: "6",
    title: "The C Programming Language",
    author: "Brian W. Kernighan",
    description: "The original and definitive book on the C language.",
    category: "Computer Science",
    imageUrl: "https://placehold.co/400x600/7E57C2/E8EAF6",
    data_ai_hint: "code computer",
    likes: 300,
    dislikes: 2,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    summary: "Often referred to as K&R, this book is a classic in the field of computer science. It provides a complete guide to the C programming language, with an emphasis on system programming."
  }
];
