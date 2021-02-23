FROM node:12.10.0-alpine as build-stage

ENV BUILD_DEPS="gettext"  \
    RUNTIME_DEPS="libintl"
RUN set -x && \
    apk add --update $RUNTIME_DEPS && \
    apk add --virtual build_deps $BUILD_DEPS &&  \
    cp /usr/bin/envsubst /usr/local/bin/envsubst && \
apk del build_deps

WORKDIR /app
COPY package*.json /app/
COPY package-lock.json /app/
RUN yarn install --network-timeout 1000000
COPY ./ /app/

ARG NGINX_HOST

RUN envsubst '$NGINX_HOST' < /app/src/config.template > /app/src/config.json
RUN envsubst '$NGINX_HOST' < /app/src/pages/Api/swagger.template > /app/src/pages/Api/swagger.json
RUN envsubst '$NGINX_HOST' < /app/src/pages/Api/swaggerStat.template > /app/src/pages/Api/swaggerStat.json

#RUN cat /app/src/config.js

RUN yarn build

FROM nginx:1.17.3
ADD start.sh /app/
RUN chmod +x /app/start.sh

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 81

CMD ["/app/start.sh"]

