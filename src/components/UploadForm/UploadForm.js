import React from 'react';
import Form from 'react-bootstrap/Form'

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './UploadForm.scss';

class UploadForm extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Form>
                    <Row>
                        <Col sm={12}>
                            <div className="input-container">
                                <div className="radio-box">
                                    <input
                                        type="radio"
                                        name="optradio"
                                        className="radio-button"
                                        value="fromURL"
                                        checked={this.props.selectedOption === "fromURL"}
                                        onChange={(e) => this.props.handleOptionChange(e)}  />
                                </div>
                                <div className="input-box">
                                    <Form.Control
                                        type="text"
                                        className="input-data"
                                        placeholder="URL"
                                        value={this.props.URL}
                                        onChange={(e) => this.props.handleURLChange(e)} 
                                        onKeyDown={(e) => { if(e.key === 'Enter') { this.props.analyze(e) }}}  />
                                </div>
                            </div>

                        </Col>
                        <Col sm={12}>
                            <div className="input-container">
                                <div className="radio-box">
                                    <input
                                        type="radio"
                                        name="optradio"
                                        className="radio-button"
                                        value="fromFile"
                                        checked={this.props.selectedOption === "fromFile"}
                                        onChange={(e) => this.props.handleOptionChange(e)}  />
                                </div>
                                <div className="input-box">
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            placeholder="URL"
                                            className="custom-file-input"
                                            id="customFile"
                                            onChange={(e) => this.props.handleFileChange(e)} />
                                        <label
                                            className="custom-file-label"
                                            htmlFor="customFile">
                                            Choose file: {this.props.fileName}</label>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }
}


export default UploadForm;