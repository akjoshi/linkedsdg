import React, { Component } from 'react';
import './Upload.scss'
import ConceptList from '../components/ConceptList/ConceptList';
import UploadComponent from '../components/UploadComponent/UploadComponent';
import Spinner from '../components/Spinner/Spinner';
import {handleUploadFile, handleUrlFile, processText} from './utilities';

class Upload extends Component {
    constructor(props) {
        super(props);
    
        this.handleUploadFile = handleUploadFile.bind(this);
        this.handleUrlFile = handleUrlFile.bind(this);
        this.processText = processText.bind(this);
    }

    state = {
        plainText: '',
        concepts: [],
        linkedData: {},
        isLoading: false,
        contentLoaded: false,
        error: ''
    };


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