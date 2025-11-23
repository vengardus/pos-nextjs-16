"use client";

import { useEffect } from "react";
// import { LinkedInIcon } from "../common/icons/linked-in-icon";
// import { FacebookIcon } from "../common/icons/facebook-icon";
import { useLoginForm } from "@/hooks/auth/use-login-form";
import { ButtonSignIn } from "./button-sign-in";
import { GoogleIcon } from "@/components/common/icons/google-icon";

interface ProviderOAuthButtonsProps {
  isPendingSocial: boolean;
  setIsPendingSocial: (value: boolean) => void;
}
export const ProviderOAuthButtons = ({isPendingSocial, setIsPendingSocial}: ProviderOAuthButtonsProps) => {
  const { handleLoginProvider,isPending } = useLoginForm(isPendingSocial);

  useEffect(() => {
    setIsPendingSocial(isPending);
  }, [isPending, setIsPendingSocial]);

  //TODO: Usar providerMap? (/auth.js)
  return (
    <form
      action={handleLoginProvider}
      className="w-full bg-white text-black font-bold py-0 px-0 rounded-full flex items-center justify-center gap-2 hover:cursor-pointer1"
    >
      {/* <ButtonSignIn
        className="border-[#0077B5]"
        provider="linkedin"
        Icon={LinkedInIcon}
      />

      <ButtonSignIn
        className="border-[#1877F2]"
        provider="facebook"
        Icon={FacebookIcon}
      /> */}
      <ButtonSignIn
        className=" border-[#4285F4]"
        provider="google"
        Icon={GoogleIcon}
        isDisabled={isPendingSocial}
      />
      {/* <span> Google</span> */}
    </form>
  );
};
