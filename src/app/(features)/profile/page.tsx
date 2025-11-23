import { authGetSession } from "@/actions/auth/auth.get-session.action";
import { Title } from "@/components/common/titles/Title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default async function ProfilePage() {
  // verficar usuario autenticado
  const respSession = await authGetSession();
  if (!respSession.data.isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error: Usuario no autenticado ({respSession.message})</p>
      </div>
    );
  }
  const sessionUser = respSession.data.sessionUser;

  return (
    <Card className="card w-full md:w-1/2 mx-auto mt-3">
      <CardHeader className="flex flex-row justify-center items-center gap-3 ">
        <Title label="Mi Perfil"></Title>
        {sessionUser.image && (
          <Image
            src={sessionUser.image ?? "/placeholder.jpg"}
            alt={sessionUser.name}
            width={60}
            height={60}
            className="rounded-full"
          />
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <p>Nombre:</p>
        <p>{sessionUser.name}</p>
        <p>Email:</p>
        <p>{sessionUser.email}</p>
        <p>Rol:</p>
        <p>{sessionUser.role}</p>
      </CardContent>
    </Card>
  );
}
