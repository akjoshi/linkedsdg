/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import './Upload.scss'
import ConceptList from '../../components/ConceptList/ConceptList';
import { handleUploadFile, handleUrlFile, processText } from './utilities';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ProgressBar from 'react-bootstrap/ProgressBar'
import CopyIcon from './copy-icon.png';
import UploadForm from '../../components/UploadForm/UploadForm'
import ZoomableSunburst from '../../components/d3-zoomable-sunburst/ZoomableSunburst'
import DataMap from '../../components/DataMaps/DataMaps'


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
        fullConcepts: [],
        linkedData: {},
        isLoading: false,
        loadedFrom: '',
        URL: '',
        file: null,
        fileName: '',
        waitForData: true,
        selectedOption: 'fromURL',
        error: '',
        dataForSun: {},
        dataForDataMap: {},
        dataForSeries: [],
        progress: 0,
        downloadDataAboutCountry: [],
        conceptsShowData: {},
        matchQuotesForCounty: [],
        examples: [], 
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

    componentDidMount() {
        let examples = require('./exampleArticles.json');
        this.setState({ examples: examples })
         
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
        if (changeEvent.target.files[0] === undefined) {
            return;
        }
        this.setState({
            selectedOption: "fromFile",
            file: changeEvent.target.files[0],
            fileName: changeEvent.target.files[0].name
        })
    };

    analyze = () => {
        this.clear()
        if (this.state.selectedOption === 'fromURL') {
            this.handleUrlFile(this.state.URL);
        }
        else if (this.state.selectedOption === 'fromFile') {
            if (this.state.file !== null) {
                this.handleUploadFile(this.state.file);
            }
            else {
                this.setState({ error: "Please select file." })
            }
        }
    }

    render() {
        return (
            <div className="Upload">
                <div className="upload-content">
                    <Row>
                        <Col lg={4}>
                            <h3 className="title">ANALYZE DOCUMENT</h3>
                            <p className="Description">Upload a document related to Sustainable Development Goals or paste its URL in order to analyse it (PDF, DOC, DOCX, HTML - max. size: 70K words). </p>
                            <p className="Description">The document can be in either of the six official UN languages: Arabic, Chinese, English, French, Russian and Spanish. </p>
                            <p className="Description">You can also use some of the example links provided.</p>

                            {/* <div className="analyze-button-container">
                                <Button variant="primary" className="analyze-button desktop" onClick={this.analyze}>
                                    {this.state.isLoading ? (<React.Fragment>Loading...</React.Fragment>) : (<React.Fragment>ANALYZE</React.Fragment>)}
                                </Button>
                            </div> */}

                        </Col>
                        <Col lg={8} className="example-links">
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
                                            analyze={this.analyze}
                                        ></UploadForm>
                                    </div>
                                    <div className="analyze-button-container">
                                        <Button variant="primary" className="analyze-button " onClick={this.analyze}>
                                            {this.state.isLoading ? (<React.Fragment>Loading...</React.Fragment>) : (<React.Fragment>ANALYZE</React.Fragment>)}
                                        </Button>
                                    </div>
                                </div>

                                <div className="example-links-list">
                                    <p className="small-label">Examples</p>
                                    <ul>
                                        {this.state.examples.map((x, index) =>
                                            <li key={index}>
                                                <a href={x.url} target="_blank"><span ><img alt="Copy" src={CopyIcon}></img></span></a>
                                                <div className="tooltip">
                                                    <span onClick={() => this.setState({ selectedOption: "fromURL", URL: x.url })} >{x.label}</span>
                                                    <span className="tooltiptext">Click to copy</span>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </React.Fragment>
                        </Col>
                    </Row>
                </div>


                {this.state.isLoading ? (
                    <div className="progress-bar-container">
                        <h4>Progress:</h4>
                        <ProgressBar animated now={this.state.progress} label={`${this.state.progress}%`} striped={false} />
                    </div>
                ) : (
                        !this.state.waitForData ? (
                            <div className="Data-Area" >
                                <div id="Data-Area-id"></div>

                                <ConceptList Concepts={this.state.concepts} fullConcepts={this.state.fullConcepts} displayData={this.state.conceptsShowData}></ConceptList>

                                <DataMap data={this.state.dataForDataMap} matchQuotes={this.state.matchQuotesForCounty} downloadData={this.state.downloadDataAboutCountry} responsive={true} />

                                <ZoomableSunburst data={this.state.dataForSun} dataForSeries={this.state.dataForSeries} />

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