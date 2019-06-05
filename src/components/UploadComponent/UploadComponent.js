import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button'
import MainContext from '../../context/main-context'

import './UploadComponent.scss';
import cloud from './upload.png';

class UploadComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            URL: this.props.tryItLink
        };
    }

    static contextType = MainContext;

    gotURL = (event) => {
        this.props.handleUrlFile(this.state.URL, this.context);
        this.setState({URL:''});
    }

    gotFile = (event) => {
        this.props.handleUploadFile(event, this.context);
        this.setState({URL:''});
    }

    render() {
        return (
            <React.Fragment>
                <div className="Upload-Content" key={this.context.waitForData}>
                    <div className="File-Upload-by-url">
                        <Form>
                            <Row>
                                <Col sm={10}>
                                    <Form.Control type="text" placeholder="URL" value={this.props.tryItLink} onChange={(e) => this.setState({ URL: e.target.value })} />
                                </Col>
                                <Col sm={2}>
                                    <Button variant="primary" onClick={this.gotURL}>
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
                        <input id="upload-photo" className="File-Input" type="file" onChange={this.gotFile} />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default UploadComponent;