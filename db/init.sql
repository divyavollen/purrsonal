CREATE DATABASE purrsonal;
CREATE USER purrsonal_user WITH PASSWORD '${PURRSONAL_PASSWORD}';
GRANT ALL ON DATABASE purrsonal to purrsonal_user;