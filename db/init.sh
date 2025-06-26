#!/bin/bash

set -e

export PGPASSWORD="$POSTGRES_PASSWORD"

# Wait for PostgreSQL to be ready
until pg_isready -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready!"

# Check if database exists
if ! psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_database WHERE datname = '$PURRSONAL_DB'" | grep -q 1; then
  echo "Creating database '$PURRSONAL_DB'..."
  psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE \"$PURRSONAL_DB\""
else
  echo "Database '$PURRSONAL_DB' already exists."
fi

# Check if user exists
if ! psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$PURRSONAL_USER'" | grep -q 1; then
  echo "Creating user '$PURRSONAL_USER'..."
  psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    -c "CREATE USER \"$PURRSONAL_USER\" WITH PASSWORD '$PURRSONAL_PASSWORD';"
  psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    -c "GRANT ALL PRIVILEGES ON DATABASE \"$PURRSONAL_DB\" TO \"$PURRSONAL_USER\";"
else
  echo "User '$PURRSONAL_USER' already exists."
fi

echo "Initialization complete."
