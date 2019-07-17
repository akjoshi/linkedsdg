/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import './Upload.scss'
import ConceptList from '../../components/ConceptList/ConceptList';
import LinkedConceptsList from '../../components/LinkedConceptsList/LinkedConceptsList';
import Spinner from '../../components/Spinner/Spinner';
import { handleUploadFile, handleUrlFile, processText } from './utilities';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CopyIcon from './copy-icon.png';
import UploadForm from '../../components/UploadForm/UploadForm'
import ZoomableSunburst from '../../components/d3-zoomable-sunburst/ZoomableSunburst'


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
        loadedFrom: '',
        URL: '',
        file: null,
        fileName: '',
        waitForData: true,
        selectedOption: 'fromURL',
        error: '',
    };

    clear = (event) => {
        this.setState({
            plainText: '',
            concepts: [],
            linkedData: {},
            isLoading: false,
            waitForData: true,
            error: ''
        })
    }

    handleOptionChange = changeEvent => {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    };

    handleURLChange = changeEvent => {
        this.setState({
            URL: changeEvent.target.value
        });
    };

    handleFileChange = changeEvent => {
        if(changeEvent.target.files[0] === undefined){
            return;
        }
        this.setState({ 
            selectedOption: "fromFile", 
            file: changeEvent.target.files[0], 
            fileName: changeEvent.target.files[0].name })
    };

    analyze = () => {
        this.clear()
        if (this.state.selectedOption === 'fromURL') {
            this.handleUrlFile(this.state.URL);
        }
        else if (this.state.selectedOption === 'fromFile') {
            if(this.state.file !== null){
                this.handleUploadFile(this.state.file);
            }
            else{
                this.setState({error: "Please select file."})
            }
        }
    }

    render() {
        return (
            <div className="Upload">
                <div className="upload-content">
                    <Row>
                        <Col lg={4}>
                            <p className="Description">
                                Upload a document (PDF, DOC, DOCX, HTML) related to Sustainable Development Goals (SDGs) or paste its URL in order to analyse it. You can also use some of the example links listed below.
                        </p>
                        </Col>
                        <Col lg={8}>
                            <React.Fragment>
                                <div className="Upload-Content" key={this.context.waitForData}>
                                    <div className="File-Upload-by-form">
                                        <UploadForm
                                            handleOptionChange={this.handleOptionChange}
                                            handleURLChange={this.handleURLChange}
                                            handleFileChange={this.handleFileChange}
                                            selectedOption={this.state.selectedOption}
                                            URL={this.state.URL}
                                            fileName={this.state.fileName}
                                        ></UploadForm>
                                    </div>
                                </div>
                            </React.Fragment>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} className="analyze-button-container">
                            <Button variant="primary" className="analyze-button" onClick={this.analyze}>
                                {this.state.isLoading ? (<React.Fragment>Loading...</React.Fragment>) : (<React.Fragment>ANALYZE</React.Fragment>)}
                            </Button>
                        </Col>
                        <Col lg={8} className="example-links">
                            <p className="small-label">Examples</p>
                            <ul>
                                <li>
                                    <span onClick={() => this.setState({ selectedOption: "fromURL", URL: "https://www.un.org/sustainabledevelopment/wp-content/uploads/2016/08/2_Why-it-Matters_ZeroHunger_2p.pdf" })}><img alt="Copy" src={CopyIcon}></img></span>
                                    <a href="https://www.un.org/sustainabledevelopment/wp-content/uploads/2016/08/2_Why-it-Matters_ZeroHunger_2p.pdf" target="_blank">Zero Hunger: Why It Matters?</a>
                                </li>
                                <li>
                                    <span onClick={() => this.setState({ selectedOption: "fromURL", URL: "https://www.un.org/sustainabledevelopment/wp-content/uploads/2017/02/ENGLISH_Why_it_Matters_Goal_17_Partnerships.pdf" })}><img alt="Copy" src={CopyIcon}></img></span>
                                    <a href="https://www.un.org/sustainabledevelopment/wp-content/uploads/2017/02/ENGLISH_Why_it_Matters_Goal_17_Partnerships.pdf" target="_blank">Partnerships: Why They Matter?</a>
                                </li>
                                <li>
                                    <span onClick={() => this.setState({ selectedOption: "fromURL", URL: "http://www.transforming-tourism.org/goal-14-life-below-water.html" })}><img alt="Copy" src={CopyIcon}></img></span>
                                    <a href="http://www.transforming-tourism.org/goal-14-life-below-water.html" target="_blank">Conserve and sustainably use the oceans, seas and marine resources for sustainable development</a>
                                </li>
                                <li>
                                    <span onClick={() => this.setState({ selectedOption: "fromURL", URL: "https://www.theguardian.com/business-call-to-action-partnerzone/2019/apr/29/gender-equality-closing-the-gap-in-the-private-sector-around-the-world" })}><img alt="Copy" src={CopyIcon}></img></span>
                                    <a href="https://www.theguardian.com/business-call-to-action-partnerzone/2019/apr/29/gender-equality-closing-the-gap-in-the-private-sector-around-the-world" target="_blank">Gender equality: closing the gap in the private sector around the world</a>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
                <ZoomableSunburst data={{}}/>

                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        !this.state.waitForData ? (
                            <div className="Data-Area" >
                                <div id="Data-Area-id"></div>
                                
                                <ConceptList Concepts={this.state.concepts}></ConceptList>

                                <LinkedConceptsList Data={this.state.linkedData}></LinkedConceptsList>

                                <div className="clear-button">
                                    <Button variant="primary" onClick={this.clear}>
                                        CLEAR
                                    </Button>
                                </div>
                            </div>
                        ) : (
                                <React.Fragment></React.Fragment>
                            ))}
                <p>{this.state.error}</p>
            </div>
        )
    }
}

export default Upload;