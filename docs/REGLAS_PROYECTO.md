# Manual Maestro de Reglas del Proyecto

Este documento establece los lineamientos técnicos, arquitectónicos y de colaboración para el proyecto **POS Next.js 16**. Es de cumplimiento obligatorio para todos los desarrolladores y agentes de IA.

---

## 1. Stack Tecnológico

El proyecto utiliza las siguientes tecnologías en sus versiones más recientes y estables:

- **Framework**: Next.js 16 (App Router, Server Actions).
- **Lenguaje**: TypeScript.
- **Base de Datos**: Supabase (PostgreSQL).
- **ORM**: Prisma.
- **Autenticación**: Auth.js.
- **Estado Global**: Zustand (Cliente).
- **Estilos**: Tailwind CSS.
- **Componentes UI**: shadcn/ui.
- **IA Integration**: Vercel AI SDK.

---

## 2. Convenciones de Git

### Mensajes de Commit
- **Formato**: `<type>(<scope>): <mensaje>`
- **Idioma**: El mensaje (`subject`) debe estar siempre en **español** e **imperativo**.
- **Conventional Commits**:
  - `feat`: Nueva funcionalidad.
  - `fix`: Corrección de errores.
  - `chore`: Tareas de mantenimiento (deps, config).
  - `docs`: Cambios en documentación.
  - `refactor`: Mejora de código sin cambiar funcionalidad.
  - `test`: Añadir o corregir pruebas.
- **Reglas**:
  - Sin mayúscula inicial en el mensaje (salvo nombres propios).
  - Sin punto final al final del mensaje.
- **Ejemplos de Mensajes de Commit (Modo Imperativo)**

| Tipo | ❌ Incorrecto | ✅ Correcto (Imperativo) |
| :--- | :--- | :--- |
| **feat** | feat: agregar validación... | feat: agrega validación... |
| **fix** | fix: corregido error en... | fix: corrige error en... |
| **refactor** | refactor: moviendo archivos... | refactor: mueve archivos... |

### Pull Requests
- Resumen breve en español.
- Lista de cambios principales.
- Mención explícita de *Breaking Changes*.

---

## 3. Principios de Código (TypeScript y Tailwind)

### TypeScript
- Uso estricto de **TypeScript** en todo código nuevo.
- Definir interfaces claras para props, respuestas de API y estados.
- Preferir `unknown` sobre `any`.
- Uso de tipos modernos (`as const`, generics, narrowing).

### Tailwind CSS y UI
- Utilizar el sistema de diseño basado en **Tailwind** y **shadcn/ui**.
- Reutilizar componentes de `@/components/ui/`.
- Componentes React:
  - El **nombre del componente** debe ir en `PascalCase` aunque el archivo esté en `kebab-case`.
  - Ejemplo: archivo `register-closure-header.tsx` → componente `RegisterClosureHeader`.

---

## 4. Organización de Carpetas de Soporte (utils, lib, hooks)

Para evitar la saturación de la raíz en carpetas de soporte, se prohíbe la creación de archivos sueltos. Todo código debe estar categorizado en subcarpetas descriptivas.

### Regla Estricta
- **PROHIBIDO**: Crear archivos directos en `src/utils/`, `src/lib/` o `src/hooks/`.
- **Correcto**: `src/utils/string/string.utils.ts` o `src/utils/formatters/currency.utils.ts`.

---

## 5. Categorización de Utilidades (Global vs Módulo)

Es vital distinguir entre utilidades que sirven a todo el proyecto y aquellas que son exclusivas de la lógica de un módulo.

### Utilidades Globales
Son funciones genéricas que no dependen de la lógica de negocio de un módulo específico (ej: formateo de fechas, manipulación de strings, cálculos matemáticos genéricos).
- **Ubicación**: `src/utils/<categoria>/<nombre>.utils.ts`
- **Ejemplo**: `src/utils/string/slug.utils.ts`

### Utilidades de Módulo
Son funciones que contienen lógica de negocio específica o dependencias de un módulo concreto.
- **Ubicación**: `src/server/modules/<modulo>/utils/` (o integradas en `use-cases/` si son muy específicas).
- **Ejemplo**: `src/server/modules/sale/utils/calculate-tax.utils.ts`

---

## 6. Arquitectura de Servidor (Modular Clean Architecture)

El núcleo del negocio se centraliza en `src/server/modules/`. Cada módulo debe seguir una jerarquía estricta:

### Estructura de Módulo (`src/server/modules/<nombre-modulo>/`)

1.  **`domain/`**:
    *   Esquemas de validación de Zod (ej: `category.input.schema.ts`).
    *   Definiciones de tipos e interfaces del dominio.
2.  **`repository/`**:
    *   Acceso directo a datos (Prisma/Supabase).
    *   Sufijo obligatorio: `*.repository.ts`.
3.  **`use-cases/`**:
    *   Lógica de negocio pura.
    *   Sufijo obligatorio: `*.use-case.ts`.
4.  **`next/`**: Integración con el framework Next.js.
    *   **`actions/`**: Server Actions. Sufijo: `*.action.ts`.
  *   **`cache/`**: Lógica de revalidación y caché. Sufijo: `*.cache.ts`.

### Regla de Nomenclatura
Todos los archivos internos deben llevar el nombre del módulo como prefijo.
*   Ejemplo: `category.get-by-id.repository.ts`.

---

## 7. Lineamientos de Migración

Estamos en un proceso de transición desde una estructura legacy hacia la arquitectura modular.

- **Legacy**: `src/lib/data`, schemas globales y utilidades antiguas.
- **Migración Progresiva**: Cuando se trabaje en una funcionalidad de un módulo existente en legacy, se debe mover la lógica y los schemas a su correspondiente ubicación dentro de `src/server/modules/`.
- **Prohibición**: NO crear código nuevo en rutas legacy. Todo desarrollo nuevo debe seguir el estándar modular.

---

## 8. Instrucciones para el Asistente (IA)

- **Referencia**: Usa siempre este documento como fuente de verdad.
- **Reutilización**: Antes de crear, busca si existe algo similar en los módulos actuales.
- **Consistencia**: Mantén el estilo de nombres (kebab-case para archivos, PascalCase para componentes).
- **Minimalismo**: Realiza el cambio mínimo necesario respetando la arquitectura.
