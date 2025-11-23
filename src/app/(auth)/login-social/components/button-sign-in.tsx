import { cn } from "@/utils/tailwind/cn";
import type { ProviderOAuth } from "@/types/interfaces/auth/provider-oauth.type";
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
        "rounded-full p-2 size-12 bg-white hover:bg-gray-100 w-full",
        className,
        {
          "bg-gray-300" : isDisabled
        }
      )}
      type="submit"
      name="provider"
      value={provider}
      disabled={isDisabled}
    >
      {
        Icon && <Icon className="" style={{ height: height, width: width }} />
      }
      <span className="text-black">Google</span>
      <span className="sr-only">{`Iniciar sesión con ${provider}`}</span>
    </Button>
  );
};
