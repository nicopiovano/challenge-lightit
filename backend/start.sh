#!/bin/sh
set -e

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Generar APP_KEY si no existe.
if [ -z "${APP_KEY}" ]; then
  php artisan key:generate --force --no-interaction
fi

php artisan storage:link || true

# `depends_on` no espera a que Postgres esté listo.
attempt=0
until php artisan migrate --force --no-interaction; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 15 ]; then
    echo "No se pudo ejecutar migraciones contra Postgres."
    exit 1
  fi
  echo "Esperando Postgres... ($attempt/15)"
  sleep 2
done

php -d upload_max_filesize=10M -d post_max_size=12M artisan serve --host=0.0.0.0 --port="${PORT:-8000}" --no-reload

