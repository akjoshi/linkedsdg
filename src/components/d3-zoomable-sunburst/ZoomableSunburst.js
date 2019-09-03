import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import DataSeriesTable from './DataSeriesComponent/DataSeriesComponent'
import './ZoomableSunburst.scss'
import Baner from './baner.png'
import axios from 'axios';

import {
    chooseState,
    setSunState,
    selectImage,
    loadConcepts,
    describeCountry,
    expandCountryDetailsOnClick,
    expandAllCountryDetailsOnClick,
    getJsonWithImportantFields,
    getSeriesJsonFromApi,
    getJsonDescribeOfUri
} from './utilities';

import { drawChart, constructColumns } from './drawFunction';

class ZoomableSunburst extends Component {
    constructor(props) {
        super(props);
        this.chooseState = chooseState.bind(this);
        this.setSunState = setSunState.bind(this);
        this.selectImage = selectImage.bind(this);
        this.loadConcepts = loadConcepts.bind(this);
        this.describeCountry = describeCountry.bind(this);
        this.expandCountryDetailsOnClick = expandCountryDetailsOnClick.bind(this);
        this.expandAllCountryDetailsOnClick = expandAllCountryDetailsOnClick.bind(this);
        this.getJsonWithImportantFields = getJsonWithImportantFields.bind(this);
        this.getSeriesJsonFromApi = getSeriesJsonFromApi.bind(this);
        this.getJsonDescribeOfUri = getJsonDescribeOfUri.bind(this);
        this.drawChart = drawChart.bind(this);
        this.constructColumns = constructColumns.bind(this);

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
        displayJson: false,
        columns: [],
        keyWords: [],
        exploreAllLoading: false,
    }


    handleCollapse = async () => {
        this.setState({ displayJson: !this.state.displayJson })
    }

    handleDownload = async () => {
        var myWindow = window.open("", "MsgWindow");
        myWindow.document.write('<pre id="json"></pre>');
        myWindow.document.getElementById("json").innerHTML = JSON.stringify(this.props.data, undefined, 2);
    }


    handleExplore = async () => {
        if (this.state.clickedData.label !== undefined && this.state.clickedData.label.split(" ")[0] === "Series") {
            try {
                this.setState({ exploreAllLoading: true });
                const dataForApi = {
                    "stat": this.state.clickedData.id
                }

                let config = require('../../config.json');
                const text = await axios.post(config.statsApiUrl, dataForApi, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (text.status !== 200 && text.status !== 201) {
                    throw new Error('Failed!');
                }

                let columns = constructColumns(text)

                await this.setState({
                    countrySeriesData: text.data,
                    columns: columns,
                    exploreAllLoading: false,
                })

            } catch (error) {
                console.log("ERROR");
            }
        }
        else {
            this.setState({ countrySeriesData: [] })
        }


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
                        <Button variant="primary" onClick={this.handleDownload} className="sun-download">
                        ⤓ download
                    </Button>
                    </div>

                    <div className="grid-item">
                        <div className="grid-container-info">
                            {this.state.sunState === "root" && this.state.dataForPreview === undefined ?
                                <div className="baner-img">
                                    <img src={Baner} alt="Baner"></img>
                                </div> :
                                <React.Fragment>
                                    <div className="goal-image-container">

                                        {this.selectImage()}

                                    </div>
                                    <div>
                                        <h3 className="title">{this.state.selectedGoalName}</h3>
                                    </div>
                                </React.Fragment>
                            }
                            <div id="informationFromTheSun" className="grid-item-text">

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
                                        <p onClick={this.getJsonDescribeOfUri} className="uri-link">
                                            <span>URI: </span>
                                            {this.state.clickedData.id}
                                        </p>
                                        <p> <span>KEYWORDS: </span> </p>
                                        {/* {this.state.keyWords.map(x => <p>{x}</p>)} */}
                                        <ul className="linked-concepts-list">
                                            {this.loadConcepts()}
                                        </ul>


                                    </React.Fragment>
                                ) : (
                                        <React.Fragment>
                                            <p>The United Nations <b>Sustainable Development Goals</b> (SDGs) are 17 global goals that all UN Member States have agreed to try to achieve by the year 2030.</p>
                                            <p>The 17 SDGs are articulated into 169 <b>targets</b>, 230 <b>indicators</b>, and over 400 <b>data series</b> that help to measure the progress towards achieving the SDGs.</p>
                                            <p>Explore the SDG wheel on the left to find goals, targets, indicators and data series that are most relevant to the processed document, based on the extracted concepts and geographical regions.</p>
                                        </React.Fragment>

                                    ))}
                            </div>
                        </div>
                    </div> 
                </div>

                {(this.state.sunState === "series" && this.state.countrySeriesData["@graph"] !== undefined && this.state.countrySeriesData["@graph"].length > 0) ? (
                    <div className="country-series-info">

                        <DataSeriesTable data={this.state.countrySeriesData} description={this.state.clickedData.name} columns={this.state.columns} keyWords={this.state.clickedData.keyWords}></DataSeriesTable>

                        <Button variant="primary" onClick={this.handleExplore} className="button-for-table explore-all-data">
                            {!this.state.exploreAllLoading ? <React.Fragment>Explore all data</React.Fragment> : <React.Fragment>Loading...</React.Fragment>}
                        </Button>

                    </div>


                ) :
                    ((this.state.sunState === "series" && this.state.countrySeriesData["@graph"] !== undefined && this.state.countrySeriesData["@graph"].length === 0) ?
                        <React.Fragment><p className="no-data-text"><span role="img">&#x1f6ab;</span> No data available for the selected regions and series.</p></React.Fragment> : <React.Fragment></React.Fragment>
                    )
                }


            </React.Fragment>
        )
    }
}

export default ZoomableSunburst;