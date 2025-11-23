import "@/styles/home.css";
import { Features } from "@/app/(root)/components/features";
import { Footer } from "@/components/layout/footer/footer";
import { authGetSession } from "@/actions/auth/auth.get-session.action";

export default async function HomePage() {
  const resp = await authGetSession();
  const { isAuthenticated, sessionUser } = resp.data;

  return (
    <div className="flex flex-col gap-3 w-full px-3 md:px-5">
      <div>
        {/* <span className="gradient-text">BIENVENIDO A</span>{" "} */}
        {/* <span> POS-EF2R</span> */}
        {/* <div className="flex justify-center w-full text-4xl gradient-text uppercase">Sistema en mantenimiento...</div> */}
      </div>
      {isAuthenticated && (
        <div className="gradient-text text-lg">
          Usuario: {sessionUser.name} - Role ({sessionUser.role.toLowerCase()})
        </div>
      )}
      <Features />
      <Footer />
    </div>
  );
}
