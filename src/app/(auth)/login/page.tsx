import { LoginHeader } from "@/app/(auth)/login/components/login-header"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center mt-16 min-h-screen bg-background p-4">
      <LoginHeader />

      <h2 className="text-white text-4xl font-bold mb-12">Ingresar modo</h2>

      <div className="w-full max-w-md flex flex-col gap-7">
        {/* Super admin button */}
        <Link href="/login-social" className="block ">
          <div className="bg-orange-400 rounded-xl p-4 flex items-center justify-between hover:bg-green-500">
            <div>
              <div className="bg-white text-orange-500 font-bold py-2 px-4 rounded-md inline-block mb-2">
                Administrador
              </div>
              <p className="text-white">Crea y gestiona tu empresa</p>
            </div>
            <div className="w-12 h-12">
              <Image
                src="/images/rey.png"
                width={48}
                height={48}
                alt="Admin icon"
                className="object-contain"
              />
            </div>
          </div>
        </Link>

        {/* Empleado button */}
        <Link href="/login-email" className="block"> 
          <div className="bg-amber-900 rounded-xl p-4 flex items-center justify-between hover:bg-green-500">
            <div>
              <div className="bg-white text-amber-900 font-bold py-2 px-4 rounded-md inline-block mb-2">Empleado</div>
              <p className="text-white">Vende y crece</p>
            </div>
            <div className="w-12 h-12">
              <Image
                src="/images/androide.png"
                width={48}
                height={48}
                alt="Empleado icon"
                className="object-contain"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

