import axios from 'axios';

    function findContext(data, key) {
        var filtered = data.filter(x => { return x['url'] === key });
        return filtered
    }

    function calculateWeight(data) {
        let sum = 0;
        for (var key in data) {
            sum += data[key].weight
        }
        return sum;
    }

    function linkConcepts(newConcepts, oldConcepts) {
        for (var key in newConcepts) {
            // eslint-disable-next-line no-loop-func
            const importantConcepts = oldConcepts.filter(x => (x.id === key));
            newConcepts[key] = {...newConcepts[key],linkedConcept: importantConcepts}; 
        }

        return newConcepts;
    }

    export async function handleUploadFile (event, context){
        this.setState({ isLoading: true, error: '' , loadedFrom: event.target.files[0].name });
        const data = new FormData();
        console.log()
        data.append('file', event.target.files[0]);

        try {
            const text = await axios.post('http://127.0.0.1:5000/api', data, {

                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (text.status !== 200 && text.status !== 201) {
                throw new Error('Failed!');
            }
            // console.log("TEKST Z PLIKU")
            // console.log(text)
            this.processText(text, context);
        } catch (error) {
            this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            context.waitForData = true;
        }

    }

    export async function handleUrlFile(url, context) {
        this.setState({ isLoading: true, error: '', loadedFrom: url  });
        try {
            const text = await axios.post('http://127.0.0.1:5000/apiURL', url, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (text.status !== 200 && text.status !== 201) {
                throw new Error('Failed!');
            }
            // console.log("TEKST Z URL")
            // console.log(text)
            this.processText(text, context);
        } catch (error) {
            this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            context.waitForData = true;
        }
    }

    export async function processText(text, context) {
        try {
            const jsonText = await axios.post('http://35.231.89.123:5000/api', {
                text: text.data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (jsonText.status !== 200 && jsonText.status !== 201) {
                throw new Error('Failed!');
            }
            console.log('Json z spacy')
            console.log(jsonText)

            this.setState({ plainText: jsonText['data']['clean_text'] })
            const conceptsResponse = [];

            
            for (var key in jsonText['data']['concepts']) {
                let context = findContext(jsonText['data']['matches'], key)
                conceptsResponse.push({
                    id: key,
                    label: jsonText['data']['concepts'][key]['label'],
                    source: jsonText['data']['concepts'][key]['source'],
                    weight: jsonText['data']['concepts'][key]['weight'],
                    context: context
                })
            }
            

            conceptsResponse.sort((x, y) => y.weight - x.weight);

            // console.log("conceptsResponse")
            // console.log(conceptsResponse)

            this.setState({ concepts: conceptsResponse })


            const match = jsonText['data']['matches'].map(function (x) {
                return {
                    "url": x['url'],
                    "weight": 1
                }
            });

            const linkedDataResponse = await axios.post('http://35.231.89.123:5002/api', match , {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (linkedDataResponse.status !== 200 && linkedDataResponse.status !== 201) {
                throw new Error('Failed!');
            }

            const linkedConcepts = [];

            // console.log("linkedDataResponse")
            // console.log(linkedDataResponse)

            for (var url in linkedDataResponse['data']) {
                const newConcepts = linkConcepts(linkedDataResponse['data'][url]['concept'], conceptsResponse)
                linkedConcepts.push({
                    id: url,
                    type: linkedDataResponse['data'][url]['type'],
                    label: linkedDataResponse['data'][url]['label'],
                    concept: newConcepts,
                    sumWeight: calculateWeight(linkedDataResponse['data'][url]['concept'])
                })
            }

            // console.log("linkedConcepts")
            // console.log(linkedConcepts)

            linkedConcepts.sort((x, y) => y.sumWeight - x.sumWeight);

            this.setState({ linkedData: linkedConcepts, contentLoaded: true, isLoading: false });
            context.waitForData = false;
            console.log(context.waitForData)

        } catch (error) {
            this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            context.waitForData = true;
        }


    }
