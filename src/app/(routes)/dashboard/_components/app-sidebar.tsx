import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { NavUser } from "../../../../components/sidebar/nav-user";
import { Logo } from "@/assets/vectors";
import SidebarNavigation from "./sidebar-navigation";
import type { UserSession } from "@/server/db/schema";

export function AppSidebar({ user }: { user: UserSession }) {
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
              <SidebarNavigation />
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
