#!/bin/bash

set -e

export PGPASSWORD="$POSTGRES_PASSWORD"

# Wait until PostgreSQL is ready
until pg_isready -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready!"

# Create the database if it doesn't exist (connect to $POSTGRES_DB, e.g., postgres)
psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc \
  "SELECT 1 FROM pg_database WHERE datname = '$PURRSONAL_DB'" | grep -q 1 || \
  psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    -c "CREATE DATABASE \"$PURRSONAL_DB\";"

# Create the user if it doesn't exist (connect to $POSTGRES_DB, usually postgres)
psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "DO \$\$ 
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$PURRSONAL_USER') THEN
          CREATE USER \"$PURRSONAL_USER\" WITH PASSWORD '$PURRSONAL_PASSWORD';
        END IF;
      END
      \$\$;"

# Grant privileges on the target database to the user
psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "GRANT ALL PRIVILEGES ON DATABASE \"$PURRSONAL_DB\" TO \"$PURRSONAL_USER\";"

# **Grant privileges on the public schema inside the target database**
psql -h "$TARGET_CONTAINER" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$PURRSONAL_DB" \
  -c "GRANT ALL PRIVILEGES ON SCHEMA public TO \"$PURRSONAL_USER\";"

echo "Database "$PURRSONAL_DB" and user "$PURRSONAL_USER" created."
