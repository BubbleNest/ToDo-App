'use client'

import { useRef, useState, useTransition } from 'react'
import { toggleTodo, updateTodoTitle, deleteTodo } from '@/lib/actions/todos'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Todo } from '@/lib/queries/todos'

type Props = { todo: Todo }

export function TodoItem({ todo }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleToggle(checked: boolean) {
    startTransition(() => toggleTodo(todo.id, checked))
  }

  function handleDelete() {
    startTransition(() => deleteTodo(todo.id))
  }

  function startEditing() {
    setEditValue(todo.title)
    setIsEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commitEdit() {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== todo.title) {
      startTransition(() => updateTodoTitle(todo.id, trimmed))
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { setIsEditing(false); setEditValue(todo.title) }
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
        disabled={isPending || isEditing}
      />

      {isEditing ? (
        <Input
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          className="h-7 flex-1 border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
          autoFocus
        />
      ) : (
        <label
          htmlFor={todo.id}
          className={cn(
            'flex-1 cursor-pointer text-sm',
            todo.completed && 'text-muted-foreground line-through',
          )}
        >
          {todo.title}
        </label>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-foreground"
        onClick={startEditing}
        disabled={isPending || isEditing}
        aria-label="Modifier"
      >
        <Pencil className="size-4" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              disabled={isPending || isEditing}
              aria-label="Supprimer"
            />
          }
        >
          <Trash2Icon className="size-4" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce todo ?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{todo.title}&rdquo; sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  )
}
