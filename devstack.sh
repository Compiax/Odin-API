#!/usr/bin/env sh

docker build -t albert-prime/odinapi:source-latest .

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
  --name odin-api \
  -v /home/node/odin-api/node_modules \
  -v $(pwd):/home/node/odin-api \
  -p 3000:3000 \
  -p 8000:8000 \
  albert-prime/odinapi:source-latest