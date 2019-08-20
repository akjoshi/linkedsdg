/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import './ConceptList.scss';
import ConceptItem from './ConceptItem/ConceptItem';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import BubbleChart from '../BubbleChart/BubbleChart'
import lunr from 'lunr/lunr'
import {uid} from 'react-uid';

import Form from 'react-bootstrap/Form'
import ReactJson from 'react-json-view'



class ConceptList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.Concepts,
            displayData: props.Concepts,
            displayJson: false,
            searchText: "",
            idx: undefined,
            bubbleState: "ready",
        };
    }

    updateDimensions() {
        var element = document.getElementById('keywords-list-id');
        var positionInfo = element.getBoundingClientRect();
        let width = positionInfo.width;
        element.style.height = width + "px";
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
 
        const data = this.state.data;
        
        let idx = lunr(function () { 
            this.field('label')
            this.field('source')
            this.field('context')

            for( let i in data){
                this.add({
                    'id': i,
                    'label': data[i].label,
                    'source': data[i].source,
                })
            }
        })

        this.setState({idx: idx});

        
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }



    handleDownload = async () => {
        let dataForJson = [...this.state.data];
        dataForJson = dataForJson.map(x => {
            return {
                id: x.id,
                label: x.label,
                source: x.source
            };
        })

        var myWindow = window.open("", "MsgWindow");
        myWindow.document.write('<pre id="json"></pre>');
        myWindow.document.getElementById("json").innerHTML = JSON.stringify(dataForJson, undefined, 2);
    }

    handleCollapse = async () => {
        this.setState({ displayJson: !this.state.displayJson })
    }

    handlerForOpen = async (uri) => {
        let data = await this.state.data.map(x => { if (x.id === uri) { x.open = !x.open } return x })
        await this.setState({
            data: data
        })
    }

    handleSearch = async changeEvent => { 
        await this.setState({
            searchText: changeEvent.target.value 
        });
 
        let score = this.state.idx.search("*" + this.state.searchText + "*"  ); 

        let newData = [];
        for(let elem of score){
            newData.push(this.state.data[elem.ref])
        }

        this.setState({
            displayData: newData,
            bubbleState: uid(newData)
        });
    }


    render() {
        return (
            <div className="linked-concepts-container">
                <h3 className="Title">
                    Extracted concepts
                </h3>
                <div className="grid-container">
                    <div className="grid-item">
                        <ul className="keywords-list" id="keywords-list-id" >
                            {this.state.displayData.map((concept, index) => <ConceptItem handlerForOpen={this.handlerForOpen} concept={concept} key={index}></ConceptItem>)}
                        </ul>
                        <Row className="linked-concepts-footer">
                            <Col className="download-button">
                                <Button variant="primary" onClick={this.handleCollapse}>
                                    {/* ⤓ Get data */}
                                    {!this.state.displayJson ? <React.Fragment>Show data</React.Fragment> : <React.Fragment>Hide data</React.Fragment>}
                                </Button>
                            </Col>
                            <Col>
                                <div className="input-box">
                                    <Form.Control
                                        type="text"
                                        className="input-data"
                                        placeholder="Search.." 
                                        onChange={(e) => this.handleSearch(e)} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="grid-item">
                        <BubbleChart handlerForOpen={this.handlerForOpen} data={this.state.displayData} key={this.state.bubbleState}></BubbleChart>
                        <Row className="BubbleChart-info">
                            <Col>
                                <i>Source: </i>
                                <i><a href="http://metadata.un.org/thesaurus/" target="_blank"><span className="UNBIS"></span> UNBIS</a></i>
                                <i><a href="https://publications.europa.eu/en/web/eu-vocabularies/th-dataset/-/resource/dataset/eurovoc" target="_blank"><span className="EuroVoc"></span> EuroVoc</a></i>
                            </Col>
                        </Row>
                    </div>
                </div>
                {this.state.displayJson ?
                    <React.Fragment>
                        <div className="json-with-data">
                            <ReactJson src={this.state.data} collapsed={2} />
                        </div>
                        <Button variant="primary" onClick={this.handleDownload}>
                            ⤓ download
                        </Button>
                    </React.Fragment>
                    : <React.Fragment></React.Fragment>
                }
            </div>
        );
    }
}


export default ConceptList;