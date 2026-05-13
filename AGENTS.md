# Reglas de Agente: Codex - POS Next.js 16

## Precedencia y uso
- Este archivo define el flujo operativo inmediato para trabajar en el repositorio.
- `docs/REGLAS_PROYECTO.md` define la arquitectura, los estándares técnicos y las reglas extendidas.
- Si hay solapamiento, este archivo manda sobre el orden de ejecución y `docs/REGLAS_PROYECTO.md` manda sobre el estándar técnico.
- Para cualquier implementación o revisión, consulta ambos documentos antes de editar.

## Objetivo permanente
- Mantener un código alineado a Clean Architecture, limpio, reutilizable, escalable y consistente con los patrones vigentes del proyecto.
- Antes de crear una estructura, helper, wrapper, patrón o abstracción nueva, busca primero una referencia activa y reutilizable en el repositorio.

## Honestidad técnica
- No valides propuestas por inercia ni contradigas por reflejo.
- Si detectas riesgos, supuestos débiles, regresiones potenciales, sobreingeniería o una alternativa claramente mejor, dilo con claridad y fundamento.
- La prioridad es mejorar la decisión técnica del usuario, aunque eso implique cuestionar la idea inicial.
- Si la propuesta del usuario es sólida, confírmala sin forzar objeciones artificiales.

## Estilo de respuesta
- Responde de forma precisa, corta y técnica por defecto.
- Amplía la respuesta solo cuando sea necesario para evitar ambigüedad, riesgo o error.
- Evita repeticiones de contexto ya confirmado.
- En cierres, revisiones y estados intermedios, prioriza la síntesis.

## Flujo de trabajo y Cierre de Tareas
- Toda tarea nueva debe seguir este protocolo:
  1. **Verificación de estado**: Ejecutar `git status`. Si hay archivos sin commitear, ramas sucias o commits pendientes, detener la operación.
  2. **Creación de rama**: Crear una nueva rama local a partir de `origin/codex/dev` con el formato `codex/[nombre-descriptivo-tarea]` y realizar un `git push -u origin [nombre-rama]` inmediatamente para sincronizarla con el remoto.
  3. **Desarrollo**: Realizar commits atómicos según sea necesario (NO HACER push).
  4. **Validación Técnica**: 
     - Para cambios de código: ejecutar obligatoriamente `bunx tsc --noEmit` después de cada subtarea o cambio de código finalizado y pruebas funcionales.
     - Para cambios de documentación/configuración: verificar cambios manualmente.
  5. **Cierre de tarea**: (ES INDICADO EXPLICITAMENTE)
     - Ejecutar commit final (`git commit -a`).
     - Realizar `git push` al remoto (solo al cerrar).
     - Permanecer en la rama activa. No realizar cambios de rama ni borrados automáticos.
- No trabajar directamente sobre `codex/dev`.
- No iniciar una nueva tarea mientras la actual siga en curso.
- No mezclar cambios de tareas distintas en la misma rama salvo autorización explícita.

## Patrón Estándar para Alineación de Módulos UI
Para las tareas de alineación de módulos (basadas en `config/categories`), se deben seguir estas reglas obligatorias:

**Prerrequisito de Datos**: Antes de iniciar la alineación visual, verificar si el backend (repositorio, caso de uso y caché) soporta paginación y filtrado. Si el contrato de datos no incluye `ResponseAction` con metadata de paginación (`currentPage`, `totalPages`), el backend debe ser actualizado primero.

1. **Arquitectura de Carga (Server-First)**: 
   - Toda la data (listados, categorías, sucursales, etc.) debe cargarse en el Server Component (`page.tsx`) mediante `Promise.all` si es necesario.
   - Pasar los datos por props a los componentes hijos.
   - **PROHIBIDO**: Importar módulos con `server-only` (como `*.cache.ts`) directamente en Client Components (`use client`).
2. **Feedback Visual (Transiciones)**: 
   - Las actualizaciones de URL (paginación, búsqueda) en `ListDef` deben envolverse en `startTransition`.
   - El estado `isPending` de la transición debe pasarse a la prop `isLoading` de `ListTable` para mostrar el spinner.
3. **Interfaz de Usuario (Formularios)**: 
   - Sustituir `Modal` por `CustomSlideOver`.
   - Utilizar `useCustomSlideOver` dentro de `CustomForm` para inyectar los botones de acción en el footer del slide-over.
4. **Componentes Anidados (ComboboxForm)**: 
   - Cuando un `ComboboxForm` esté dentro de un `CustomSlideOver` (o cualquier componente de Radix `Sheet`), debe renderizarse sin Portal para evitar conflictos de foco y permitir el scroll nativo.
   - Usar `modal={true}` en el Root del Popover y asegurar que el `CommandInput` tenga `autoFocus`.
5. **Paginación y Filtros**: 
   - Seguir la estructura de `ResponseAction` (`currentPage`, `totalPages`).
   - Implementar búsqueda con debounce (700ms) que actualice la URL mediante `searchParams`.

## Reglas operativas críticas
- Reutiliza primero componentes de `@/components/common/` y, si no existe una opción adecuada, usa `@/components/ui/`.
- No crees archivos sueltos en `src/utils/`, `src/lib/` o `src/hooks/`; usa subcarpetas descriptivas.
- Prioriza Server Components y Server Actions sobre lógica de cliente cuando el caso lo permita.

## Cambios de alto impacto
- Toda modificación en código compartido, reusable o consumido por múltiples módulos debe tratarse como cambio de alto impacto.
- Antes de editar piezas compartidas, revisa primero sus usos activos y evalúa si cambia contrato, comportamiento o expectativas de otros consumidores.
- Si el cambio puede alterar comportamiento observable o contratos reutilizados, requiere confirmación previa del usuario antes de editar.
- Si el cambio es backward-compatible y no altera consumidores existentes, puedes proceder con validación técnica proporcional al impacto.
