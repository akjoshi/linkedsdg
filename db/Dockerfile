  
FROM openjdk:8-jdk
COPY apache-jena-fuseki-3.13.1.zip /tmp/apache-jena-fuseki-3.13.1.zip

WORKDIR /tmp
RUN unzip apache-jena-fuseki-3.13.1.zip

WORKDIR /tmp/apache-jena-fuseki-3.13.1

COPY shiro.ini /tmp/apache-jena-fuseki-3.13.1/run/shiro.ini

RUN chmod +x fuseki-server

RUN ./bin/s-put http://localhost:3030/sdgs default ./bin/sdgs-data.nq

ENTRYPOINT ["./fuseki-server"]

EXPOSE 3030