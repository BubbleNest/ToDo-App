import { getTodos } from '@/lib/queries/todos'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { AddTodoForm } from './_components/AddTodoForm'
import { TodoItem } from './_components/TodoItem'

export default async function TodosPage() {
  const todos = await getTodos()
  const remaining = todos.filter(t => !t.completed).length

  return (
    <>
      <DashboardHeader title="Mes todos" />
      <main className="mx-auto w-full max-w-2xl p-6 flex flex-col gap-6">
        <AddTodoForm />

        {todos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            Aucun todo pour l&apos;instant.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              {remaining} tâche{remaining !== 1 ? 's' : ''} restante{remaining !== 1 ? 's' : ''}
            </p>
            <ul className="flex flex-col gap-2">
              {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  )
}
