# SDG Vocabularies project

This project was created by Epistemik for the United Nations Statistics Division and stitched together using Docker and Docker-Compose.

https://github.com/epistemik-co/sdg-links-webapp

https://github.com/epistemik-co/sdg-links-graph-query-api

https://github.com/epistemik-co/sdg-links-concept-extraction-api

https://github.com/epistemik-co/sdg-links-text-extraction-api

## Getting up and running

To start the demo, copy .env.example to .env, and then set the parameters therein to the appropriate values. Then:

`docker-compose up`

Add the `-d` flag to run in the background as a daemon.

To generate kubernetes deployment and service files, use the following command:

`docker-compose config > docker-compose-resolved.yaml && kompose convert -f docker-compose-resolved.yaml`

To deploy this directly into production on your own kubernetes cluster, use the following command (assumes the namespace of sdgontologies):

`kompose up -f docker-compose.yml -f docker-compose-prod.yml --namespace sdgontologies`

Note that some of the services can take up to 10 minutes to run.
