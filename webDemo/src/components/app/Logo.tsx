import logo from "@/assets/ujianix-logo.png";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { img: "h-10 w-10", text: "text-lg" },
  md: { img: "h-12 w-12", text: "text-xl" },
  lg: { img: "h-32 w-32", text: "text-3xl" },
};

export function Logo({
  size = "md",
  showText = true,
  subtitle,
  className,
}: {
  size?: keyof typeof sizes;
  showText?: boolean;
  subtitle?: string;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img src={logo} alt="Logo Ujianix" className={cn(s.img, "shrink-0 object-contain")} />
      {showText && (
        <div className="leading-tight">
          <div className={cn(s.text, "font-extrabold tracking-tight text-brand-navy")}>Ujianix</div>
          {subtitle && <div className="text-xs font-medium text-muted-foreground">{subtitle}</div>}
        </div>
      )}
    </div>
  );
}
