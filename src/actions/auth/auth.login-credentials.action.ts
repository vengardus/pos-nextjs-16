"use server";

import { z } from "zod";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { signIn } from "@/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  //remember: z.boolean().default(false),
});

export async function authLoginCredentials(
  formData: FormData
): Promise<ResponseAction> {
  const resp = initResponseAction();
  const validatedFields = formSchema.safeParse({
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
