#!/bin/bash

set -e

export PGPASSWORD="$POSTGRES_PASSWORD"

until pg_isready -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready!"

psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "DO \$\$ BEGIN \
        -- Check if the database exists, if not create it
        IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '$PURRSONAL_DB') THEN \
          EXECUTE 'CREATE DATABASE \"$PURRSONAL_DB\"'; \
        END IF; \
        
        -- Check if the user exists, if not create it and grant priviliges
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$PURRSONAL_USER') THEN \
          CREATE USER \"$PURRSONAL_USER\" WITH PASSWORD '$PURRSONAL_PASSWORD'; \
          GRANT ALL PRIVILEGES ON DATABASE \"$PURRSONAL_DB\" TO \"$PURRSONAL_USER\"; \
        END IF; \        
      END \$\$;"

echo "Database '$PURRSONAL_DB' and user '$PURRSONAL_USER' created."