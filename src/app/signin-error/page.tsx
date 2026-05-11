import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignInErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams.error;
  
  const getErrorMessage = () => {
    if (error === "provider_email_not_authorized") {
      return "El email no está autorizado. Contáctese con el proveedor del sistema.";
    }
    return "Ocurrió un error inesperado al iniciar sesión.";
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
      <Card className="w-full max-w-md border-border/50 bg-background shadow-xl">
        <CardContent className="flex flex-col items-center p-8 text-center gap-6">
          <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Error de autenticación</h1>
            <p className="text-muted-foreground">{getErrorMessage()}</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Volver al login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
