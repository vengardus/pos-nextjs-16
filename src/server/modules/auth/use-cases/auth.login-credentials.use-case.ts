import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { signIn } from "@/auth";
import { authCredentialsSchema } from "../domain/auth-credentials.schema";

export async function authLoginCredentialsUseCase(
  formData: FormData
): Promise<ResponseAction> {
  const resp = initResponseAction();
  const validatedFields = authCredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    //remember: formData.get("remember") === "on",
  });

  if (!validatedFields.success) {
    resp.message = "Datos de formulario inválidos";
  } else {
    console.log("formData", formData);
    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      console.log("result::",result);
      resp.success = true;
    }
    catch (error) {
      console.log("error", error);
      resp.message = "Error al iniciar sesión, credenciales incorrectas.";
    }
  }

  return resp;
}
