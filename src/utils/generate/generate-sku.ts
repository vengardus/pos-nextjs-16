export const generateSKU = (name: string='', category: string='') => {
  // Definir la longitud máxima del SKU
  const LONGITUD_MAXIMA_SKU = 30;

  // Valores por defecto
  const defaultName = "PROD";
  const defaultCategory = "GEN";

  // Truncar name y category a 5 caracteres, usar valores por defecto si están vacíos
  const nombre = name ? name.slice(0, 5).toUpperCase() : defaultName;
  const categoria = category
    ? category.slice(0, 5).toUpperCase()
    : defaultCategory;

  // Obtener la fecha y hora actual en formato AAAAMMDDHHMMSS
  const fecha = new Date();
  const ano = fecha.getFullYear().toString().slice(-2);
  const mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
  const dia = ("0" + fecha.getDate()).slice(-2);
  const hora = ("0" + fecha.getHours()).slice(-2);
  const minutos = ("0" + fecha.getMinutes()).slice(-2);
  const segundos = ("0" + fecha.getSeconds()).slice(-2);
  const fechaHora = `${ano}${mes}${dia}${hora}${minutos}${segundos}`;

  // Generar un número aleatorio de 4 dígitos
  const random = Math.floor(1000 + Math.random() * 9000);

  // Crear el SKU
  let sku = `${nombre}-${categoria}-${fechaHora}-${random}`;

  // Asegurarse de que el SKU no exceda los LONGITUD_MAXIMA_SKU caracteres
  if (sku.length > LONGITUD_MAXIMA_SKU) {
    sku = sku.slice(0, LONGITUD_MAXIMA_SKU);
  }

  return sku;
};
