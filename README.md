# SDG-Links webapp
A prototype app for linking unstructured data with relevant SDG entities via subject concepts from dedicated taxonomies

![AppImage](https://raw.githubusercontent.com/epistemik-co/sdg-links-webapp/master/src/pages/Home/rdiDvaws2.png)

### Running the app

> yarn start

### Building cache

The webapp uses cached data for several examples presented to the user. That cache data has to be initially created using an accompanying script. Once all related APIs are running and available you need to execute the following command in the root folder:

> node storeExamples.js 

The cache data is generated and stored in the folder `./src/pages/upload/examples` which subsequently has to be copied into the text extraction api root folder.
