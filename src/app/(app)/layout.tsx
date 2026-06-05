import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/dashboard/AppSidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <SidebarProvider>
      <AppSidebar email={user.email ?? ''} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
