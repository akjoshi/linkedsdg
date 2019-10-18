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

Once you are satisfied with your changes, you will need to do the following:

1. Login to containers.officialstatistics.org using your credentials: `docker login containers.officialstatistics.org -u [username] -p [your-token-from-gitlab]`

2. Build the test containers: `docker-compose -f docker-compose.yml -f docker-compose-test.yml build`

3. Push them to the registry: `docker-compose -f docker-compose.yml -f docker-compose-test.yml push`

4. Generate the proper deployment files for the test containers: `kompose convert -f docker-compose.yml -f docker-compose-test.yml -o .k8s\test`

5. Ensure you are configured to push to the proper test cluster namespace: (sdgontologies-test)

6. Push the new configuration to the test namespace: `kubectl apply -f ./.k8s/test`

7. Test the application to see it works. If there are any issues, make the needed changes and start from 2.

8. Build the production containers: `docker-compose -f docker-compose.yml -f docker-compose-prod.yml build`

9. Push them to the registry: `docker-compose -f docker-compose.yml -f docker-compose-prod.yml push`

10. Generate the proper deployment files for the production containers: `kompose convert -f docker-compose.yml -f docker-compose-prod.yml -o .k8s\prod`

11. Ensure you are configured to push to the proper production cluster namespace: (sdgontologies)

12. Push the new configuration to the production namespace: `kubectl apply -f ./.k8s/prod`

13. Test the application. There should be no issues, except in rare occasions.

To generate kubernetes deployment and service files, use the following command:

`kompose convert -f docker-compose.yml -f docker-compose-prod.yml -o .k8s`

To deploy this directly into production on your own kubernetes cluster, use the following command (assumes the namespace of sdgontologies):

`kubectl apply -f ./.k8s`

To delete everything:

`kubectl delete deployment.apps/concepts deployment.apps/graph deployment.apps/graphdb deployment.apps/proxy deployment.apps/text deployment.apps/webapp service/proxy service/concepts service/graph service/graphdb service/text service/webapp`

Note that some of the services can take up to 10 minutes to run.
