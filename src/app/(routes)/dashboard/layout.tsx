import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(routes)/dashboard/_components/app-sidebar";
import Header from "./_components/header";
import { DialogProvider } from "../../../context/dialog-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DialogProvider>
        <AppSidebar />
        <main className="w-full">
          <Header />
          {children}
        </main>
      </DialogProvider>
    </SidebarProvider>
  );
}
