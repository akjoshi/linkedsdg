FROM node:12.10.0 as build-stage

WORKDIR /app
COPY package*.json /app/
RUN yarn
COPY ./ /app/
RUN yarn build

FROM nginx:1.17.3
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

