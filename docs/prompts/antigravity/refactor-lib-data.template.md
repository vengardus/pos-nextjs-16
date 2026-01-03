# Task: Refactor Módulo a Clean Architecture

## Parámetros del Módulo
- **NOMBRE_ORIGEN**: `cash-registers`
- **NOMBRE_DESTINO**: `cash-register`

## Instrucciones de Migración
Refactoriza el módulo siguiendo estrictamente el estándar de arquitectura definido en `@docs/REGLAS_PROYECTO.md` y las instrucciones de `@.cursorrules`.

### Rutas de Trabajo:
- **RUTA_ORIGEN**: `src/lib/data/` + **NOMBRE_ORIGEN**
- **RUTA_DESTINO**: `src/server/modules/` + **NOMBRE_DESTINO**

### Pasos Ejecutivos:
1. **Análisis de Impacto Global (CRÍTICO)**: Antes de mover nada, busca en **todo el proyecto** cualquier referencia a archivos, tipos o interfaces dentro de **RUTA_ORIGEN**. Identifica módulos externos (ej. sales, billing, UI) que dependan de este código.
2. **Mapeo de Capas**: Distribuye las funciones de **RUTA_ORIGEN** en las subcarpetas de **RUTA_DESTINO**: `domain/` (schemas y tipos), `repository/`, `use-cases/`, y `next/` (actions/cache).
3. **Nomenclatura Estricta**: Renombra todos los archivos en el destino usando **NOMBRE_DESTINO** como prefijo (ej: `[NOMBRE_DESTINO].*.ts`).
4. **Gestión de Dependencias**: Actualiza los imports en **TODO** el proyecto. Usa preferentemente alias de ruta `@/`. Asegúrate de que las interfaces movidas a `domain/` sean correctamente re-importadas en los archivos externos detectados en el paso 1.
5. **Validación Técnica (Ahorro de Saldo)**:
   - Verifica que TypeScript compile sin errores.
   - Ejecuta `curl -s localhost:3000/<RUTA_DEL_MODULO>` y verifica que el status sea 200 y el HTML contenga datos.
   - Solo si el curl falla: realiza captura de pantalla para diagnosticar.
6. **Limpieza de Legacy**: Una vez confirmado el éxito del build y las pruebas, elimina físicamente la carpeta **RUTA_ORIGEN**.

## Entrega Obligatoria (Plan de Aprobación)
Antes de realizar cambios, preséntame:
1. **Mapeo de archivos**: Qué archivos se crearán en cada subcarpeta de **RUTA_DESTINO**.
2. **Inventario de Dependencias Externas**: Lista de archivos fuera de la ruta origen que serán afectados por el cambio de imports.
3. **Plan de Tipos**: Confirmación de dónde quedarán las interfaces/tipos compartidos.

## Cierre de Tarea
- **Commit**: Realiza un commit en español e imperativo: `refactor(NOMBRE_DESTINO): migra módulo a arquitectura limpia`.
- **Instrucciones de Prueba**: Indícame el comando exacto de `curl` o la URL para probar que el módulo sigue funcionando.