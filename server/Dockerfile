FROM node:11-alpine

COPY ./ /app/
#COPY ../protos/greet.proto /app/protos/

WORKDIR /app

RUN npm install
RUN npm install grpc-tools

CMD ["node", "index.js"]