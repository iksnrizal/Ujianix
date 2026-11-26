import { Outlet, createFileRoute } from "@tanstack/react-router";
import { FullPageLoader } from "@/components/app/PageHeader";
import { ParticipantHeader } from "@/components/app/ParticipantHeader";
import { useRequireRole } from "@/lib/auth";

export const Route = createFileRoute("/peserta")({
  head: () => ({
    meta: [
      { title: "Dashboard Peserta — Ujianix" },
      { name: "description", content: "Daftar ujian yang tersedia untuk peserta Ujianix." },
      { property: "og:title", content: "Dashboard Peserta — Ujianix" },
      { property: "og:description", content: "Daftar ujian yang tersedia untuk peserta Ujianix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ParticipantLayout,
});

function ParticipantLayout() {
  const user = useRequireRole("peserta");
  if (!user) return <FullPageLoader />;
  return (
    <div className="min-h-screen bg-background">
      <ParticipantHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
