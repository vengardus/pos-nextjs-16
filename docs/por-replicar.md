# Instrucciones para Replicación de Soluciones

Este documento sirve como bitácora de soluciones técnicas implementadas en `pos-nextjs-16` que deben ser replicadas en otros proyectos cuando se presenten escenarios similares.

## Fix: Sincronización de Filtro de Búsqueda y Prevención de Race Condition

### Escenario
Se presentaba un problema donde el componente de filtro de búsqueda no se mantenía sincronizado con los parámetros de la URL al refrescar la página (F5) o al borrar el valor del filtro rápidamente, causando que la actualización de la URL fallara o disparara navegaciones innecesarias.

### Solución Técnica
La solución consiste en tres pilares dentro del componente `ListDef` del módulo correspondiente:

1.  **Inicialización y Sincronización:**
    - El estado `searchValue` debe inicializarse desde la URL:
      `useState(searchParams.get("search") ?? "")`
    - Se debe usar un `useEffect` para actualizar el estado si los `searchParams` cambian externamente:
      ```typescript
      useEffect(() => {
        setSearchValue(searchParams.get("search") ?? "");
      }, [searchParams]);
      ```

2.  **Prevención de Race Conditions (Validación Previa):**
    - Antes de ejecutar el `router.push`, se debe comparar el valor debounced con el valor actual de la URL para evitar disparar navegaciones redundantes:
      ```typescript
      const currentSearch = searchParamsRef.current.get("search") ?? "";
      if (debouncedSearchValue === currentSearch) return;
      ```

3.  **Prop de Inicialización en `ListTable`:**
    - Se añadió `initialGlobalFilter={searchParams.get("search") ?? ""}` al componente `ListTable` para garantizar que la tabla interna comience con el estado correcto desde el renderizado inicial del servidor/cliente.

### Pasos para Replicación
Para aplicar este fix en otro proyecto, asegúrate de:
1. Modificar el componente `ListTable` (o equivalente) para aceptar `initialGlobalFilter` y usarlo para setear el estado interno (`internalGlobalFilter`).
2. Actualizar el componente contenedor (`ListDef` o página) aplicando la lógica de sincronización y validación mencionada en el punto 1 y 2 arriba.
3. Asegurar que `isFirstMount` (usando `useRef`) se use para ignorar el primer renderizado si es necesario, para evitar disparar el `useEffect` de búsqueda al montar el componente.
