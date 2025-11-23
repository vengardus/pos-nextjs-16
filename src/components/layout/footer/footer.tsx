import { AppConstants } from "@/constants/app.constants";
import { Lock } from "lucide-react";

export const Footer = () => {
  return (
    <div className="w-full">
      <div className="border-t border-gray-700 pt-4 text-center text-md text-gray-400 px-3">
        <div className="flex flex-row items-baseline justify-center mb-2">
          <Lock className="h-4 w-4  " />
          <p className="break-words">
            Esta es una página segura de ismytv@gmail.com. Si tienes dudas sobre
            la autenticidad de la web, comunícate con nosotros al correo
            electrónico.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-7 items-center text-gray-500">
          <p>{AppConstants.APP_NAME}</p>
          <p>Todos los derechos reservados</p>
          <p>© 2025 ismytv@gmail.com</p>
        </div>
      </div>
    </div>
  );
};
