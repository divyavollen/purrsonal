#!/bin/bash

docker compose --env-file ./env/dev.env -f docker-compose.dev.yml up
