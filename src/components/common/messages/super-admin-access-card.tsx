import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SuperAdminAccessCardProps {
  message?: string;
  loginHref?: string;
}

export const SuperAdminAccessCard = ({
  message = "Acceso restringido. Requiere permiso para usar la interfaz web.",
  loginHref = "/login",
}: SuperAdminAccessCardProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <Card className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 text-white shadow-2xl shadow-black/40 backdrop-blur">
        <CardHeader className="space-y-4 px-8 pb-7 pt-8">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold tracking-tight text-white">
              Acceso restringido
            </CardTitle>
            <CardDescription className="max-w-xl text-base leading-7 text-slate-300">
              {message}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 border-t border-slate-800 bg-slate-900/60 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg text-sm leading-6 text-slate-300">
            Si necesitas cambiar de cuenta, vuelve al login y autentícate con un
            usuario que tenga acceso a esta interfaz.
          </div>
          <Button
            asChild
            className="min-w-32 bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
          >
            <Link href={loginHref}>Ir a login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
