// utilzada para dar formato a variables tipo string que pueden ser undefined o null
// y asegurar que devuelva en caso sea undefined o en blanco como un valor nulo para
// compatibilidad al momento de grabar en la base de datos
// Motivo:
//  Prisma (la bd)no acepta undefined
//  La interface (typescript) al ser opcional, es un string(por ejemplo) o undefined, por lo
//  que debe agregarse un null:  barcode?: string | null
export const formatOptionalField = (fieldValue: string | undefined | null) => {
  return fieldValue && fieldValue.length ? fieldValue : null;
};
