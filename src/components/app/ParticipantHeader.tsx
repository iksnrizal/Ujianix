import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function ParticipantHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo size="sm" subtitle="Computer Based Test" />
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="text-xs text-muted-foreground">{[user.identityNumber, user.className].filter(Boolean).join(" · ")}</div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await logout();
              navigate({ to: "/", replace: true });
            }}
          >
            <LogOut /> Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
