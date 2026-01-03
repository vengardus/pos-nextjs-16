Refactor de Server Actions (mutaciones) a clean architecture por módulo (Next.js 16).

VARIABLES (solo cambia esto):
- ORIGEN_MODULO = "<ORIGEN_MODULO>"          // carpeta actual en src/actions (ej: "payment-methods")
- DESTINO_MODULO = "<DESTINO_MODULO>"        // carpeta destino en src/server/modules (ej: "payment-method")

Contexto actual:
- Los Server Actions están en: src/actions/<ORIGEN_MODULO>/*
- Hay acciones como insert-or-update, delete-by-id, etc.
- Dentro del SA hoy se usa Prisma directamente (y updateTag/revalidatePath).
- Convención del proyecto: archivos y funciones con sufijos Action/UseCase/Repository.

Objetivo:
1) Mover los Server Actions a:
   - src/server/modules/<DESTINO_MODULO>/next/actions/
2) Separar cada SA en 3 capas:
   - Repository: src/server/modules/<DESTINO_MODULO>/repository/*.repository.ts
   - UseCase:    src/server/modules/<DESTINO_MODULO>/use-cases/*.use-case.ts
   - Action:     src/server/modules/<DESTINO_MODULO>/next/actions/*.action.ts
3) El Action debe ser delgado:
   - Validación de input (mínimo requerido; usar schemas domain si existen)
   - Llamar al UseCase
   - Ejecutar updateTag(...) y/o revalidatePath(...) según corresponda
4) El UseCase:
   - Orquesta la operación y reglas de negocio
   - Llama al Repository
   - Retorna ResponseAction usando initResponseAction + getActionError
5) El Repository:
   - Solo Prisma (create/update/delete/find)
   - Sin ResponseAction, sin initResponseAction, sin getActionError
6) Actualizar imports/calls en todo el proyecto:
   - Donde se importaba desde src/actions/<ORIGEN_MODULO> ahora debe apuntar a
     src/server/modules/<DESTINO_MODULO>/next/actions
7) No cambiar comportamiento:
   - Mantener la misma data, validaciones actuales y side effects (tags/paths)
   - Mantener updateTag (Next.js 16) en SA

Reglas de naming:
- Archivos:
  - *.action.ts en next/actions
  - *.use-case.ts en use-cases
  - *.repository.ts en repository
- Funciones:
  - <Entidad><Operacion>Action / UseCase / Repository
  - Ej: paymentMethodInsertOrUpdateAction → paymentMethodInsertOrUpdateUseCase → paymentMethodInsertOrUpdateRepository
  - Ej: paymentMethodDeleteByIdAction → paymentMethodDeleteByIdUseCase → paymentMethodDeleteByIdRepository

Procedimiento:
1) Identifica todos los SA en src/actions/<ORIGEN_MODULO>.
2) Por cada SA:
   - Extrae la parte Prisma a un Repository.
   - Extrae la lógica (ResponseAction + reglas) a un UseCase.
   - Deja el Action como fachada (input + usecase + updateTag/revalidatePath).
   - Donde encuentres revalidatePath y updateTag: primero deberán ir los updateTag y luego el revalidatePath
   - Si usa Transacción y no es necesario, hazlo sin transacción
   - Si el SA solo tiene una llamada a una funcion con sufijo Cached: Este SA es solo un “bridge” para exponer una función *Cached a Client Components. MUEVE el archivo al destino (src/server/modules/<DESTINO_MODULO>/next/actions/) y ACTUALIZA imports/llamadas, pero NO lo refactorices en UseCase/Repository ni cambies su lógica: debe seguir solo llamando al *Cached y retornando su resultado.

3) Mueve archivos a las rutas destino.
4) Actualiza todos los imports del proyecto.
5) Asegura que TypeScript compile sin errores.

Entrega obligatoria:
- Lista de archivos movidos/creados con rutas nuevas.
- Si se quito Transaccion en un SA, indícalo.
- Si se encontro un SA "bridge" indicalo. 
- Contenido final (o diff) de:
  - 1 action refactorizada (insert-or-update)
  - 1 delete refactorizado (delete-by-id)
- Lista de imports actualizados.
- Confirmación de typecheck/build sin errores.
