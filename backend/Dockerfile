FROM node:20

RUN apt-get update && apt-get install -y protobuf-compiler

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/. .

COPY proto /proto

RUN npm run proto:generate

RUN npm run build

CMD [ "npm", "run", "start" ]