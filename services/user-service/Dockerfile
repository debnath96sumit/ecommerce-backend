FROM node:18

WORKDIR /app

RUN npm i -g nodemon

RUN npm install -g ts-node-dev

COPY package*.json ./

RUN npm install

EXPOSE 4001

CMD ["npm", "run", "dev"]