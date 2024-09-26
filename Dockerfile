FROM node:lts-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install 

COPY . ./

CMD ["npm" ,"start"]

EXPOSE 8080