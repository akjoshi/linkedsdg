FROM nginx:alpine
ENV BUILD_DEPS="gettext"  \
    RUNTIME_DEPS="libintl"
RUN set -x && \
    apk add --update $RUNTIME_DEPS && \
    apk add --virtual build_deps $BUILD_DEPS &&  \
    cp /usr/bin/envsubst /usr/local/bin/envsubst && \
apk del build_deps

#COPY nginx.conf /etc/nginx/
#COPY nginx.template /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/conf.d/

#ARG NGINX_PORT

#RUN envsubst '$NGINX_PORT' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/nginx.conf

