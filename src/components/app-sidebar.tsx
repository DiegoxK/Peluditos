import { Cat, PackageSearch, ShieldUser } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { NavUser } from "./sidebar/nav-user";
import { Logo } from "@/assets/vectors";

const user = {
  name: "John Doe",
  email: "johndoe@example.com",
};

const items = [
  {
    title: "Pets",
    url: "#",
    icon: Cat,
  },
  {
    title: "Productos",
    url: "#",
    icon: PackageSearch,
  },
  {
    title: "Admins",
    url: "#",
    icon: ShieldUser,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center">
        <Logo className="fill-primary size-8 shrink-0" />
        <div className="grid flex-1 text-left leading-tight">
          <span className="text-primary truncate text-lg font-medium">
            Peluditos
          </span>
          <span className="-mt-2 truncate text-sm font-light opacity-70">
            Dasboard
          </span>
        </div>
      </SidebarHeader>
      <div className="pr-4">
        <SidebarSeparator />
      </div>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Array.from({ length: 3 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>24</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="pr-4">
        <SidebarSeparator />
      </div>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
