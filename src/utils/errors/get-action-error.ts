import { Prisma } from "@prisma/client";

export const getActionError = (error: any): string => {
  let message = "";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(
      "Error : Prisma.PrismaClientKnownRequestError. Code: ",
      (error as Prisma.PrismaClientKnownRequestError).code,
      JSON.stringify((error as Prisma.PrismaClientKnownRequestError).meta)
    );
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2002")
      message = `Error de restricción única (P2002): Ya existe un registro con este valor único.`;
    else
      message = `Error conocido de Prisma (${
        (error as Prisma.PrismaClientKnownRequestError).code
      }) - ${JSON.stringify(
        (error as Prisma.PrismaClientKnownRequestError).meta
      )}}`;

  } else if (error instanceof Error) {
    // Aquí sabemos que `error` es una instancia de Error
    message = error.message;

  } else if (typeof error === "object" && error !== null && "message" in error)
    message = (error as { message: string }).message;

  else message = `Ocurrió algún error: ${error}`;

  return message;
};
