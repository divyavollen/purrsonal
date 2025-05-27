#!/bin/bash

docker buildx build -t occupantangler/purrsonal_db:latest -f ./db/Dockerfile .
