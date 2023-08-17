FROM node:18.16.0-alpine3.17 AS builder

WORKDIR /app

COPY package.json /app/

RUN npm i --legacy-peer-deps

COPY . .

CMD ["npm", "run", "prod"]

