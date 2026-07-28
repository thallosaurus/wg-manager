import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import type { PropsWithChildren } from "react"
import { Separator } from "@/components/ui/separator"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex min-h-screen flex-1 flex-col">
        <header>
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />

          <h1 className="text-lg font-semibold">VPN Manager</h1>
        </header>

        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}