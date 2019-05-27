import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Col  from 'react-bootstrap/Col';
import Row  from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'

import './UploadComponent.scss';
import cloud from './upload.png';

const UploadComponent = props => (
    <div className="Upload-Content">
        <div className="File-Upload-by-url">
        <Form>
            <Row>
                <Col sm={10}>
                    <Form.Control type="text" placeholder="URL" />
                </Col>
                <Col sm={2}>
                    <Button variant="primary">
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
        </div>

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