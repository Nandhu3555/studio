import { supabase } from './supabase'
import type { Database } from './supabase'

type Remark = Database['public']['Tables']['remarks']['Row']
type RemarkInsert = Database['public']['Tables']['remarks']['Insert']

export async function getRemarksByBookId(bookId: string) {
  const { data, error } = await supabase
    .from('remarks')
    .select(`
      *,
      users (
        name,
        avatar_url
      )
    `)
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createRemark(remark: RemarkInsert) {
  const { data, error } = await supabase
    .from('remarks')
    .insert(remark)
    .select(`
      *,
      users (
        name,
        avatar_url
      )
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteRemark(id: string) {
  const { error } = await supabase
    .from('remarks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateRemark(id: string, text: string) {
  const { data, error } = await supabase
    .from('remarks')
    .update({ text })
    .eq('id', id)
    .select(`
      *,
      users (
        name,
        avatar_url
      )
    `)
    .single()

  if (error) throw error
  return data
}