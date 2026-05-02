# Manual Maestro de Reglas del Proyecto

Este documento establece los lineamientos técnicos, arquitectónicos y de colaboración para el proyecto **POS Next.js 16**. Es de cumplimiento obligatorio para todos los desarrolladores y agentes de IA.

## 1. Identidad del proyecto
- POS Next.js 16 es un sistema de punto de venta en evolución hacia una arquitectura limpia y formal.
- El proyecto viene de una migración histórica desde una base más legacy, pero el objetivo actual es consolidar una estructura estable, coherente y mantenible.
- La UI y el código deben avanzar hacia patrones modernos sin perder compatibilidad con lo ya existente cuando todavía sea necesario.

## 2. Objetivo arquitectónico permanente
- El código debe evolucionar bajo principios de Clean Architecture: bajo acoplamiento, responsabilidades claras, composición predecible y separación entre dominio, acceso a datos e integración con framework.
- Se prioriza código limpio, reutilizable, escalable y consistente con los patrones vigentes del proyecto por encima de soluciones ad hoc.
- Antes de introducir una estructura, helper, wrapper, patrón o abstracción nueva, se debe buscar primero una implementación activa y equivalente en el repositorio.
- Si existe un patrón vigente y reusable, se debe seguir. Solo se permite introducir un patrón nuevo cuando el existente no cubra el caso o exista una limitación técnica real.
- Cambios transversales de patrón o cambios de contrato en piezas reutilizadas requieren confirmación previa del usuario.

## 3. Fuente de verdad del dominio
- Cada módulo debe tener un dominio claro que actúe como fuente de verdad para tipos, validaciones y contratos.
- Los esquemas y tipos del dominio deben reflejar la lógica real del negocio y servir de base para el resto de capas.
- La UI, los use-cases, los repositories y las acciones de Next.js deben alinearse con ese dominio, no redefinirlo.
- Cuando una regla de negocio cambie, el dominio debe actualizarse primero y luego propagarse a las capas dependientes.

## 4. Patrón formal de servidor
- La entrada de servidor puede ser un Server Component, una Server Action o un Route Handler, según el consumidor.
- La lógica de negocio vive en `use-cases/`.
- El acceso directo a datos vive en `repository/`.
- Las lecturas repetidas o costosas deben pasar por una capa de cache o equivalente cuando aplique.
- Patrón esperado:
  - lecturas: entrada -> cache/puente -> use-case -> repository
  - lecturas desde cliente: Client Component -> Server Action puente -> cache/puente -> use-case -> repository
  - mutaciones: entrada -> use-case -> repository
- Tras una mutación exitosa, la invalidación o revalidación debe resolverse en la capa de entrada cuando aplique.

## 5. Patrón formal de UI
- La UI debe apoyarse en componentes reutilizables y predecibles.
- Antes de crear un componente nuevo, busca primero en `@/components/common/`.
- Si no existe una opción adecuada ahí, busca luego en `@/components/ui/`.
- Solo crea una pieza nueva si ninguna de las dos cubre el caso.
- Los componentes de dominio o de feature deben vivir en su módulo correspondiente, no en lugares genéricos sin contexto.
- Evita mezclar lógica de negocio dentro de componentes visuales.
- Los formularios y estados deben estar bien tipados y alineados con el dominio.
- Antes de crear una UI nueva, busca primero un patrón equivalente ya usado en el proyecto.

## 6. Stack tecnológico
- **Framework**: Next.js 16 (App Router, Server Actions).
- **Lenguaje**: TypeScript.
- **Base de datos**: Supabase (PostgreSQL).
- **ORM**: Prisma.
- **Autenticación**: Auth.js.
- **Estado global**: Zustand en cliente.
- **Estilos**: Tailwind CSS.
- **Componentes UI**: shadcn/ui.
- **IA Integration**: Vercel AI SDK.

## 7. Convenciones de Git

### Ramas de trabajo
- Toda tarea nueva debe iniciarse en una rama nueva creada desde `codex/dev`.
- No se debe trabajar directamente sobre `codex/dev`.
- No inicies una nueva tarea mientras la actual siga en curso.
- Mantén cada rama acotada a un objetivo claro y verificable.
- No mezcles cambios de tareas distintas en la misma rama salvo autorización explícita.

### Mensajes de commit
- Formato: `<type>(<scope>): <mensaje>`.
- El mensaje debe escribirse en español, en modo imperativo, sin mayúscula inicial y sin punto final.
- Tipos permitidos:
  - `feat`: nueva funcionalidad
  - `fix`: corrección de errores
  - `chore`: mantenimiento, dependencias o configuración
  - `docs`: cambios en documentación
  - `refactor`: mejoras internas sin cambio funcional
  - `test`: pruebas o correcciones de pruebas

