import React, { Component } from 'react';
import './Upload.scss'
import axios from 'axios';
import ConceptList from '../components/ConceptList/ConceptList';
import UploadComponent from '../components/UploadComponent/UploadComponent';
import Spinner from '../components/Spinner/Spinner';

class Upload extends Component {

    state = {
        plainText: '',
        concepts: [],
        linkedData: {},
        isLoading: false,
        contentLoaded: false,
        error: ''
    };

    findContext = (data, key) => {
        var filtered = data.filter(x => {  return x['url'] === key } );
        return filtered
    }

    handleUploadFile = async (event) => {
        this.setState({ isLoading: true, error: '' });
        const data = new FormData();
        data.append('file', event.target.files[0]);

        try {
            const text = await axios.post('http://127.0.0.1:5000/api', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            this.processText(text);
        } catch (error) {
            if (error.response.status !== 200 && error.response.status !== 201) {
                this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            }
        }

    }

    handleUrlFile = async (url) => {
        this.setState({ isLoading: true, error: '' });
        try {
            const text = await axios.post('http://127.0.0.1:5000/apiURL', url, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

             this.processText(text);
        } catch (error) {
            if (error.response.status !== 200 && error.response.status !== 201) {
                this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            }
        }

        
    }

    processText = async (text) => {
        try {
        const jsonText = await axios.post('http://127.0.0.1:5001/api', {
            text: text.data,
            headers: {
                'Content-Type': 'application/json'
            }
        });


        this.setState({ PlainText: jsonText['data']['clean_text'] })

        const concepts = [];


        for (var key in jsonText['data']['concepts']) {
            let context = this.findContext(jsonText['data']['matches'], key)
            concepts.push({
                id: key,
                label: jsonText['data']['concepts'][key]['label'],
                source: jsonText['data']['concepts'][key]['source'],
                weight: jsonText['data']['concepts'][key]['weight'],
                context: context
            })
        }

        concepts.sort((x,y) => y.weight- x.weight);

        this.setState({ Concepts: concepts })

        const match = jsonText['data']['matches'].map(function (x) {
            return {
                "url": x['url'],
                "weight": 1
            }
        });

        const linkedDataResponse = await axios.post('http://127.0.0.1:5002/api', match);


        const linkedConcepts = [];

        console.log(linkedDataResponse)

        for (var key in linkedDataResponse['data']) {
            linkedConcepts.push({
                id: key,
                type: linkedDataResponse['data'][key]['type'],
                label: linkedDataResponse['data'][key]['label'],
                concept: linkedDataResponse['data'][key]['concept']
            })
        }

        console.log(linkedConcepts)

        this.setState({ linkedData: linkedConcepts, contentLoaded: true, isLoading: false });

        } catch (error) {
            if (error.response.status !== 200 && error.response.status !== 201) {
                this.setState({ contentLoaded: false, isLoading: false, error: "Something went wrong try again!" });
            }
        }

        
    }


    render() {
        return (
            <div className="Upload">
                <span className="Title">Upload Files</span>
                <p className="Description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mi orci, bibendum id feugiat sit amet, laoreet viverra arcu. Maecenas pulvinar mauris vitae iaculis suscipit. Phasellus scelerisque orci nec sollicitudin fringilla. Donec eu luctus metus, dictum sollicitudin dui. Nullam sit amet metus justo. Ut auctor dignissim orci eu congue. 
                </p>
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                this.state.contentLoaded ? (
                    <div className="Data-Area">
                        <ConceptList Concepts={this.state.concepts}></ConceptList>

                        <h3 className="Title">Data from 3rd api</h3>
                        {this.state.linkedData.map((x,index) => <p key={index}>{x.label}</p>)}

                        <h3 className="Title">PlainText</h3>
                        {this.state.plainText}
                    </div>
                ) : (
                    <div className="Content">
                        <UploadComponent handleUploadFile={this.handleUploadFile} handleUrlFile={this.handleUrlFile}></UploadComponent>
                    </div>
                ))}
                <p>{this.state.error}</p>
            </div>
        )
    }
}

export default Upload;