FROM node:12.10.0-alpine as build-stage
 
WORKDIR /app
COPY package*.json /app/
COPY package-lock.json /app/
RUN yarn install --network-timeout 1000000
COPY ./ /app/
 
EXPOSE 5003
CMD ["node", "index.js"]

