FROM node:21
WORKDIR /usr/src/app
COPY oid4vc/TangleLabs/package*.json ./
RUN npm ci
COPY oid4vc/TangleLabs/. ./
RUN npm run postinstall
CMD "npm" "start"