# Tarea: Agregar `tags` a las llamadas a `cache()` en archivos `*.cache.ts`

Quiero que realices un refactor específico en este proyecto.

---

## Alcance de archivos

Trabaja **solo** sobre archivos que coincidan con el patrón:

- `src/lib/data/*/*.cache.ts`

Dentro de esos archivos, **solo debes modificar** las funciones cuyo nombre termine en `Cache`, por ejemplo:

- `getProductsCache`
- `findUserCache`
- `listOrdersCache`
- etc.

---

## Objetivo del refactor

En cada función con sufijo `Cache`:

1. Localiza la llamada a `cache()` (que normalmente envuelve el cuerpo de la función).
2. En el **tercer parámetro** de `cache()` (el objeto de opciones), agrega la propiedad `tags`, inmediatamente **debajo** de la propiedad `revalidate`.
3. El valor de `tags` debe ser el mismo array que se usa como **segundo parámetro** de `cache()` (el que está entre corchetes unas líneas arriba).

**No cambies nada más en esos archivos salvo lo necesario para agregar `tags`.**
**Si ya existe una propiedad tags en las opciones de cache para algún caso, NO la dupliques ni la modifiques.**
---

## Forma típica de la llamada a `cache()`

En estos archivos, la llamada a `cache()` suele tener una estructura como esta:

```ts
const getProductsCache = cache(
  async (companyId: string) => {
    return productGetAllByCompany(companyId);
  },
  [`products-${companyId}`],
  {
    revalidate: CacheConfig.CacheDurations.revalidate,
  }
);
```

## Debes rransformarlo en:
```typescript
const getProductsCache = cache(
  async (companyId: string) => {
    return productGetAllByCompany(companyId);
  },
  [`products-${companyId}`],
  {
    revalidate: CacheConfig.CacheDurations.revalidate,
    tags: [`products-${companyId}`],
  }
);
```

