import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import DataSeriesTable from './DataSeriesComponent/DataSeriesComponent'
import './ZoomableSunburst.scss'
import Baner from './baner.png'
import axios from 'axios';
import ReactJson from 'react-json-view'

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

    generateCSVData = async (children) => {
        // console.log(children)
        let returnData = []
        for (let obj of children) {
            let data = []
            if (obj.children !== undefined) {
                data = await this.generateCSVData(obj.children)
            }
            for (let keyWordURL of Object.keys(obj.keywords)) {
                // console.log(keyWordURL)
                let id = obj.id;
                let label = obj.label;
                let name = obj.name;
                let weight = obj.value;
                if (weight === undefined) {
                    weight = 0;
                    let uriWeight = {}
                    await data.map(obj => { 
                        if (uriWeight[obj.id] === undefined) {
                            uriWeight[obj.id] = obj.weight;
                        } 
                    })
                    for (let key of Object.keys(uriWeight)) {
                        weight += uriWeight[key];
                    }
                }
                let keyWordLabel = obj.keywords[keyWordURL].label
                for (let sourceURIObject of obj.keywords[keyWordURL].sources) {
                    let sourceURI = sourceURIObject.uri
                    data.push({
                        'id': id,
                        'label': label,
                        'name': name,
                        'keyWordLabel': keyWordLabel,
                        'sourceURI': sourceURI,
                        "weight": weight
                    })
                }
            }
            returnData = [...returnData, ...data]
        }

        return returnData;
    }

    handleDownloadCSV = async () => {
        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        const { Parser } = require('json2csv');
        console.log(this.props.data)
        let csvData = await this.generateCSVData(this.props.data.children)
        console.log(csvData)
        const fields = ['id', 'label', 'name', 'keyWordLabel', 'sourceURI', 'weight'];
        const opts = { fields };

        try {
            const parser = new Parser(opts);
            const csv = parser.parse(csvData);
            console.log(JSON.stringify(csv, undefined, 2));
            download("data.csv", csv);
            // var myWindow = window.open("", "MsgWindow");
            // myWindow.document.write('<pre id="json"></pre>');
            // myWindow.document.getElementById("json").innerHTML = csv;

        } catch (err) {
            console.error(err);
        }

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
            <React.Fragment >
                <h3 className="Title">
                    Most relevant SDGs
                </h3>
                <div className="grid-container">
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
                                            <span>NAME: </span>
                                            {this.state.dataForPreview.label}
                                        </p>

                                        <p>
                                            <span>DESCRIPTION: </span>
                                            {this.state.dataForPreview.name}
                                        </p>
                                    </React.Fragment>
                                ) : (this.state.clickedData.id ? (
                                    <React.Fragment>

                                        <p>
                                            <span>NAME: </span>
                                            {this.state.clickedData.label}
                                        </p>

                                        <p>
                                            <span>DESCRIPTION: </span>
                                            {this.state.clickedData.name}
                                        </p>
                                        <p className="uri-link">
                                            <span>URI: </span>
                                            <a href={this.state.clickedData.id} target="_blank" rel="noopener noreferrer" className="uri-link"> {this.state.clickedData.id}</a>
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
                                            <p>Explore the SDG wheel to find goals, targets, indicators and data series that are most relevant to the processed document, based on the extracted concepts and geographical areas.</p>
                                        </React.Fragment>

                                    ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div id={"ZoomableSunburst"} className="grid-item"></div>
                    </div>


                </div>


                <Button variant="primary" onClick={this.handleCollapse} className="show-data-sun-button">
                    {!this.state.displayJson ? <React.Fragment>Show data</React.Fragment> : <React.Fragment>Hide data</React.Fragment>}
                </Button>



                {
                    this.state.displayJson ?
                        <React.Fragment>
                            <p>The following downloadable data sample contains structured version of the information visualized above. Such data is available for programmatic consumption via the accompanying APIs.</p>
                            <div className="json-with-data">
                                <ReactJson src={this.props.data} collapsed={2} displayDataTypes={false} name={"Relevant SDGs"} />
                            </div>
                            <Button variant="primary" onClick={this.handleDownload} className="sun-download">
                                ⤓ download
                        </Button>

                            <Button variant="primary" onClick={this.handleDownloadCSV} className="sun-download">
                                ⤓ download as CSV
                        </Button>

                        </React.Fragment>
                        : <React.Fragment></React.Fragment>
                }


                {(this.state.sunState === "series" && this.state.countrySeriesData["@graph"] !== undefined && this.state.countrySeriesData["@graph"].length > 0) ? (
                    <div className="country-series-info">

                        <DataSeriesTable
                            data={this.state.countrySeriesData}
                            description={this.state.clickedData.name}
                            columns={this.state.columns}
                            keyWords={this.state.clickedData.keyWords} />


                        <Button variant="primary" onClick={this.handleExplore} className="button-for-table explore-all-data">
                            {!this.state.exploreAllLoading ? <React.Fragment>Explore data for all locations</React.Fragment> : <React.Fragment>Loading...</React.Fragment>}
                        </Button>

                    </div>


                ) :
                    ((this.state.sunState === "series" && this.state.countrySeriesData["@graph"] !== undefined && this.state.countrySeriesData["@graph"].length === 0) ?
                        <div className="no-data-text">
                            <p><span role="img" aria-label="no-data">&#x1f6ab;</span> No data available for the selected regions and series.</p>
                            {this.state.countrySeriesData["more_data"] ?
                                <Button variant="primary" onClick={this.handleExplore} className="button-for-table explore-all-data-no-data">
                                    {!this.state.exploreAllLoading ? <React.Fragment>Explore data for all locations</React.Fragment> : <React.Fragment>Loading...</React.Fragment>}
                                </Button> :
                                <React.Fragment></React.Fragment>}
                        </div> : <React.Fragment></React.Fragment>
                    )
                }


            </React.Fragment>
        )
    }
}

export default ZoomableSunburst;