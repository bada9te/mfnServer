FROM node:18

WORKDIR /musicfromnothing-server

COPY package*.json .

RUN npm install

COPY . ./

EXPOSE 8000

CMD ["npm", "start"]