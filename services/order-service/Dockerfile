FROM node:18-alpine

WORKDIR /app

RUN npm i -g nodemon

RUN npm install -g ts-node-dev

COPY package*.json ./

RUN npm install

EXPOSE 4004

CMD ["npm", "run", "dev"]