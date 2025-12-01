# Instrucciones para Codex

## Convenciones de Git: commits y PRs

### Mensajes de commit
- Usa **Conventional Commits** para todos los commits.
- El `subject` del commit (línea de título) debe estar **siempre en español**.
- Formato: `<type>(<scope>): <mensaje>`
  - `<type>` ∈ {feat, fix, chore, docs, refactor, test}
  - `<scope>` es opcional.
- No uses mayúscula inicial en el mensaje salvo nombres propios.
- No agregues punto final al `subject`.

#### Ejemplos

- feat(api): agregar endpoint para crear usuarios
- fix(ui): corregir desbordamiento en tabla de reportes
- chore(ci): actualizar flujo de despliegue en staging

### Pull Requests
- Incluye resumen breve en español.
- Enumera cambios principales en viñetas.
- Menciona breaking changes si las hay.

---

## Convenciones de código y arquitectura

Estas reglas aplican a todo el código generado o modificado en este repositorio (Next.js 16, TypeScript, Supabase, Tailwind, auth.js, shadcn/ui, Prisma, Zustand).

### Estructura de archivos y nombres

- Respeta la **estructura de carpetas existente**.  
  - No crees nuevas carpetas ni módulos a menos que el usuario lo pida explícitamente.
- Nombres de archivos:
  - Usa nombres en **kebab-case** con segmentos descriptivos, por ejemplo:
    - `register-closure-header.tsx`
    - `user-profile-card.tsx`
    - `use-session-store.ts`
  - Usa sufijos coherentes según el tipo de archivo:
    - Componentes React: `*.tsx`
    - Hooks: `use-*.ts` o `use-*.tsx`
    - Stores de Zustand: `*.store.ts`
    - Schemas/validaciones: `*.schema.ts`
    - Utilidades: `*.utils.ts`
- Componentes React:
  - El **nombre del componente** debe ir en `PascalCase` aunque el archivo esté en `kebab-case`.
  - Ejemplo: archivo `register-closure-header.tsx` → componente `RegisterClosureHeader`.

### TypeScript

- Todo el código nuevo debe estar en **TypeScript**.
- Declara tipos e interfaces cuando la firma pública lo amerite:
  - Props de componentes.
  - Respuestas de APIs.
  - Stores de Zustand.
- Prefiere:
  - `type` o `interface` según el estilo ya existente en el archivo/proyecto.
  - `unknown` en lugar de `any` cuando sea posible.
- Usa características modernas de TS:
  - Tipos genéricos cuando aporten claridad.
  - `as const` cuando corresponda.
  - Narrowing de tipos en lugar de casts agresivos.

### Next.js

- Respeta el patrón actual del proyecto (App Router o Pages Router) según la estructura existente.
- No cambies páginas existentes (`page.tsx`, `layout.tsx`, etc.) de client a server component (o viceversa) salvo que el usuario lo pida.
- Para nuevas rutas:
  - Sigue la **misma estructura de carpetas y naming** que el resto del proyecto.
  - Copia el patrón de imports, loaders, server actions, etc. desde archivos similares existentes.
- Si se usan **Server Components**:
  - Prioriza lógica de datos en server components o server actions cuando corresponda.
- Si se usan **Client Components**:
  - Asegúrate de incluir `"use client"` solo cuando sea necesario.

### Tailwind, shadcn/ui y UI

- Usa **Tailwind** siguiendo los patrones ya presentes en el proyecto.
- Para componentes shadcn/ui:
  - Importa desde las rutas ya definidas en el proyecto (por ejemplo `@/components/ui/button`) en lugar de nuevas rutas.
  - Respeta la composición y variantes utilizadas en otros componentes.
- No mezcles patrones de diseño distintos sin necesidad:
  - Si un flujo usa ya un patrón de “card + header + body”, respeta ese patrón en las nuevas pantallas relacionadas.

### Supabase, auth.js, Prisma, Zustand

- **Supabase**:
  - Reutiliza el cliente de Supabase ya existente (no crees uno nuevo).
  - Sigue el patrón actual para:
    - manejo de sesiones
    - llamadas RPC
    - suscripciones en tiempo real
- **auth.js**:
  - Reutiliza funciones/helpers ya definidos para:
    - obtener sesión/usuario actual
    - proteger rutas
  - No dupliques lógica de autenticación.
- **Prisma**:
  - Reutiliza el único `PrismaClient` compartido del proyecto (no crees instancias nuevas).
  - Sigue el patrón de acceso a datos ya existente (repositorios, servicios, etc., si los hay).
- **Zustand**:
  - Reutiliza stores existentes antes de crear uno nuevo.
  - Nuevas piezas de estado global deben integrarse en el store apropiado, siempre que tenga sentido.

