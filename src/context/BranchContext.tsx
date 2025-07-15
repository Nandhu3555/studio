
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Initial set of branches for exam papers
const initialBranches = [
    "All",
    "Computer Science",
    "Mechanical",
    "Electronics",
    "Civil"
];

interface BranchContextType {
  branches: string[];
  addBranch: (branchName: string) => void;
  deleteBranch: (branchName: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const BRANCHES_STORAGE_KEY = 'btechlib_branches';

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<string[]>(initialBranches);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedBranches = localStorage.getItem(BRANCHES_STORAGE_KEY);
        if (storedBranches) {
            setBranches(JSON.parse(storedBranches));
        }
    } catch (error) {
      console.error("Could not access local storage for branches:", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
        try {
          localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(branches));
        } catch (error) {
          console.error("Could not write to local storage for branches:", error);
        }
    }
  }, [branches, isLoaded]);

  const addBranch = (branchName: string) => {
    if (branches.find(b => b.toLowerCase() === branchName.toLowerCase())) {
        toast({
            variant: "destructive",
            title: "Branch Exists",
            description: `A branch named "${branchName}" already exists.`,
        });
        return;
    }
    setBranches(prev => [...prev, branchName]);
    toast({
        title: "Branch Added",
        description: `"${branchName}" has been added.`,
    });
  };

  const deleteBranch = (branchName: string) => {
    if (branchName === "All") return; // "All" cannot be deleted
    setBranches(prev => prev.filter(b => b !== branchName));
    toast({
      title: "Branch Deleted",
      description: `"${branchName}" has been removed.`,
    });
  };

  return (
    <BranchContext.Provider value={{ branches, addBranch, deleteBranch }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranches() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranches must be used within a BranchProvider');
  }
  return context;
}
