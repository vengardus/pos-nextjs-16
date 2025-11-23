import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer/footer";
import { LoginHeader } from "@/app/(auth)/login/components/login-header";
import { LoginSocial } from "./components/login-social";

export default function LoginSocialPage() {
  return (
    <div className="bg-background text-white flex flex-col justify-between h-screen py-3 ">
      <div className="flex flex-col items-center py-8 pt-20">
        <LoginHeader />

        {/* Main Content */}
        <div className="w-full max-w-md flex flex-col items-center">
          <Link href="/login" className="flex items-center text-white mb-10">
            <ArrowLeft className="mr-2" />
            <span>Volver</span>
          </Link>

          <h2 className="text-2xl font-bold mb-12">
            Ingresar modo Administrador como:
          </h2>

          {/* <p className="text-lg mb-8">Modo super admin:</p> */}

          <LoginSocial />

        </div>
      </div>
      <Footer />
    </div>
  );
}
