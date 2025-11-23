export const generateRandomEmail = (longitudNombreUsuario = 8): string => {
    const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
    const dominios = ["yahoo.com", "hotmail.com", "outlook.com"];

    let nombreUsuario = "";
    for (let i = 0; i < longitudNombreUsuario; i++) {
      nombreUsuario += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }

    const dominioAleatorio =
      dominios[Math.floor(Math.random() * dominios.length)];

    return `${nombreUsuario}@${dominioAleatorio}`;
  };