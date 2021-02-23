FROM openjdk:8-jdk
COPY apache-jena-fuseki-3.13.1.zip /tmp/apache-jena-fuseki-3.13.1.zip

WORKDIR /tmp
RUN unzip apache-jena-fuseki-3.13.1.zip

WORKDIR /tmp/apache-jena-fuseki-3.13.1

COPY shiro.ini /tmp/apache-jena-fuseki-3.13.1/run/shiro.ini
COPY entrypoint.sh /tmp/entrypoint.sh

RUN chmod +x fuseki-server
EXPOSE 3030

# ENTRYPOINT ["./fuseki-server"]
ENTRYPOINT ["bash", "/tmp/entrypoint.sh"]
