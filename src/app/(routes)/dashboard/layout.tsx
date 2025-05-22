import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(routes)/dashboard/_components/app-sidebar";
import Header from "./_components/header";
import { DialogProvider } from "../../../context/dialog-provider";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

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
