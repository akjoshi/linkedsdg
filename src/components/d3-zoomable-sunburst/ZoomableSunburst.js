import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import DataSeriesTable from './DataSeriesComponent/DataSeriesComponent'
import './ZoomableSunburst.scss'
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

import { drawChart } from './drawFunction';

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
    }


    handleCollapse = async () => {
        this.setState({ displayJson: !this.state.displayJson })
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

                    </div>

                    <div className="grid-item">
                        <div className="grid-container-info">
                            <div className="goal-image-container">
                                {this.selectImage()}
                            </div>
                            <div>
                                <h3 className="title">{this.state.selectedGoalName}</h3>
                            </div>
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
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed venenatis justo sit amet eros viverra finibus. Vestibulum erat risus, dapibus sit amet lacus a, porttitor accumsan dui.
                                        </p>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.sunState === "series" ? (
                    <div className="country-series-info">

                        {/* Need to add columns */}
                        <DataSeriesTable data={this.state.countrySeriesData} description={this.state.clickedData.name} columns={this.state.columns}></DataSeriesTable>

                        <Button variant="primary" onClick={this.handleCollapse} className="button-for-table">
                            {!this.state.displayJson ? <React.Fragment>Show data</React.Fragment> : <React.Fragment>Hide data</React.Fragment>}
                        </Button>
                        {this.state.displayJson ?
                            <React.Fragment>
                                <div className="json-with-data">
                                    <ReactJson src={this.state.countrySeriesData} collapsed={2} displayDataTypes={false} name={"Series"}/>
                                </div>
                                <Button variant="primary" onClick={this.getSeriesJsonFromApi}>
                                    ⤓ download
                                </Button>
                            </React.Fragment>
                            : <React.Fragment></React.Fragment>
                        }
                    </div>


                ) :
                    (<React.Fragment></React.Fragment>)
                }


            </React.Fragment>
        )
    }
}

export default ZoomableSunburst;