import { cn } from "@/utils/tailwind/cn";
import type { ProviderOAuth } from "@/server/modules/auth/domain/auth.provider-oauth.type";
import { Button } from "@/components/ui/button";

interface ButtonSignInProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
  provider: ProviderOAuth;
  Icon?:  (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  height?: number;
  width?: number;
  isDisabled: boolean
}
export const ButtonSignIn= ({
  variant = "outline",
  className = "",
  provider,
  Icon,
  height = 20,
  width = 20,
  isDisabled
}: ButtonSignInProps) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "h-12 w-full justify-center gap-3 rounded-full border border-slate-200/70 bg-white/90 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900",
        className,
        {
          "pointer-events-none opacity-60" : isDisabled
        }
      )}
      type="submit"
      name="provider"
      value={provider}
      disabled={isDisabled}
    >
      {
        Icon && <Icon className="shrink-0" style={{ height: height, width: width }} />
      }
      <span className="text-sm font-semibold">Continuar con Google</span>
      <span className="sr-only">{`Iniciar sesión con ${provider}`}</span>
    </Button>
  );
};
