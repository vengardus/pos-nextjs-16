Refactor Category query a clean architecture (Next.js 16).

Contexto actual:
- src/lib/data/categories/category.get-all-by-company.ts (contiene categoryGetAllByCompany)
- src/lib/data/categories/category.cache.ts (contiene categoryGetAllByCompanyCached)
Objetivo:
- Mover todo a src/server/category/*
- Separar query en Repository + UseCase
- El wrapper cached debe llamar al UseCase
- Mantener convención: archivos y funciones con sufijo (.repository / .use-case / .cache) y funciones con sufijo (Repository / UseCase / Cached)

Tareas:

1) Crear Repository
- Nuevo archivo: src/server/category/repository/category.get-all-by-company.repository.ts
- Export: async function categoryGetAllByCompanyRepository(companyId: string)
- Mover aquí SOLO el acceso a datos con Prisma (el findMany actual).
- No usar ResponseAction, initResponseAction, getActionError.
- Importar prisma desde la nueva capa (ideal: "@/server/db/prisma" o la ruta que uses en server/db).

2) Crear Use Case
- Nuevo archivo: src/server/category/use-cases/category.get-all-by-company.use-case.ts
- Nombre función: categoryGetAllByCompanyUseCase(companyId: string): Promise<ResponseAction>
- Aquí va:
  - initResponseAction()
  - validación (companyId requerido)
  - try/catch + getActionError
  - llamar a categoryGetAllByCompanyRepository(companyId)
  - set resp.data, resp.success

3) Mover y ajustar cache
- Mover archivo: src/lib/data/categories/category.cache.ts -> src/server/category/next/cache/category.cache.ts
- Asegurar que el cached wrapper (categoryGetAllByCompanyCached) llame a:
  categoryGetAllByCompanyUseCase(companyId)
- Mantener la config actual de unstable_cache (tags, revalidate, keyParts) tal cual.

4) Eliminar/actualizar el archivo viejo
- Eliminar o dejar como re-export (temporal) el archivo:
  src/lib/data/categories/category.get-all-by-company.ts
  (preferible eliminar y actualizar imports)

5) Update imports en todo el proyecto
- Reemplazar imports antiguos que apunten a src/lib/data/categories/* para que apunten a:
  - categoryGetAllByCompanyUseCase (si corresponde)
  - categoryGetAllByCompanyCached (si se consume desde UI/SA)
- Debe compilar sin errores y sin cambiar el comportamiento.

Entrega:
- Muestra el contenido final de:
  - category.get-all-by-company.repository.ts
  - category.get-all-by-company.use-case.ts
  - category.cache.ts (nuevo path)
- Muestra también qué imports fueron actualizados (lista o diff).
