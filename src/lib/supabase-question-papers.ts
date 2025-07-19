import { supabase } from './supabase'
import type { Database } from './supabase'

type QuestionPaper = Database['public']['Tables']['question_papers']['Row']
type QuestionPaperInsert = Database['public']['Tables']['question_papers']['Insert']
type QuestionPaperUpdate = Database['public']['Tables']['question_papers']['Update']

export async function getQuestionPapers() {
  const { data, error } = await supabase
    .from('question_papers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getQuestionPaperById(id: string) {
  const { data, error } = await supabase
    .from('question_papers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createQuestionPaper(paper: QuestionPaperInsert) {
  const { data, error } = await supabase
    .from('question_papers')
    .insert(paper)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateQuestionPaper(id: string, updates: QuestionPaperUpdate) {
  const { data, error } = await supabase
    .from('question_papers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteQuestionPaper(id: string) {
  const { error } = await supabase
    .from('question_papers')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getQuestionPapersByBranch(branch: string) {
  const { data, error } = await supabase
    .from('question_papers')
    .select('*')
    .eq('branch', branch)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getQuestionPapersByStudyYear(studyYear: string) {
  const { data, error } = await supabase
    .from('question_papers')
    .select('*')
    .eq('study_year', studyYear)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function searchQuestionPapers(query: string) {
  const { data, error } = await supabase
    .from('question_papers')
    .select('*')
    .ilike('subject', `%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}