# Purrsonal - Pet tracker
A practice project to explore full-stack development with modern tools.
This app demonstrates how to build and containerize a Spring Boot backend and ReactJS frontend for managing pet information.

# Tech Stack
Backend: Spring Boot (REST APIs)
Frontend: ReactJS (Vite + Vanilla JS)
Database: PostgreSQL
Build & Automation: Makefile (local commands)
Containerization: Docker (Dockerfile, Docker Compose, volumes)

# Features
Create and manage pet records.
REST APIs for CRUD operations
ReactJS frontend consuming APIs
Dockerized backend + database setup with persistent volumes
Local automation with Makefile for build/run tasks

# First-time setup of dev tools
Use the Ansible Dev Setup Repo: https://github.com/divyavollen/dotfiles

# Running Locally with Docker Compose
## Build and start services
`make up`

## Stop Containers
`make down`
