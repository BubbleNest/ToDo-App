import { createServerClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/supabase'

export type Todo = Tables<'todos'>

export async function getTodos(): Promise<Todo[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}
