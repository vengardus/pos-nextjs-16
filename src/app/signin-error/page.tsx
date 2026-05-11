import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer/footer";

export default async function SignInErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;
  
  const getErrorMessage = () => {
    if (error === "provider_email_not_authorized") {
      return "El email no está autorizado. Contáctese con el proveedor del sistema.";
    }
    return "Ocurrió un error inesperado al iniciar sesión.";
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[fondocuadros.svg] bg-[length:60%] bg-center [background-repeat:no-repeat]">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg border border-border/50 bg-background/80 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="h-2 w-full bg-rose-500" />
          <CardContent className="flex flex-col items-center p-10 text-center gap-6">
            <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 shadow-inner">
              <AlertCircle size={48} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground">Acceso Denegado</h1>
              <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                {getErrorMessage()}
              </p>
            </div>

            <Button asChild variant="outline" className="w-full h-12 gap-2 border-slate-200 dark:border-white/10">
              <Link href="/login">
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="p-4">
        <Footer />
      </div>
    </div>
  );
}
