import { AppConstants } from "@/constants/app.constants";
import Image from "next/image";

export const LoginHeader = () => {
  return (
    <div className="w-full max-w-md text-center mb-8">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/images/punto-de-venta.png"
          width={48}
          height={48}
          alt="POS"
        />
        <h1 className="text-xl font-bold">{AppConstants.APP_NAME}</h1>
      </div>
    </div>
  );
};
