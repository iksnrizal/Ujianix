import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, ClipboardList, FileQuestion, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { Logo } from "@/components/app/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Manajemen Peserta", url: "/admin/peserta", icon: Users },
  { title: "Manajemen Soal", url: "/admin/soal", icon: FileQuestion },
  { title: "Manajemen Ujian", url: "/admin/ujian", icon: ClipboardList },
  { title: "Hasil Ujian", url: "/admin/hasil", icon: BarChart3 },
  { title: "Pengaturan", url: "/admin/pengaturan", icon: Settings },
] as const;

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string, exact?: boolean) => (exact ? path === url || path === `${url}/` : path.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-3 py-4">
        <Logo size="sm" showText={!collapsed} subtitle="Panel Pengawas" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, "exact" in item ? item.exact : false)}
                    tooltip={item.title}
                    className="h-10 font-medium data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-primary"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        {!collapsed && user && (
          <div className="px-2 pt-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="h-10 font-medium text-destructive hover:bg-destructive-soft hover:text-destructive"
              onClick={async () => {
                await logout();
                navigate({ to: "/", replace: true });
              }}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
