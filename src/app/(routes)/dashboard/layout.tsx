import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(routes)/dashboard/_components/app-sidebar";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
