import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export const useGetSession = () => {
  const { data: session, status, update } = useSession();
  const isAuthenticated = !!session;
  const sessionUser = session?.user;
  
  const hasUpdated = useRef(false);
  
  //console.log("session", session);

  useEffect(() => {
    if (status === "unauthenticated" && !hasUpdated.current) {
      update();
      hasUpdated.current = true; // Evita la actualización infinita
    }
  }, [status, update]);

  return {
    session,
    isAuthenticated,
    sessionUser,
    isLoading: status === "loading",
    refreshSession: update, // Agregar para actualizar la sesión
  };
};
