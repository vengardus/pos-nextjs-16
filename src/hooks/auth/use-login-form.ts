import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormSchema,
  LoginFormSchemaType,
} from "@/hooks/auth/schemas/login-form.schema";
import { useRouter } from "next/navigation";
import { AppConstants } from "@/constants/app.constants";
import { authLoginCredentials } from "@/actions/auth/auth.login-credentials.action";
import { authLoginProvider } from "@/actions/auth/auth.login-provider.action";


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
    const resp = await authLoginCredentials(formData);
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
    const resp = await authLoginProvider(formData);

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
