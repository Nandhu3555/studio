import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          branch: string
          year: number
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          branch: string
          year: number
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          branch?: string
          year?: number
          avatar_url?: string | null
          created_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          description: string
          category: string
          image_url: string
          document_url: string
          likes: number
          dislikes: number
          year: number
          study_year: number
          rating: number
          language: string
          pages: number
          publisher: string
          summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description: string
          category: string
          image_url: string
          document_url: string
          likes?: number
          dislikes?: number
          year: number
          study_year: number
          rating?: number
          language?: string
          pages?: number
          publisher?: string
          summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          description?: string
          category?: string
          image_url?: string
          document_url?: string
          likes?: number
          dislikes?: number
          year?: number
          study_year?: number
          rating?: number
          language?: string
          pages?: number
          publisher?: string
          summary?: string | null
          created_at?: string
        }
      }
      remarks: {
        Row: {
          id: string
          book_id: string
          user_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          user_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          user_id?: string
          text?: string
          created_at?: string
        }
      }
      question_papers: {
        Row: {
          id: string
          subject: string
          year: number
          semester: string
          exam_type: string
          branch: string
          study_year: string
          document_url: string
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          year: number
          semester: string
          exam_type: string
          branch: string
          study_year: string
          document_url: string
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          year?: number
          semester?: string
          exam_type?: string
          branch?: string
          study_year?: string
          document_url?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}