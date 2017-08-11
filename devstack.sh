#!/usr/bin/env sh

docker build -t albert-prime/odinapi:source-latest .

# Create LDAP volumns
docker volume create --name odin-ldap-db
docker volume create --name odin-ldap-config

# Start the LDAP docker container
docker run \
  -itd \
  --rm \
  -e LDAP_ORGANISATION="AlbertPrime" \
  -e LDAP_DOMAIN="albertprime.co.za" \
  -e LDAP_ADMIN_PASSWORD="deadjosh" \
  --name odin-api-ldap \
  -v odin-ldap-db:/var/lib/ldap \
  -v odin-ldap-config:/etc/ldap/slapd.d \
  -p 389:389 \
  osixia/openldap:1.1.8

# Start the Mongo container on  localhost:27017
docker run \
  -itd \
  --rm \
  --name odin-api-db \
  -p 27017:27017 \
  library/mongo:3.0.14 --smallfiles

# Start the Express app on localhost:3000
docker run \
  -it \
  --rm \
  -e "NODE_ENV=source" \
  -e "DEBUG=odin-api*" \
  --link odin-api-db \
  --link odin-api-ldap \
  --name odin-api \
  -v /home/node/odin-api/node_modules \
  -v $(pwd):/home/node/odin-api \
  -p 3000:3000 \
  albert-prime/odinapi:source-latest