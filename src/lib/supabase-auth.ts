import { supabase } from './supabase'

export async function signUp(email: string, password: string, userData: {
  name: string
  branch: string
  year: number
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })

  if (error) throw error

  // Insert user data into our users table
  if (data.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        name: userData.name,
        branch: userData.branch,
        year: userData.year
      })

    if (insertError) throw insertError
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function updateUserProfile(updates: {
  name?: string
  branch?: string
  year?: number
  avatar_url?: string
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No user logged in')

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)

  if (error) throw error
}