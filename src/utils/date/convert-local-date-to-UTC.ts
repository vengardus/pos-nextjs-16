export const convertLocalDateToUTC = (
    localDate: Date,
    offsetInMinutes?: number
  ):Date => {
    const offsetMilliseconds =
      (offsetInMinutes ?? new Date().getTimezoneOffset()) * 60000; // convierte minutos a milisegundos
    return new Date(localDate.getTime() + offsetMilliseconds);
  };
  