FROM node:20

RUN apt-get update && apt-get install -y protobuf-compiler

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend/. .

COPY proto /proto
COPY types /types

RUN npm run proto:generate

RUN npm run build

CMD [ "npm", "run", "start" ]