import React, { Component } from 'react';
import './Upload.scss'
import axios from 'axios';
import ConceptItem from '../components/ConceptList/ConceptItem/ConceptItem';
import ConceptList from '../components/ConceptList/ConceptList';
import UploadComponent from '../components/UploadComponent/UploadComponent';

class Upload extends Component {
    state = {
        PlainText: '',
        Concepts: [],
        LinkedData: {}
    };

    handleUploadFile = async (event) => {
        const data = new FormData();
        data.append('file', event.target.files[0]);
        const text = await axios.post('http://127.0.0.1:5000/api', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const jsonText = await axios.post('http://127.0.0.1:5001/api', {
            text: text.data,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );

        console.log(jsonText['data']);

        this.setState({ PlainText: jsonText['data']['clean_text'] })

        const concepts = [];

        for (var key in jsonText['data']['concepts']) {
            concepts.push({
                id: key,
                label: jsonText['data']['concepts'][key]['label'],
                source: jsonText['data']['concepts'][key]['source'],
                weight: jsonText['data']['concepts'][key]['weight'],
                context: jsonText['data']['matches'][0]['context']
            })
        }

        console.log(concepts)
        this.setState({ Concepts: concepts })

        const match = jsonText['data']['matches'].map(function (x) {
            return {
                "url": x['url'],
                "weight": 1
            }
        });

        const linkedData = await axios.post('http://127.0.0.1:5002/api', match);

        this.setState({ LinkedData: linkedData });

        console.log(linkedData);
    }


    render() {
        return (
            <div className="Upload">
                <span className="Title">Upload Files</span>
                <div className="Content">
                    <UploadComponent handleUploadFile={this.handleUploadFile}></UploadComponent>
                </div>
                <div className="Data-Area">
                    <ConceptList Concepts={this.state.Concepts}></ConceptList> 
                    {this.state.PlainText}
                </div>
            </div>
        )
    }
}

export default Upload;