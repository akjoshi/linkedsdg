# SDG Vocabularies project

This project was created by Epistemik for the United Nations Statistics Division (UNSD) Web Development and Data Visualization Section, and stitched together by the UNSD Data Innovation Section using Docker: Docker-Compose for local development and testing, and Kubernetes for deployment.

Source projects (these have been merged into the repository history):

https://github.com/epistemik-co/sdg-links-webapp

https://github.com/epistemik-co/sdg-links-graph-query-api

https://github.com/epistemik-co/sdg-links-concept-extraction-api

https://github.com/epistemik-co/sdg-links-text-extraction-api

## Getting up and running

To start the demo, copy .env.example to .env, and then set the parameters therein to the appropriate values. Then:

`docker-compose up`

If you have run the containers in the past in your local environment and haven't run this command in a long time, you may need to run the build command with the `--no-cache` option, as in `docker-compose build --no-cache`. Otherwise commands that call `apt-get update` in Ubuntu containers will use cached versions and fail.

Add the `-d` flag to run in the background as a daemon.

## To deploy to linkedsdg.apps.officialstatistics.org

### New Instructions (as of Jan 24, 2020)

0. **Configure Test Deployment Settings.**  Open the .env file in the local directory and ensure the HOST, TAG, and PORT variables are set. These will be used throughout all parts of the application. The TAG number must be incremented by 1 for every deployment so that the tags are unique and do not override previous deployments. For the test deployment, add the suffix -test to the TAG variable. Ensure the HOST number is the IP address of the test system.

```
HOST=35.225.36.105
TAG=[version]-test
PORT=80
```

In the above, [version] would be something like `0.4.5.5-test`.

1. Login to containers.officialstatistics.org using your credentials: `docker login containers.officialstatistics.org -u [username] -p [your-token-from-gitlab]`

2. Build the test containers: `docker-compose build`. If you have not rebuilt these containers recently, you may want to consider running them with the `--no-cache` option at the end. Note that this optino will force the build to take a very long time, but it will rebuild everything from scratch.

3. Push them to the registry: `docker-compose push`.

4. Create the following folder `.k8s\[version]\test`and generate the proper deployment files for the test containers: First run the command `docker-compose config > docker-compose-resolved.yaml` and then run `kompose convert -f docker-compose-resolved.yaml -o .k8s\[version]\test`. After this is completed, you will need to modify all deployment files to contain the following node toleration:

```
      tolerations:
      - key: "purpose"
        operator: "Equal"
        value: "app"
        effect: "NoSchedule"
```

5. Ensure you are configured to push to the proper test namespace: (sdgontologies-test)

6. Push the new configuration to the test namespace: `kubectl apply -f ./.k8s/[version]/test`

7. Test the application to see it works. If there are any issues, make the needed changes and start from 2.

8. Go to the .env file again and configure the deployment parameters. 

```
HOST=linkedsdg.apps.officialstatistics.org
TAG=[version]-prod
PORT=80
```

9. Build the production containers: `docker-compose build`.

10. Push them to the registry: `docker-compose push`.

11. Create the following folder `.k8s\[version]`and generate the proper deployment files for the test containers: First run the command `docker-compose config > docker-compose-resolved.yaml` and then run `kompose convert -f docker-compose-resolved.yaml -o .k8s\[version]`. After this is completed, you will need to modify all deployment files to contain the following node toleration:

```
      tolerations:
      - key: "purpose"
        operator: "Equal"
        value: "app"
        effect: "NoSchedule"
```

12. Ensure you are configured to push to the proper production cluster namespace: (sdgontologies)

13. Deploy the application to Kubernetes: `kubectl apply -f ./.k8s/[version]`

14. Test the application. There should be no issues, except in rare occasions.

15. If you need to rollback to a previous version, simply run `kubectl apply -f ./.k8s/[version]`, where `[version]` is the version that previously was deployed.

16. Delete the test deployment as it consumes loads of memory and can lead to pods being evicted from the node: : `kubectl delete --all pods,daemonsets,replicasets,services,deployments,pods,rc --namespace=sdgontologies-test`.

### Old instructions

**Note: to deploy on a local kubernetes cluster, you need to find/replace `linkedsdg.apps.officialstatistics.org` with `localhost` in the webapp subfolder**

Once you are satisfied with your changes, you will need to do the following:

0. Modify all tags in docker-compose.yml, docker-compose-test.yml, and docker-compose-prod.yml. These must be incremented each time a new version is deployed. At the time this was written, then version was v0.4. So the tags would look like this: 

```
version: '3.1'
services: 
  proxy: 
    image: 'containers.officialstatistics.org/cslovell/sdg-docker-ontologies/proxy:v0.4'
```

1. Login to containers.officialstatistics.org using your credentials: `docker login containers.officialstatistics.org -u [username] -p [your-token-from-gitlab]`

2. Build the test containers: `docker-compose -f docker-compose.yml -f docker-compose-test.yml build`. If you have not rebuilt these containers recently, you may want to consider running them with the `--no-cache` option at the end. Note that this option will force the build to take a very long time, but it will rebuild everything from scratch.

3. Push them to the registry: `docker-compose -f docker-compose.yml -f docker-compose-test.yml push`

4. Create the following folder `.k8s\[version]\test`and generate the proper deployment files for the test containers: `kompose convert -f docker-compose.yml -f docker-compose-test.yml -o .k8s\[version]\test`. After this is completed, you will need to modify all deployment files to contain the following node toleration:

```
      tolerations:
      - key: "purpose"
        operator: "Equal"
        value: "app"
        effect: "NoSchedule"
```

For documentation on how to do this, go to: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/

5. Ensure you are configured to push to the proper test namespace: (sdgontologies-test)

6. Push the new configuration to the test namespace: `kubectl apply -f ./.k8s/[version]/test`

7. Test the application to see it works. If there are any issues, make the needed changes and start from 2.

8. Build the production containers: `docker-compose -f docker-compose.yml -f docker-compose-prod.yml build`

9. Push them to the registry: `docker-compose -f docker-compose.yml -f docker-compose-prod.yml push`

10. Create the following folder `.k8s\[version]` and generate the proper deployment files for the production containers: `kompose convert -f docker-compose.yml -f docker-compose-prod.yml -o .k8s\[version]`

11. Ensure you are configured to push to the proper production cluster namespace: (sdgontologies)

12. Push the new configuration to the production namespace: `kubectl apply -f ./.k8s/[version]`

13. Test the application. There should be no issues, except in rare occasions.

14. If you need to rollback to a previous version, simply run `kubectl apply -f ./.k8s/[version]`, where `[version]` is the version that previously was deployed.

15. Delete the test deployment as it consumes loads of memory and can lead to pods being evicted from the node: : `kubectl delete --all pods,daemonsets,replicasets,services,deployments,pods,rc --namespace=sdgontologies-test`.

**Never delete previous deployment versions from the .k8s folder**: Only copy the folder, give it a new names, change the version number, etc. 




