"use client";

import { userInsertSuperadmin } from "@/actions/users/user.insert-superadmin.action";
import { AppConstants } from "@/constants/app.constants";
import { useLoginForm } from "@/hooks/auth/use-login-form";
import { UserRole } from "@/types/enums/user-role.enum";
import { generateRandomEmail } from "@/utils/generate/generate-random-email";
import { useEffect } from "react";

interface GuestButtonProps {
    isPendingSocial: boolean
    setIsPendingSocial: (value: boolean) => void
}
export default function GuestButton({ isPendingSocial, setIsPendingSocial }: GuestButtonProps) {
  const { handleLoginCredentials, isPending } = useLoginForm(isPendingSocial);

  useEffect(() => {
    setIsPendingSocial(isPending);
  }, [isPending, setIsPendingSocial]);

  

  const handleGuestLogin = async () => {
    setIsPendingSocial(true);
    const email = generateRandomEmail(10);
    const username = email.split("@")[0] || null;
    console.log("handleGuestLogin");
    const respInsert = await userInsertSuperadmin({
      authId: email,
      roleId: UserRole.GUEST as string,
      email: email,
      currencySymbol: AppConstants.DEFAULT_VALUES.currencySymbol,
      companyName: AppConstants.DEFAULT_VALUES.companyName,
      documentTypeName: AppConstants.DEFAULT_VALUES.documentTypeName,
      categoryName: AppConstants.DEFAULT_VALUES.categoryName,
      categoryColor: AppConstants.DEFAULT_VALUES.categoryColor,
      password: "1234567",
      authType: AppConstants.DEFAULT_VALUES.authType,
      imageUrl: "",
      userName: username!,
      brandName: AppConstants.DEFAULT_VALUES.brandName,
      clientName: AppConstants.DEFAULT_VALUES.clientName,
      personType: AppConstants.DEFAULT_VALUES.personTypes[0].value as string,
    });
    if (!respInsert.success) {
      console.log(
        "Ocurrio un error al insertar el nuevo usuario",
        respInsert.message
      );
      setIsPendingSocial(false);
      return false;
    }

    const respLogin = handleLoginCredentials({
      email: email,
      password: "1234567",
      remember: false,
    });
    if (!respLogin) {
      console.log("Ocurrio un error al iniciar sesion");
      return false;
    }
  };

  return (
    <button
      className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-3xl mb-6 disabled:bg-yellow-600"
      onClick={handleGuestLogin}
      disabled={isPendingSocial}
    >
      
      {isPendingSocial ? "Iniciando sesión..." : "Invitado (Pruebas)"}
    </button>
  );
}
