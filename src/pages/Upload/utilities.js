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

    export async function handleUploadFile (file){
        console.log(file);
        if(file === undefined){
            this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            this.setState({waitForData: true});
        }
        this.setState({ isLoading: true, error: '' , loadedFrom: file.name, fileName: file.name });
        const data = new FormData();
        data.append('file', file);

        try {
            const json = await axios.post('http://127.0.0.1:5001/api', data, {

                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (json.status !== 200 && json.status !== 201) {
                throw new Error('Failed!');
            }
            console.log("TEKST Z PLIKU")
            console.log(json.data.text)
            this.processText(json.data.text);
        } catch (error) {
            this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            this.setState({waitForData: true});
        }

    }

    export async function handleUrlFile(url) {
        this.setState({ isLoading: true, error: '', loadedFrom: url  });
        try {
            const json = await axios.post('http://127.0.0.1:5001/apiURL', url, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (json.status !== 200 && json.status !== 201) {
                throw new Error('Failed!');
            }
            console.log("TEKST Z URL")
            console.log(json.data.text)
            this.processText(json.data.text);
        } catch (error) {
            this.setState({ contentLoaded: false, isLoading: false, error: "There was a problem with the URL, please try again!" });
            this.setState({waitForData: true});
        }
    }

    export async function processText(text) {
        try {
            
            const jsonText = await axios.post('http://127.0.0.1:5000/api', {
                text: text,
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

            const linkedDataResponse = await axios.post('http://127.0.0.1:5002/api', match , {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (linkedDataResponse.status !== 200 && linkedDataResponse.status !== 201) {
                throw new Error('Failed!');
            }

            console.log("linkedDataResponse")
            console.log(linkedDataResponse)
            await this.setState({dataForSun: linkedDataResponse.data});


            await this.setState({  contentLoaded: true, isLoading: false, waitForData: false });
            window.location.href = '#Data-Area-id';

        } catch (error) {
            this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            this.setState({waitForData: true});
        }


    }
