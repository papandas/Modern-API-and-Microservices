FROM node:11-alpine

COPY ./ /app/
#COPY ../protos/greet.proto /app/protos/

WORKDIR /app

RUN npm install

CMD ["node", "client.js"]