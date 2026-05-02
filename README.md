# POS Next.js 16 🚀

Sistema de Punto de Venta (POS) modular de alto rendimiento basado en **Next.js 16** y **Clean Architecture**. El objetivo es ofrecer un núcleo de negocio escalable, mantenible y fácil de extender mediante módulos independientes.

**URL de la app:** https://pos-nextjs-16.vercel.app

## Índice

- [Propósito](#propósito)
- [Arquitectura del sistema (Core)](#arquitectura-del-sistema-core)
- [Stack tecnológico](#stack-tecnológico)
- [Sistema de diseño y UI](#sistema-de-diseño-y-ui)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Guía de desarrollo](#guía-de-desarrollo)

## Propósito

POS Next.js 16 es un **sistema de Punto de Venta modular de alto rendimiento**, diseñado para soportar crecimiento por módulos y mantener la lógica de negocio aislada del framework.

## Arquitectura del sistema (Core)

El núcleo del negocio vive en `src/server/modules/`, siguiendo la **Modular Clean Architecture**. Cada módulo se divide en capas con responsabilidades claras:

```text
Domain (Zod) -> Repository (Prisma) -> Use Case -> Server Action
```

### Flujo de datos

- **Domain**: esquemas Zod y tipos de dominio.
- **Repository**: acceso a datos (Prisma/Supabase).
- **Use Case**: lógica de negocio pura.
- **Server Action**: integración con Next.js (App Router).

### Módulos activos

- ai
- auth
- branch
- branch-user
- brand
- cash-register
- cash-register-closure
- cash-register-movement
- category
- client-supplier
- company
- dashboard
- document-type
- kardex
- payment-method
- permission
- product
- role
- sale
- user
- warehouse

## Stack tecnológico

Versiones clave detectadas en `package.json`:

- **Next.js** 16.1.1
- **TypeScript** 5.x
- **Supabase** 2.49.7
- **Prisma** 6.4.1
- **Zustand** 5.0.3
- **Tailwind CSS** 3.4.1

## Sistema de diseño y UI

- **UI** basada en **shadcn/ui** con composición de componentes reutilizables.
- **OKLCH** como base de color en `globals.css` y `tailwind.config.ts`, garantizando consistencia cromática entre modo claro y oscuro.

## Estructura de carpetas

Mapa simplificado del proyecto con responsabilidades principales:

```text
src/
├─ app/                # App Router y rutas
├─ components/         # Componentes UI y composición
│  └─ ui/              # Componentes shadcn/ui
├─ server/
│  └─ modules/         # Núcleo de negocio modular (Clean Architecture)
├─ styles/             # Tokens y estilos globales
├─ utils/              # Utilidades globales por categoría
```

> Nota: las utilidades globales deben vivir en `src/utils/<categoria>/` y las utilidades específicas por módulo en `src/server/modules/<modulo>/utils/`.

## Guía de desarrollo

### Instalación

```bash
bun install
```

### Desarrollo local

```bash
bun dev
```

### Script de integración (dev-sync)

Para pruebas en ramas locales, ejecuta el script de integración:

```bash
bun run dev-sync
```

### Convenciones de commits

- Formato: `<type>(<scope>): <mensaje>`
- Mensaje en **español**, **imperativo**, sin mayúscula inicial ni punto final.

Ejemplo:

```text
feat(auth): agrega autenticación con proveedores
```
