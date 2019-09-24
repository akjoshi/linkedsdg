# SDG Vocabularies project

This project was created by Epistemik for the United Nations Statistics Division and stitched together using Docker and Docker-Compose.

https://github.com/epistemik-co/sdg-links-webapp

https://github.com/epistemik-co/sdg-links-graph-query-api

https://github.com/epistemik-co/sdg-links-concept-extraction-api

https://github.com/epistemik-co/sdg-links-text-extraction-api

## Getting up and running

To start:

First, you need to copy .env.example to .env, and make sure the parameters are correct.

Then:

`docker-compose up`

Add the `-d` flag to run in the background as a daemon.

Note that some of the services can take up to 10 minutes to run. 
