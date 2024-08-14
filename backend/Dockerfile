FROM node:20

RUN apt-get update && apt-get install -y protobuf-compiler

COPY shared /shared

ARG REACT_APP_ISSUERS_GOVERNMENT_DID
ENV REACT_APP_ISSUERS_GOVERNMENT_DID=$REACT_APP_ISSUERS_GOVERNMENT_DID

ARG REACT_APP_ISSUERS_COMPANY_HOUSE_DID
ENV REACT_APP_ISSUERS_COMPANY_HOUSE_DID=$REACT_APP_ISSUERS_COMPANY_HOUSE_DID

WORKDIR /web

COPY web/package*.json ./

RUN npm install

COPY web/. .

RUN npm run build

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend/. .

RUN npm run proto:generate

RUN npm run build

CMD [ "npm", "run", "start" ]