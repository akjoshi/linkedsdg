const fs = require('fs');
const rimraf = require("rimraf");
const pathUrls = './src/pages/Upload/exampleArticles.json';
const config = require('./src/config.json');
//import config from './src/config.js';
const pathToExamples = './src/pages/Upload/examples';
const axios = require('axios');
const examples = require(pathUrls);
var colors = require('colors');

async function process() {
    if (fs.existsSync(pathToExamples)) {
        rimraf.sync(pathToExamples);
        fs.mkdirSync(pathToExamples);
    }

    if (examples !== undefined) {
        let itemsProcessed = 0;
        await examples.forEach(async obj => {
            let dir = obj.id;
            let directory = pathToExamples + "/" + dir;
            fs.mkdirSync(directory);

            let json = { spacy: "", query: "" };

            try {
                const resp = await axios.post(config.textLinkApiUrl, obj.url, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (resp.status !== 200 && resp.status !== 201) {
                    throw new Error('Failed!');
                }

                let data = resp.data;

                const jsonText = await axios.post(config.spacyApiUrl, {
                    text: data.text,
                    lang: data.lang,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (jsonText.status !== 200 && jsonText.status !== 201) {
                    throw new Error('Failed!');
                }

                console.log(`Got spacy for ${obj.label}`)
                json.spacy = jsonText.data; // got spacy

                // data for graphQueryApiUrl
                const match = jsonText['data']['concepts'].map(function (x) {
                    return {
                        "uri": x['uri'],
                        "weight": x.weight
                    }
                });

                const linkedDataResponse = await axios.post(config.graphQueryApiUrl, match, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (linkedDataResponse.status !== 200 && linkedDataResponse.status !== 201) {
                    throw new Error('Failed!');
                }

                console.log(`Got query for ${obj.label}`)
                json.query = linkedDataResponse.data; // got spacy


                let stringJson = JSON.stringify(json);

                fs.writeFile(directory + '/data.json', stringJson, 'utf8', () => {
                    itemsProcessed = itemsProcessed + 1;
                    console.log(`Example nr ${obj.id} is ready !\t${itemsProcessed} / ${examples.length}\n`);
                    if (itemsProcessed === examples.length) {
                        console.log(colors.bgGreen(`\nAll examples are ready ! 🚀\n`));
                    }
                });
            } catch (error) {
                console.log( colors.red(`Something went wrong with ${obj.url}`))
                // console.log(error)
            }

        })
    }
}

process(); 