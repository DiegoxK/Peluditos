"use client";
import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  const path = usePathname();

  const titles = [
    {
      path: "/dashboard",
      title: " Gestion de mascotas",
    },
    {
      path: "/dashboard/products",
      title: "Gestion de productos",
    },
    {
      path: "/dashboard/transactions",
      title: "Gestion de transacciones",
    },
    {
      path: "/dashboard/admins",
      title: "Gestion de administradores",
    },
  ];

  return (
    <div className="bg-sidebar border-sidebar-border sticky top-0 z-10 flex items-center gap-2 border-b p-2">
      <SidebarTrigger />
      <span className="text-sm font-light text-gray-400">|</span>
      <span className="text-sm font-light text-gray-700">
        {titles.find((item) => item.path === path)?.title ?? "Dashboard"}
      </span>
    </div>
  );
}
