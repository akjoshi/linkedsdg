--- un-sdgs-content-linking ---

How to build aplication.

Open terminal and go to the root folder. (here)

You need to have npm installed, then run command :

npm run-script build

After a while the buildd folder will be created/updated.

Create zip with build folder then upload it to the dropbox.

Make shareable link and open google cloud console and login to any admin account.

Then run commands in this order:

cd /var/www/su-sdg

sudo rm -r build 

sudo wget /* dropbox link */

unzip the file 
sudo unzip build.zip... 

remove zip file.

DONE


----------------

To store new responses run command 

node storeExamples.js 

in the root folder 

All examples are stored in json file "./src/pages/upload/exampleArticles.json"