#!/bin/bash
set -x
exec /tmp/apache-jena-fuseki-3.13.1/fuseki-server &
echo "Sleeping..."
until $(curl --output /dev/null --silent --head --fail http://localhost:3030/index.html); do
    printf '.'
    sleep 5
done
echo "Starting upload..."
curl -F file=@/tmp/apache-jena-fuseki-3.13.1/bin/sdgs-data.nq http://localhost:3030/sdgs/data
curl -F file=@/tmp/apache-jena-fuseki-3.13.1/bin/stats.nq http://localhost:3030/stats/data
echo "I succeed!!!"
tail -f /dev/null