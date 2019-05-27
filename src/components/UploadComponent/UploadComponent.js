import React from 'react';
import { NavLink } from 'react-router-dom';

import './UploadComponent.scss';
import cloud from './upload.png';

const UploadComponent = props => (
    <div className="Upload-Content">
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