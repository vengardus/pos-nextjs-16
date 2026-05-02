#!/bin/bash

# Script de Restauración para PostgreSQL / Supabase
# Uso: ./scripts/database/restore.sh <backup_file.sql> [target_db_url]

BACKUP_FILE=$1
TARGET_URL=$2

# Cargar variables de entorno desde .env si existe
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Si no se provee target_db_url, usar DATABASE_URL del .env
TARGET_URL=${TARGET_URL:-$DATABASE_URL}

# Limpiar parámetros de consulta no soportados (ej. timezone, interactive_timeout)
TARGET_URL=$(echo "$TARGET_URL" | sed 's/?.*//')

if [ -z "$BACKUP_FILE" ]; then
  echo "Error: Debe especificar el archivo de backup."
  echo "Uso: ./scripts/database/restore.sh <backup_file.sql> [target_db_url]"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: El archivo $BACKUP_FILE no existe."
  exit 1
fi

if [ -z "$TARGET_URL" ]; then
  echo "Error: No se definió la URL de destino (DATABASE_URL)."
  exit 1
fi

echo "--- Iniciando restauración de la base de datos ---"
echo "Archivo: $BACKUP_FILE"

# Confirmación antes de proceder
read -p "¿Está seguro de que desea sobreescribir la base de datos de destino? (s/n): " confirm
if [[ $confirm != "s" && $confirm != "S" ]]; then
  echo "Restauración cancelada."
  exit 0
fi

# Verificar si usamos Docker o local
LOCAL_PSQL_VERSION=$(psql --version 2>/dev/null | grep -oE '[0-9]+' | head -n1)
USE_DOCKER=false

if [ -z "$LOCAL_PSQL_VERSION" ] || [ "$LOCAL_PSQL_VERSION" -lt 17 ]; then
  if command -v docker >/dev/null 2>&1; then
    echo "Aviso: psql local ($LOCAL_PSQL_VERSION) es antiguo o no existe. Usando Docker (postgres:17) para la restauración..."
    USE_DOCKER=true
  else
    echo "Error: Se requiere psql v17+ o Docker para una restauración compatible."
    exit 1
  fi
fi

if [ "$USE_DOCKER" = true ]; then
  # Ejecutar via Docker
  # --network="host" permite que el contenedor alcance "localhost" si la DB es local
  # Pasamos el archivo por stdin para evitar problemas de montajes de volúmenes
  cat "$BACKUP_FILE" | docker run --rm -i --network="host" postgres:17-alpine psql "$TARGET_URL"
else
  # Ejecutar localmente
  psql "$TARGET_URL" -f "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
  echo "--- Restauración completada exitosamente ---"
else
  echo "Error: Falló la restauración. Verifique los logs arriba."
  exit 1
fi
