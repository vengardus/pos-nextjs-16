import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { PageHeader } from "@/components/common/typography/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function ProfilePage() {
  const respSession = await authGetSessionUseCase();
  if (!respSession.data.isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error: Usuario no autenticado ({respSession.message})</p>
      </div>
    );
  }
  const sessionUser = respSession.data.sessionUser;

  return (
    <div className="p-6">
      <PageHeader title="Perfil" breadcrumb="Inicio / Perfil" />
      
      <Card className="max-w-2xl mx-auto mt-8 border border-border/50 bg-background/80 backdrop-blur-sm shadow-md">
        <CardHeader className="flex flex-row items-center gap-6 pb-6 border-b">
          {sessionUser.image && (
            <Image
              src={sessionUser.image ?? "/placeholder.jpg"}
              alt={sessionUser.name}
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          )}
          <CardTitle className="text-2xl font-bold">{sessionUser.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 text-sm">
          <div className="font-semibold text-muted-foreground">Email:</div>
          <div>{sessionUser.email}</div>
          <div className="font-semibold text-muted-foreground">Rol:</div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {sessionUser.role}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
