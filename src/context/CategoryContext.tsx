'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { categories as initialCategories } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface CategoryContextType {
  categories: string[];
  addCategory: (categoryName: string) => void;
  deleteCategory: (categoryName: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const CATEGORIES_STORAGE_KEY = 'btechlib_categories';


export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        return storedCategories ? JSON.parse(storedCategories) : initialCategories;
      }
    } catch (error) {
      console.error("Could not access local storage for categories:", error);
    }
    return initialCategories;
  });
  
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Could not write to local storage for categories:", error);
    }
  }, [categories]);

  const addCategory = (categoryName: string) => {
    if (categories.find(c => c.toLowerCase() === categoryName.toLowerCase())) {
        toast({
            variant: "destructive",
            title: "Category Exists",
            description: `A category named "${categoryName}" already exists.`,
        });
        return;
    }
    setCategories(prev => [...prev, categoryName]);
    toast({
        title: "Category Added",
        description: `"${categoryName}" has been added to the library categories.`,
    });
  };

  const deleteCategory = (categoryName: string) => {
    if (categoryName === "All") return; // "All" cannot be deleted
    setCategories(prev => prev.filter(c => c !== categoryName));
    toast({
      title: "Category Deleted",
      description: `"${categoryName}" has been removed from the library categories.`,
    });
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
