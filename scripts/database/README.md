# Scripts de Base de Datos

Este directorio contiene scripts para la gestión de respaldos y restauración de la base de datos PostgreSQL (Supabase o Local).

## Requisitos

- `pg_dump` y `psql` instalados en el sistema.
- Archivo `.env` configurado en la raíz del proyecto.

## Configuración del .env

Los scripts utilizan las siguientes variables:

- `DIRECT_URL`: Utilizada por `backup.sh` (recomendado para Supabase para evitar el pooler).
- `DATABASE_URL`: Utilizada por `restore.sh` como destino por defecto (puede ser tu base de datos local en Docker).

Ejemplo:
```env
# Conexión directa a Supabase (Producción)
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Conexión Local (Docker)
DATABASE_URL=postgresql://postgres:1234567@localhost:5432/field_orders?schema=public
```

## Uso

### 1. Realizar un Backup (Producción)

Para generar un respaldo de la base de datos configurada en `DIRECT_URL`:

```bash
chmod +x scripts/database/backup.sh
./scripts/database/backup.sh
```

Esto generará un archivo `backup_YYYYMMDD_HHMMSS.sql` dentro de la carpeta `./scripts/database/backups/`. También puedes especificar un nombre o ruta personalizada:

```bash
./scripts/database/backup.sh ./mi_carpeta/mi_respaldo.sql
```

### 2. Restaurar un Backup (Local o Prod)

Para restaurar un archivo en la base de datos configurada en `DATABASE_URL`:

```bash
chmod +x scripts/database/restore.sh
./scripts/database/restore.sh backup_20260428_120000.sql
```

Si deseas restaurar en una base de datos específica sin cambiar el `.env`:

```bash
./scripts/database/restore.sh backup.sql "postgresql://user:pass@localhost:5432/dbname"
```

> [!CAUTION]
> El script de restauración incluye una bandera `--clean` en el dump que eliminará las tablas existentes antes de recrearlas. Use con precaución en entornos productivos.

## Qué se incluye en el Backup

- Tablas de datos.
- Esquema `public` completo.
- **Store Procedures** y **Triggers**.
- Tabla de migraciones de Prisma (`_prisma_migrations`).
- Definición de tipos enumerados y extensiones (dentro de `public`).

No se incluyen archivos físicos de Supabase Storage ni esquemas internos de Supabase (`auth`, `storage`, `realtime`).
