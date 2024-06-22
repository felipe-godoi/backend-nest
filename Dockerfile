FROM node:20.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .

EXPOSE 3000

CMD ["/bin/sh", "-c", "npm run migration:run; npm run seed; npm run start:dev" ]