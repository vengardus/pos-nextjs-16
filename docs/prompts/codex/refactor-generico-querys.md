# Task: Refactor módulo lib/data -> server (clean architecture)

## Variables (editar solo esto)
- ORIGEN_MODULO: "<ORIGEN_MODULO>"
- DESTINO_MODULO: "<DESTINO_MODULO>"

## Instrucciones
Refactor genérico por módulo a clean architecture (Next.js 16).

Contexto:
- Todo lo del módulo está hoy en: src/lib/data/<ORIGEN_MODULO>/*
- Quiero moverlo a: src/server/modules/<DESTINO_MODULO>/*
- Los nombres de archivos/operaciones varían (getAll, getAllByCompany, getById, search, etc) pero la refactorización es la misma.
- Convención: archivos *.repository.ts, *.use-case.ts, *.cache.ts, *.action.ts y funciones con sufijo Repository/UseCase/Cached/Action.
- En mutaciones (Server Actions) se usa updateTag (Next 16).

Objetivo:
1) Mover el módulo completo desde src/lib/data/<ORIGEN_MODULO> a src/server/modules/<DESTINO_MODULO>.
2) Por cada query (archivo que obtiene data):
   - Crear Repository en:  src/server/modules/<DESTINO_MODULO>/repository/
   - Crear UseCase en:     src/server/modules/<DESTINO_MODULO>/use-cases/
   - Si existía cache wrapper, mover/crear en:
     src/server/modules/<DESTINO_MODULO>/next/cache/
3) Los wrappers Cached deben llamar a sus UseCase (Cached → UseCase → Repository).
4) Los Server Actions (mutaciones) deben ir en:
   src/server/modules/<DESTINO_MODULO>/next/actions/
5) Actualizar imports en TODO el proyecto para que nada se rompa.
6) Eliminar los archivos viejos en src/lib/data/<ORIGEN_MODULO> (o dejar re-export temporal si hace falta, pero preferible eliminarlos).

Reglas por capa:
A) Repository:
- Solo acceso a datos (Prisma/Supabase).
- NO usar ResponseAction, initResponseAction, getActionError.
- Mantener EXACTA la query original (where/select/include/orderBy/pagination).
- Importar prisma/supabase desde src/server/db/* (o su alias).
- Funciones con sufijo Repository.

B) UseCase:
- Retorna ResponseAction.
- Usa initResponseAction + try/catch + getActionError.
- Valida inputs (mínimo requerido; si hay schemas domain existentes, úsalos).
- Llama al Repository.
- Funciones con sufijo UseCase.

C) Cache:
- Archivo en src/server/modules/<DESTINO_MODULO>/next/cache/
- Mantener tags/revalidate/keyParts/config EXACTAMENTE como antes.
- Funciones con sufijo Cached que llaman al UseCase.

D) Server Actions:
- Delgadas: validar input, llamar UseCase, luego updateTag/revalidatePath según corresponda.
- Funciones con sufijo Action.

Procedimiento:
1) Analiza todos los archivos de src/lib/data/<ORIGEN_MODULO> y clasifícalos en:
   - Queries (lecturas)
   - Mutaciones/SA
   - Cache wrappers
   - Helpers internos del módulo
2) Para cada lectura: crea Repository + UseCase + (si aplica) Cached.
3) Mueve cache wrappers a next/cache, actions a next/actions.
4) Ajusta todas las rutas de imports.
5) Verifica que TypeScript compile sin errores y que el comportamiento no cambie.

Alcance estricto: 
Realiza cambios SOLO para src/lib/data/<ORIGEN_MODULO> y su destino src/server/modules/<DESTINO_MODULO>; no modifiques otros módulos ni muevas archivos fuera de ese alcance, excepto los imports necesarios para compilar.


Entrega obligatoria:
- Lista de archivos creados/movidos con sus nuevas rutas.
- Lista de imports actualizados.
- Confirmación de build/typecheck sin errores.
