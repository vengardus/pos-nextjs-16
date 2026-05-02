#!/bin/bash

# Script de Backup para PostgreSQL / Supabase
# Uso: ./scripts/database/backup.sh [output_file]

# Cargar variables de entorno desde .env si existe
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Priorizar DIRECT_URL si existe, de lo contrario usar DATABASE_URL
DB_URL=${DIRECT_URL:-$DATABASE_URL}

# Limpiar parámetros de consulta no soportados por pg_dump (ej. timezone, interactive_timeout)
# Prisma los usa pero libpq (pg_dump/psql) puede fallar con ellos.
DB_URL=$(echo "$DB_URL" | sed 's/?.*//')

if [ -z "$DB_URL" ]; then
  echo "Error: No se encontró DATABASE_URL o DIRECT_URL en el archivo .env"
  exit 1
fi

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./scripts/database/backups"
mkdir -p "$BACKUP_DIR"

if [ -z "$1" ]; then
  OUTPUT_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
else
  # Si el usuario provee un nombre, lo usamos (podría ser una ruta completa)
  OUTPUT_FILE=$1
fi

echo "--- Iniciando backup de la base de datos ---"
echo "Destino: $OUTPUT_FILE"

# Verificar versión de pg_dump local
LOCAL_PG_VERSION=$(pg_dump --version 2>/dev/null | grep -oE '[0-9]+' | head -n1)
USE_DOCKER=false

if [ -z "$LOCAL_PG_VERSION" ] || [ "$LOCAL_PG_VERSION" -lt 17 ]; then
  if command -v docker >/dev/null 2>&1; then
    echo "Aviso: pg_dump local ($LOCAL_PG_VERSION) es antiguo o no existe. Usando Docker (postgres:17) para el backup..."
    USE_DOCKER=true
  else
    echo "Error: Se requiere pg_dump v17+ para Supabase. Instálelo o instale Docker."
    exit 1
  fi
fi

if [ "$USE_DOCKER" = true ]; then
  # Ejecutar via Docker
  # Nota: Redireccionamos la salida estándar al archivo para evitar problemas de TTY
  docker run --rm postgres:17-alpine pg_dump "$DB_URL" \
    --schema=public \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --format=plain > "$OUTPUT_FILE"
else
  # Ejecutar localmente
  pg_dump "$DB_URL" \
    --schema=public \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --format=plain \
    --file="$OUTPUT_FILE"
fi

if [ $? -eq 0 ]; then
  echo "--- Backup completado exitosamente ---"
  echo "Archivo generado: $OUTPUT_FILE"
  
  # Opcional: Comprimir el archivo
  # gzip "$OUTPUT_FILE"
  # echo "Archivo comprimido: ${OUTPUT_FILE}.gz"
else
  echo "Error: Falló la generación del backup."
  exit 1
fi
