FROM node:18

WORKDIR /musicfromnothing-server

COPY package*.json .

RUN npm install
RUN node /src/utils/rsa/createKeypair.js

COPY . ./

EXPOSE 8000

CMD ["npm", "start"]