export const dateTimeToStringLocal = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    //weekday: "short", // Día abreviado (ej: "lun")
    year: "numeric", // Año (ej: "2023")
    month: "short", // Mes abreviado (ej: "oct")
    day: "numeric", // Día (ej: "30")
    hour: "2-digit",
    minute: "2-digit",
  });
};
