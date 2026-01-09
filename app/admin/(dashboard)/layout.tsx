import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="w-full max-w-fit gap-16 flex  flex-row">
      <AppSidebar />
      <main >
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}