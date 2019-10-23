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

## To deploy to linkedsdg.apps.officialstatistics.org

Once you are satisfied with your changes, you will need to do the following:

0. Modify all tags in docker-compose.yml, docker-compose-test.yml, and docker-compose-prod.yml. These must be incremented each time a new version is deployed. At the time this was written, then version was v0.4. So the tags would look like this: 

```
version: '3.1'
services: 
  proxy: 
    image: 'containers.officialstatistics.org/cslovell/sdg-docker-ontologies/proxy:v0.4'
```

1. Login to containers.officialstatistics.org using your credentials: `docker login containers.officialstatistics.org -u [username] -p [your-token-from-gitlab]`

2. Build the test containers: `docker-compose -f docker-compose.yml -f docker-compose-test.yml build`

3. Push them to the registry: `docker-compose -f docker-compose.yml -f docker-compose-test.yml push`

4. Create the following folder `.k8s\[version]\test`and generate the proper deployment files for the test containers: `kompose convert -f docker-compose.yml -f docker-compose-test.yml -o .k8s\[version]\test`

5. Ensure you are configured to push to the proper test namespace: (sdgontologies-test)

6. Push the new configuration to the test namespace: `kubectl apply -f ./.k8s/test`

7. Test the application to see it works. If there are any issues, make the needed changes and start from 2.

8. Build the production containers: `docker-compose -f docker-compose.yml -f docker-compose-prod.yml build`

9. Push them to the registry: `docker-compose -f docker-compose.yml -f docker-compose-prod.yml push`

10. Create the following folder `.k8s\[version]` and generate the proper deployment files for the production containers: `kompose convert -f docker-compose.yml -f docker-compose-prod.yml -o .k8s\[version]`

11. Ensure you are configured to push to the proper production cluster namespace: (sdgontologies)

12. Push the new configuration to the production namespace: `kubectl apply -f ./.k8s/[version]`

13. Test the application. There should be no issues, except in rare occasions.

14. If you need to rollback to a previous version, simply run `kubectl apply -f ./.k8s/[version]`, where `[version]` is the version that previously was deployed. 

**Never delete deployment versions from the .k8s folder**