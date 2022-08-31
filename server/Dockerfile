FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock .
RUN npm install
COPY . .

RUN npm run build
COPY .env ./dist/

EXPOSE 5000

CMD node dist/index.js