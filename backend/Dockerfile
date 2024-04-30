FROM node:20

RUN apt-get update && apt-get install -y protobuf-compiler

COPY types /types

WORKDIR /web

COPY web/package*.json ./

RUN npm install

COPY web/. .

RUN npm run build

COPY proto /proto

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend/. .

RUN npm run proto:generate

RUN npm run build

CMD [ "npm", "run", "start" ]