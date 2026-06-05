'use client'

import { useRef, useTransition } from 'react'
import { createTodo } from '@/lib/actions/todos'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

export function AddTodoForm() {
  const ref = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  function handleAction(formData: FormData) {
    startTransition(async () => {
      await createTodo(formData)
      ref.current?.reset()
    })
  }

  return (
    <form ref={ref} action={handleAction} className="flex gap-2">
      <Input
        name="title"
        placeholder="Ajouter un todo…"
        required
        disabled={isPending}
        className="flex-1"
        autoComplete="off"
      />
      <Button type="submit" disabled={isPending} size="icon">
        <PlusIcon className="size-4" />
      </Button>
    </form>
  )
}
