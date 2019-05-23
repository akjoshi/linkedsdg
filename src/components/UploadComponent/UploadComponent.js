import React from 'react';
import { NavLink } from 'react-router-dom';

import './UploadComponent.scss';
import cloud from './upload.png';

const UploadComponent = props => (
    <div className="Upload-Content">


        <span className="Title">Upload Files</span>
        <p className="Description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mi orci, bibendum id feugiat sit amet, laoreet viverra arcu. Maecenas pulvinar mauris vitae iaculis suscipit. Phasellus scelerisque orci nec sollicitudin fringilla. Donec eu luctus metus, dictum sollicitudin dui. Nullam sit amet metus justo. Ut auctor dignissim orci eu congue. 
        </p>
        <div className="File-Upload">
            <label htmlFor="upload-photo">
                <img src={cloud} alt="Upload"></img>
                <p>
                    Select File
                </p>
            </label>
            <input id="upload-photo" className="File-Input" type="file" onChange={props.handleUploadFile} />
        </div>
    </div>

);


export default UploadComponent;