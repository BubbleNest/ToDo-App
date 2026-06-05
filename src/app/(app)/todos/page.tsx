import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function TodosPage() {
  return (
    <>
      <DashboardHeader title="Mes todos" />
      <main className="flex-1 p-6">
        <p className="text-muted-foreground">Aucun todo pour l&apos;instant.</p>
      </main>
    </>
  )
}
