import React, { Component } from 'react';
import './Upload.scss'
import axios from 'axios';
import ConceptItem from '../components/ConceptItem/ConceptItem';

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
            })
        }

        console.log(concepts)
        this.setState({ Concepts: concepts })

        const match = jsonText['data']['matches'].map(function(x){
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
                    <div className="File-Upload">
                        <input className="File-Input" type="file" onChange={this.handleUploadFile} />
                    </div>
                </div>
                <div className="Data-Area">
                    <ul>
                        {this.state.Concepts.map(concept => <ConceptItem concept={concept}></ConceptItem>)}
                    </ul>
                    {this.state.PlainText}
                </div>
            </div>
        )
    }
}

export default Upload;