import { supabase } from './supabase'
import type { Database } from './supabase'

type Book = Database['public']['Tables']['books']['Row']
type BookInsert = Database['public']['Tables']['books']['Insert']
type BookUpdate = Database['public']['Tables']['books']['Update']

export async function getBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getBookById(id: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createBook(book: BookInsert) {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBook(id: string, updates: BookUpdate) {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBook(id: string) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getBooksByCategory(category: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getBooksByStudyYear(studyYear: number) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('study_year', studyYear)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function searchBooks(query: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateBookLikes(id: string, likes: number) {
  const { data, error } = await supabase
    .from('books')
    .update({ likes })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBookDislikes(id: string, dislikes: number) {
  const { data, error } = await supabase
    .from('books')
    .update({ dislikes })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}