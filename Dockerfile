FROM node;18.19
WORKDIR /app
COPY . /app/
RUN npm i
EXPOSE 8000
CMD [ "node", "./src/server.js" ]
