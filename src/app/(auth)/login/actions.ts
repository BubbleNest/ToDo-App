'use server'

import { createServerClient } from '@/lib/supabase/server'
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

  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect(`/login?sent=1&email=${encodeURIComponent(email)}`)
}
