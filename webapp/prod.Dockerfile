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
RUN yarn build

FROM nginx:1.17.3
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]

