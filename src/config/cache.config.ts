export const CacheConfig = {
  CacheDurations: {
    revalidate: 60 * 60 * 1, // 🔹 1 horas antes de revalidar automáticamente
    expire: 60 * 60 * 24 * 7, // 🔹 1 días antes de que la caché expire completamente
    stale: 60 * 60 * 24 * 1,
  },
};
