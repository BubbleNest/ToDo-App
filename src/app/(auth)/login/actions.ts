'use server'

import { createServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type SendMagicLinkState = {
  error?: string
  success?: boolean
}

export async function sendMagicLink(
  _prev: SendMagicLinkState,
  formData: FormData,
): Promise<SendMagicLinkState> {
  const email = formData.get('email')

  if (typeof email !== 'string' || !email.includes('@')) {
    return { error: 'Adresse email invalide.' }
  }

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const emailRedirectTo = `${protocol}://${host}/auth/confirm`

  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  })

  if (error) {
    return { error: error.message }
  }

  redirect(`/login?sent=1&email=${encodeURIComponent(email)}`)
}
