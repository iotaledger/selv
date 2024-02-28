FROM node
WORKDIR /usr/src/app
COPY oid4vc/TangleLabs/package*.json ./
RUN npm ci
COPY oid4vc/TangleLabs/. ./
CMD "npm" "start"