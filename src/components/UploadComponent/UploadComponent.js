import React from 'react';
import { NavLink } from 'react-router-dom';
import './UploadComponent.scss';

const UploadComponent = props => (
    <div className="File-Upload">
        <input className="File-Input" type="file" onChange={props.handleUploadFile} />
    </div>
);


export default UploadComponent;