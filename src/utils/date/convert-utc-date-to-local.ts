export const convertUTCDateToLocal = (
  UTCDate: Date,
  offsetInMinutes?: number
):Date => {
  const offsetMilliseconds =
    (offsetInMinutes ?? new Date().getTimezoneOffset()) * 60000; // convierte minutos a milisegundos
  return new Date(UTCDate.getTime() - offsetMilliseconds);
};
