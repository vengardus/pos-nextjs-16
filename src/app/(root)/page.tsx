import { Features } from "@/app/(root)/components/features";
import { Footer } from "@/components/layout/footer/footer";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";

export default async function HomePage() {
  const resp = await authGetSessionUseCase();
  const { isAuthenticated, sessionUser } = resp.data;

  return (
    <div className="flex flex-col gap-3 w-full px-3 md:px-5">
      <div>
        {/* <span className="gradient-text">BIENVENIDO A</span>{" "} */}
        {/* <span> POS-EF2R</span> */}
        {/* <div className="flex justify-center w-full text-4xl gradient-text uppercase">Sistema en mantenimiento...</div> */}
      </div>
      {isAuthenticated && (
        <div
          className="text-lg bg-[linear-gradient(90deg,rgb(245,79,7)_0%,rgb(243,157,10)_40%,rgb(213,194,21)_50%,rgb(243,110,219)_70%,rgb(224,40,55)_100%)] bg-contain bg-clip-text text-transparent"
          style={{ fontFamily: '"Tilt Neon", sans-serif' }}
        >
          Usuario: {sessionUser.name} - Role ({sessionUser.role.toLowerCase()})
        </div>
      )}
      <Features />
      <Footer />
    </div>
  );
}
