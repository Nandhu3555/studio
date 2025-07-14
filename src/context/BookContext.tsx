'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { books as initialBooks, type Book } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface BookContextType {
  books: Book[];
  addBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  findBookById: (id: string) => Book | undefined;
  updateBook: (bookId: string, data: Partial<Book>) => void;
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

  const saveBooks = (booksToSave: Book[]) => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(booksToSave));
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
        console.warn("LocalStorage quota exceeded. The latest changes will not be persisted.");
        toast({
          variant: "destructive",
          title: "File Too Large to Save",
          description: "The uploaded file is too large to be saved for future sessions. It will remain available until you refresh the page.",
          duration: 9000,
        });
      } else {
        console.error("Could not write to local storage for books:", error);
      }
    }
  };

  const addBook = (book: Book) => {
    setBooks(prevBooks => {
      const newBooks = [{ ...book, remarks: [] }, ...prevBooks];
      saveBooks(newBooks);
      return newBooks;
    });
  };

  const deleteBook = (bookId: string) => {
    setBooks(prev => {
        const newBooks = prev.filter(book => book.id !== bookId);
        saveBooks(newBooks);
        return newBooks;
    });
    toast({
      title: "Book Deleted",
      description: "The book has been removed from the library.",
    });
  };
  
  const findBookById = (id: string): Book | undefined => {
    return books.find(b => b.id === id);
  };

  const updateBook = (bookId: string, data: Partial<Book>) => {
    setBooks(prev => {
        const newBooks = prev.map(book => book.id === bookId ? { ...book, ...data } : book);
        saveBooks(newBooks);
        return newBooks;
    });
  };

  return (
    <BookContext.Provider value={{ books, addBook, deleteBook, findBookById, updateBook }}>
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
