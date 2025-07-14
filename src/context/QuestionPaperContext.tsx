
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { questionPapers as initialQuestionPapers, type QuestionPaper } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface QuestionPaperContextType {
  papers: QuestionPaper[];
  addPaper: (paper: Omit<QuestionPaper, 'id'>) => void;
  deletePaper: (paperId: string) => void;
}

const QuestionPaperContext = createContext<QuestionPaperContextType | undefined>(undefined);

const PAPERS_STORAGE_KEY = 'btechlib_question_papers';

export function QuestionPaperProvider({ children }: { children: ReactNode }) {
  const [papers, setPapers] = useState<QuestionPaper[]>(initialQuestionPapers);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPapers = localStorage.getItem(PAPERS_STORAGE_KEY);
      if (storedPapers) {
        setPapers(JSON.parse(storedPapers));
      }
    } catch (error) {
      console.error("Could not access local storage for question papers:", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(papers));
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
            console.error("Could not write to local storage for question papers:", error);
        }
      }
    }
  }, [papers, isLoaded, toast]);

  const addPaper = (paper: Omit<QuestionPaper, 'id'>) => {
    setPapers(prevPapers => {
      const newPaper = { ...paper, id: (Math.random() * 1000).toString() };
      return [newPaper, ...prevPapers];
    });
  };

  const deletePaper = (paperId: string) => {
    setPapers(prev => prev.filter(paper => paper.id !== paperId));
    toast({
      title: "Question Paper Deleted",
      description: "The paper has been removed.",
    });
  };

  return (
    <QuestionPaperContext.Provider value={{ papers, addPaper, deletePaper }}>
      {children}
    </QuestionPaperContext.Provider>
  );
}

export function useQuestionPapers() {
  const context = useContext(QuestionPaperContext);
  if (context === undefined) {
    throw new Error('useQuestionPapers must be used within a QuestionPaperProvider');
  }
  return context;
}