### Pull Requests
- Resumen breve en español.
- Lista de cambios principales.
- Mención explícita de *Breaking Changes* si aplica.

## 8. Principios de código

### TypeScript
- Uso estricto de TypeScript en todo código nuevo.
- Definir interfaces claras para props, respuestas de API y estados.
- Preferir `unknown` sobre `any`.
- Uso de tipos modernos (`as const`, generics, narrowing).

### Tailwind CSS y UI
- Utilizar el sistema de diseño basado en Tailwind y shadcn/ui.
- Reutilizar componentes de `@/components/ui/`.
- El nombre del componente debe ir en `PascalCase` aunque el archivo esté en `kebab-case`.

## 9. Organización de carpetas de soporte
- No se permite crear archivos sueltos en `src/utils/`, `src/lib/` o `src/hooks/`.
- Todo código de soporte debe estar categorizado en subcarpetas descriptivas.
- Ejemplos válidos:
  - `src/utils/string/slug.utils.ts`
  - `src/utils/formatters/currency.utils.ts`

## 10. Categorización de utilidades

### Utilidades globales
- Son funciones genéricas que no dependen de la lógica de negocio de un módulo específico.
- Ubicación: `src/utils/<categoria>/<nombre>.utils.ts`.

### Utilidades de módulo
- Son funciones que contienen lógica de negocio específica o dependencias de un módulo concreto.
- Ubicación: `src/server/modules/<modulo>/utils/` o integradas en `use-cases/` si son muy específicas.

## 11. Arquitectura de servidor modular
El núcleo del negocio se centraliza en `src/server/modules/`. Cada módulo debe seguir esta jerarquía:

### Estructura de módulo
1. `domain/`
   - Esquemas de validación de Zod.
   - Definiciones de tipos e interfaces del dominio.
2. `repository/`
   - Acceso directo a datos con Prisma o Supabase.
   - Sufijo obligatorio: `*.repository.ts`.
3. `use-cases/`
   - Lógica de negocio pura.
   - Sufijo obligatorio: `*.use-case.ts`.
4. `next/`
   - Integración con Next.js.
   - `actions/`: Server Actions con sufijo `*.action.ts`.
   - `cache/`: lógica de revalidación y caché con sufijo `*.cache.ts`.

### Regla de nomenclatura
- Todos los archivos internos deben llevar el nombre del módulo como prefijo.
- Ejemplo: `category.get-by-id.repository.ts`.

## 12. Lineamientos de migración
- El proyecto está en una transición desde una estructura legacy hacia la arquitectura modular.
- Legacy incluye rutas antiguas, schemas globales y utilidades heredadas.
- Cuando se trabaje en una funcionalidad de un módulo existente en legacy, se debe mover la lógica y los schemas a su ubicación correspondiente dentro de `src/server/modules/`.
- No se debe crear código nuevo en rutas legacy. Todo desarrollo nuevo debe seguir el estándar modular.

## 13. Cambios de alto impacto
- Toda modificación en código compartido, reusable o consumido por múltiples módulos debe tratarse como cambio de alto impacto.
- Antes de editar piezas compartidas, se deben revisar sus usos activos y evaluar si cambia contrato, comportamiento o expectativas de otros consumidores.
- Si el cambio puede alterar comportamiento observable o contratos reutilizados, requiere confirmación previa del usuario antes de editar.
- Esto aplica especialmente a `src/components/common/`, `src/components/ui/`, `src/lib/`, `src/utils/`, `src/server/common/` y contratos compartidos.
- Si el cambio es backward-compatible y no altera consumidores existentes, se puede proceder con validación técnica proporcional al impacto.

## 14. Criterios de cierre y validación
- No se considera una tarea cerrada si no fue validada técnica y funcionalmente.
- Antes de cerrar, verifica que los cambios compilan, respetan las normas de tipo y no rompen el flujo esperado.
- El procedimiento operativo detallado, incluyendo los comandos de validación (como `tsc --noEmit`) y el flujo de trabajo, se encuentra definido en `AGENTS.md`.

## 15. Instrucciones para el asistente
- Usa siempre este documento como fuente de verdad para el estándar técnico del proyecto.
- Busca primero si ya existe algo similar en el repositorio antes de crear nuevas piezas.
- Mantén consistencia en los nombres: kebab-case para archivos y PascalCase para componentes.
- Realiza el cambio mínimo necesario respetando la arquitectura.
- Responde de forma precisa y breve por defecto, ampliando solo cuando sea necesario para evitar errores o ambigüedad.
- Optimiza el uso de tokens evitando repeticiones, contexto redundante y explicaciones largas cuando una instrucción corta basta.