---

## Reglas del asistente para este proyecto

Estas reglas son **obligatorias** para el asistente cuando trabaje en este repositorio.

### 1. Respeto a estándares del proyecto

- Debes **respetar la estructura de carpetas existente**.
  - No crees nuevas carpetas ni módulos a menos que el usuario lo pida explícitamente.
- Sigue siempre las **convenciones de nombres** ya usadas en el proyecto:
  - Variables y funciones en `camelCase`.
  - Clases y componentes en `PascalCase`.
  - Archivos en `kebab-case`, ej: `register-closure-header.tsx`.
  - Hooks comenzando por `use*`.
- No cambies nombres existentes (funciones, clases, archivos, carpetas, variables públicas, stores) salvo que el usuario lo solicite explícitamente.

### 2. Reutilización de código y librerías

- Antes de proponer o crear:
  - una nueva función,
  - clase,
  - hook,
  - helper,
  - store de Zustand,
  - servicio,
  - módulo,
  
  debes **intentar reutilizar** algo ya existente, siguiendo el contexto de código que tengas.
- Preferencias:
  - **Primero** reutilizar funciones, hooks, componentes y stores ya definidos en el proyecto.
  - **Segundo** extender/componer los existentes (por ejemplo, envolver un componente shadcn con lógica propia).
  - **Último recurso**: crear archivos nuevos, y solo si el usuario no indicó lo contrario.
- Librerías:
  - Usa **librerías ya presentes en el proyecto**.
  - Propón nuevas dependencias solo si es estrictamente necesario y siempre resaltando que son nuevas.

### 3. Uso de archivos de ejemplo como plantilla

Cuando el usuario diga algo como “sigue el ejemplo de `<archivo>`” o “usa `<archivo>` como referencia”:

- Trata ese archivo **como plantilla** para:
  - Estructura general del componente/módulo.
  - Patrones de diseño (servicios, hooks, stores, server actions, etc.).
  - Estilo de imports y exports (incluyendo alias como `@/components/...`, `@/lib/...`, etc.).
  - Tipos e interfaces de TypeScript.
  - Manejo de errores, logs, loading states y validaciones.
- Respeta:
  - El orden de secciones: imports, tipos, constantes, hooks, componente principal, exports.
  - El estilo de las llamadas a funciones y la forma de inyectar dependencias o parámetros.
- Si implementas nuevas funciones/clases/componentes basados en ese ejemplo:
  - Mantén firmas de funciones, nombres de parámetros y forma de uso **lo más parecidos posible** al ejemplo, adaptándolos solo a la nueva funcionalidad.

### 4. Código óptimo y uso de funciones modernas

- El código generado debe ser **claro, conciso y moderno**, evitando complejidad innecesaria.
- Usa características modernas de JavaScript/TypeScript cuando aporten valor:
  - `const` y `let` (no `var`).
  - Funciones flecha cuando encajen.
  - `async/await` en lugar de `then/catch` anidados.
  - Métodos de arrays modernos (`map`, `filter`, `reduce`, `some`, `every`, `flatMap`, etc.).
  - Operadores:
    - optional chaining `?.`
    - nullish coalescing `??`
    - destructuring y spread `...`
- En React/Next:
  - Evita renders innecesarios y repeticiones de lógica:
    - Memoiza solo cuando tenga sentido (`useMemo`, `useCallback`).
    - Extrae componentes/funciones reutilizables.
  - Evita estados o efectos que no sean necesarios:
    - Prefiere derivar valores de props/estado en lugar de duplicar estado.
- No sacrifiques **legibilidad** por micro-optimizaciones salvo que el usuario lo pida explícitamente.

### 5. Modificación de código existente

- Modifica **el mínimo código necesario** para cumplir la tarea.
- No hagas refactors amplios ni reestructuraciones completas a menos que el usuario lo pida.
- Mantén el mismo estilo de:
  - formato,
  - comentarios,
  - logs,
  - manejo de errores y loaders/skeletons.
- Si debes elegir entre:
  - una solución “genérica” o
  - una solución que **siga la forma en que ya está escrito el proyecto**,  
  elige siempre **la que respete el estilo del proyecto**.

### 6. Comunicación en las respuestas

- Cuando propongas nuevas funciones, clases, componentes o archivos:
  - Explica brevemente **qué parte del proyecto estás reutilizando** (por ejemplo:  
    “esto sigue el patrón de `register-closure-header.tsx`” o “reutiliza el store `use-session-store`”).
- Si el usuario pide “seguir el ejemplo de X”:
  - Menciona explícitamente cómo estás usando ese archivo como plantilla:
    - estructura,
    - imports,
    - tipos/interfaces,
    - manejo de estado,
    - manejo de errores.

