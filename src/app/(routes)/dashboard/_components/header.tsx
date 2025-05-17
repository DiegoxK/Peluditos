import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <div className="bg-sidebar border-sidebar-border border-b p-2">
      <SidebarTrigger />
    </div>
  );
}
