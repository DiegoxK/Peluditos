import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(routes)/dashboard/_components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

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
        <AppSidebar user={session.user} />
        <main className="w-full">
          <Header />
          {children}
        </main>
        <Toaster expand={true} richColors position="top-right" />
      </DialogProvider>
    </SidebarProvider>
  );
}
