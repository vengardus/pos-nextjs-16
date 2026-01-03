import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormSchema,
  LoginFormSchemaType,
} from "@/app/(auth)/schemas/login-form.schema";
import { useRouter } from "next/navigation";
import { AppConstants } from "@/shared/constants/app.constants";
import { authLoginCredentialsAction } from "@/server/modules/auth/next/actions/auth.login-credentials.action";
import { authLoginProviderAction } from "@/server/modules/auth/next/actions/auth.login-provider.action";


export const useLoginForm = (isPendignSocial: boolean) => {
  const [isPending, setIsPending] = useState(isPendignSocial);
  const router = useRouter()
  const [messageLoginError, setMessageLoginError] = useState<string | null>(null);

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const handleLoginCredentials = async (values: LoginFormSchemaType) => {
    const formData = new FormData();
    setIsPending(true);
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    const resp = await authLoginCredentialsAction(formData);
    if (!resp.success) {
      console.log("Error:", resp.message?? "");
      setMessageLoginError(`Error: ${resp.message?? ""}`);
    } else {
      console.log("Inicio de sesión exitoso");
      router.push(AppConstants.URL_HOME);
    }
    setIsPending(false);
  };

  const handleLoginProvider = async (formData: FormData) => {
    setIsPending(true);
    const resp = await authLoginProviderAction(formData);

    if (resp.success) {
      console.log("Inicio de sesión exitoso");
    } else {
      console.error("Error", resp.message?? "");
    }

    setIsPending(false);
  };

  return {
    form,
    handleLoginCredentials,
    isPending,
    handleLoginProvider,
    messageLoginError
  };
};
