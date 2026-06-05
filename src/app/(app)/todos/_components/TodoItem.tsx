'use client'

import { useTransition } from 'react'
import { toggleTodo, deleteTodo } from '@/lib/actions/todos'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Todo } from '@/lib/queries/todos'

type Props = { todo: Todo }

export function TodoItem({ todo }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleToggle(checked: boolean) {
    startTransition(() => toggleTodo(todo.id, checked))
  }

  function handleDelete() {
    startTransition(() => deleteTodo(todo.id))
  }

  return (
    <li className={cn(
      'flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-opacity',
      isPending && 'opacity-50',
    )}>
      <Checkbox
        id={todo.id}
        checked={todo.completed}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <label
        htmlFor={todo.id}
        className={cn(
          'flex-1 cursor-pointer text-sm',
          todo.completed && 'text-muted-foreground line-through',
        )}
      >
        {todo.title}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Supprimer"
      >
        <Trash2Icon className="size-4" />
      </Button>
    </li>
  )
}
