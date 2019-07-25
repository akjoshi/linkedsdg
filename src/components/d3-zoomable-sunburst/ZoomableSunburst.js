import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './ZoomableSunburst.scss'

import {
    chooseState, 
    setSunState, 
    selectImage,
    loadConcepts,
    callForCountryApi,
    genOnClick,
    getJsonText,
    reciveSeriesJsonFromApi,
    reciveJsonFromApi
} from './utilities';

import { drawChart } from './drawFunction';

class ZoomableSunburst extends Component {
    constructor(props) {
        super(props);
        this.chooseState = chooseState.bind(this);
        this.setSunState = setSunState.bind(this);
        this.selectImage = selectImage.bind(this);
        this.loadConcepts = loadConcepts.bind(this);
        this.callForCountryApi = callForCountryApi.bind(this);
        this.genOnClick = genOnClick.bind(this);
        this.getJsonText = getJsonText.bind(this);
        this.reciveSeriesJsonFromApi = reciveSeriesJsonFromApi.bind(this);
        this.reciveJsonFromApi = reciveJsonFromApi.bind(this);
        this.drawChart = drawChart.bind(this);
    }


    componentDidMount() {
        this.drawChart();
    }

    state = {
        svgElement: '',
        lastPointedData: '',
        clickedData: {},
        dataForPreview: undefined,
        selectedGoal: undefined,
        selectedGoalName: 'Sustainable Development Goals',
        countrySeriesData: [],
        sunState: "root",
        lastNode: undefined,
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="Title">
                    Most relevant SDGs
                </h3>
                <div className="grid-container">
                    <div>

                        <div id={"ZoomableSunburst"} className="grid-item"></div>
                        {this.state.clickedData.label !== undefined && this.state.clickedData.label.split(" ")[0] === "Series" ? (
                            <div className="country-series-info">
                                <h4>Values</h4>
                                <Row >
                                    <Col>Name</Col>
                                    <Col>Value </Col>
                                    <Col>Units </Col>
                                    <Col xs={1}></Col>
                                </Row>
                                <div className="records-container">
                                {this.state.countrySeriesData.map(x => {
                                    return <div key={x['@id']} id={"Series" + x['@id']} className="series-info" >
                                        <Row>
                                            <Col className="uri-link series-country-country" onClick={this.callForCountryApi(x)}>{x.geoAreaName}</Col>
                                            <Col>{x.latest_value === undefined ? "No data" : x.latest_value} </Col>
                                            <Col>{x.Units_description} </Col>
                                            <Col xs={1} className="series-country-expand" onClick={this.genOnClick(x)}>+</Col>
                                        </Row>
                                        <Row className="series-country-json">
                                            <Col>
                                                <ul>
                                                    {this.getJsonText(x)}
                                                </ul>
                                            </Col>
                                        </Row>
                                    </div>
                                })}
                                </div>

                                <p className="uri-link" onClick={this.reciveSeriesJsonFromApi}>GET DATA</p>
                            </div>
                        ) :
                            (<React.Fragment></React.Fragment>)
                        }

                    </div>
                    <div className="grid-item">

                        <div className="grid-container-info">
                            <div className="goal-image-container">
                                {this.selectImage()}
                            </div>
                            <div>
                                <h3 className="title">{this.state.selectedGoalName}</h3>
                            </div>
                            <div className="grid-item-text">

                                {this.state.dataForPreview ? (
                                    <React.Fragment>
                                        <p>
                                            <span>LABEL: </span>
                                            {this.state.dataForPreview.label}
                                        </p>

                                        <p>
                                            <span>NAME: </span>
                                            {this.state.dataForPreview.name}
                                        </p>
                                    </React.Fragment>
                                ) : (this.state.clickedData.id ? (
                                    <React.Fragment>

                                        <p>
                                            <span>LABEL: </span>
                                            {this.state.clickedData.label}
                                        </p>

                                        <p>
                                            <span>NAME: </span>
                                            {this.state.clickedData.name}
                                        </p>
                                        <p onClick={this.reciveJsonFromApi} className="uri-link">
                                            <span>URI: </span>
                                            {this.state.clickedData.id}
                                        </p>
                                        <p> <span>CONCEPTS: </span> </p>
                                        {this.loadConcepts()}


                                    </React.Fragment>
                                ) : (<React.Fragment></React.Fragment>))}


                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ZoomableSunburst;