import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/app/AdminSidebar";
import { FullPageLoader } from "@/components/app/PageHeader";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRequireRole } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — Ujianix" },
      { name: "description", content: "Kelola peserta, soal, ujian, dan hasil ujian Ujianix." },
      { property: "og:title", content: "Panel Admin — Ujianix" },
      { property: "og:description", content: "Kelola peserta, soal, ujian, dan hasil ujian Ujianix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const user = useRequireRole("admin");
  if (!user) return <FullPageLoader />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">Panel Pengawas Ujian</span>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
