"use client";
import { usePathname } from "next/navigation";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BadgeDollarSign, Cat, PackageSearch, ShieldUser } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Pets",
    url: "/dashboard",
    icon: Cat,
  },
  {
    title: "Productos",
    url: "/dashboard/products",
    icon: PackageSearch,
  },
  {
    title: "Transacciones",
    url: "/dashboard/transactions",
    icon: BadgeDollarSign,
  },
  {
    title: "Admins",
    url: "/dashboard/admins",
    icon: ShieldUser,
  },
];

export default function SidebarNavigation() {
  const path = usePathname();

  const isActive = (url: string) => {
    return path === url;
  };

  return items.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isActive(item.url)}>
        <Link href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));
}
