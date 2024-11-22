FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN yarn

ARG ENV_FILE=.env

COPY $ENV_FILE .env

COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start"]
