'use client'

import { useActionState } from 'react'
import { sendMagicLink, type SendMagicLinkState } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: SendMagicLinkState = {}

export function LoginForm() {
  const [state, action, isPending] = useActionState(sendMagicLink, initialState)

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="vous@exemple.com"
          required
          autoComplete="email"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Envoi en cours…' : 'Envoyer le lien de connexion'}
      </Button>
    </form>
  )
}
