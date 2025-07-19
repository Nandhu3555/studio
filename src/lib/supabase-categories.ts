import { supabase } from './supabase'
import type { Database } from './supabase'

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function createCategory(name: string) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateCategory(id: string, name: string) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}