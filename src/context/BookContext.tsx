'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { books as initialBooks, type Book } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface BookContextType {
  books: Book[];
  addBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  findBookById: (id: string) => Book | undefined;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

const BOOKS_STORAGE_KEY = 'btechlib_books';

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.error("Could not access local storage for books:", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
      } catch (error) {
        console.error("Could not write to local storage for books:", error);
      }
    }
  }, [books, isLoaded]);

  const addBook = (book: Book) => {
    setBooks(prevBooks => [book, ...prevBooks]);
  };

  const deleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(book => book.id !== bookId));
    toast({
      title: "Book Deleted",
      description: "The book has been removed from the library.",
    });
  };
  
  const findBookById = (id: string): Book | undefined => {
    return books.find(b => b.id === id);
  };

  return (
    <BookContext.Provider value={{ books, addBook, deleteBook, findBookById }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
