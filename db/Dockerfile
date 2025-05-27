FROM ubuntu:latest

RUN apt-get update && apt-get install -y postgresql-client

COPY init.sh /app/init.sh

RUN chmod +x /app/init.sh

ENTRYPOINT ["/bin/sh", "/app/init.sh"]
