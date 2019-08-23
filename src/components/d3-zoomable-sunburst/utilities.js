/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import axios from 'axios';
import Wheel from './img/wheel.png';
import Collapse from 'react-bootstrap/Collapse'
import './ZoomableSunburst.scss'

let config = require('../../config.json');

export function setSunState(deeper = true) {
    if (deeper === true) {
        if (this.state.sunState === "root") {
            this.setState({ sunState: "goal" })
        }
        else if (this.state.sunState === "goal") {
            this.setState({ sunState: "target" })
        }
        else if (this.state.sunState === "target") {
            this.setState({ sunState: "indicator" })
        }
        else if (this.state.sunState === "indicator") {
            this.setState({ sunState: "series" })
        }
    }
    else {
        if (this.state.sunState === "series") {
            this.setState({ sunState: "indicator" })
        }
        else if (this.state.sunState === "indicator") {
            this.setState({ sunState: "target" })
        }
        else if (this.state.sunState === "target") {
            this.setState({ sunState: "goal" })
        }
        else if (this.state.sunState === "goal") {
            this.setState({ sunState: "root" })
        }
    }
}

export function chooseState(p) {
    if (this.state.lastNode === p.parent || this.state.lastNode === undefined) {
        if (this.state.lastNode === undefined && p.parent !== null && p.parent.parent !== null) {
            this.setSunState(true)
            this.setState({ lastNode: p })
            this.setSunState(true)
        }
        else {
            this.setSunState(true)
        }
    }
    else if (p.parent !== null && this.state.lastNode === p.parent.parent) {
        this.setSunState(true)
        this.setState({ lastNode: p })
        this.setSunState(true)
    }
    else {
        this.setSunState(false)
    }
    this.setState({ lastNode: p })
}

export function selectImage() {
    let images = {}
    let index = 1;
    while (index < 18) {
        let indexNr = ""
        index < 10 ? indexNr = "0" + index : indexNr = index;
        images["http://data.un.org/kos/sdg/" + indexNr] = require(`./img/${indexNr}.png`);
        index = index + 1;
    }

    if (this.state.selectedGoal === undefined) {
        return <img className="goal-image" src={Wheel} alt="Goal img"></img>;;
    }
    return <img className="goal-image" src={images[this.state.selectedGoal]} alt="Goal img"></img>;
}

export function loadConcepts() {

    let data = [];

    for (var url in this.state.clickedData.concept) {
        let linkedConcepts = [];

        for (var url2 in this.state.clickedData.concept[url]['subconcepts']) {
            linkedConcepts.push({
                url: url2,
                label: this.state.clickedData.concept[url]['subconcepts'][url2].label,
            })
        }

        data.push({
            url: url,
            label: this.state.clickedData.concept[url].label,
            source: this.state.clickedData.concept[url].source,
            linkedConcepts: linkedConcepts
        })
    }

    return this.state.keyWords.map(x => {
        let open = x.open;
        let isEmpty = true;

        let selectedData = data.filter((t, index) => {
            return t.url === x.uri
        })

        selectedData = selectedData[0]

        if (selectedData !== undefined) {
            isEmpty = false;
        }

        return (

            <li className="event-list-item">
                <div>
                    {isEmpty ?
                        <a className="a-concept-name empty" href={x.uri}>{x.label}</a> :
                        <a className="a-concept-name" href={x.uri}>{x.label}</a>}

                </div>
                <div className="collapse-button">
                    {isEmpty ?
                        <React.Fragment></React.Fragment> :
                        <button
                            className=""
                            onClick={async () => {
                                let data = await this.state.keyWords.map(y => { if (y.uri === x.uri) { y.open = !y.open } return y })
                                await this.setState({
                                    keyWords: data,
                                })
                            }}
                            aria-expanded={open}>

                            {open ? (<p>&#x2303;</p>) : (<p className="open-arrow">&#x2303;</p>)}
                        </button>
                    }
                </div>
                <Collapse in={open}>
                    <div id="example-collapse-text">
                        <div className="annotation">
                            <p>Related extracted concepts :</p>
                        </div>

                        {isEmpty ?
                            <p>NOT FOUND</p> :
                            <ul className="concept-list">
                                {selectedData.linkedConcepts.map((t, index) => {
                                    return <li key={index} className="collapse-item"><a href={t.url}>{t.label}</a></li>
                                })}
                            </ul>
                        }
                    </div>
                </Collapse>
            </li>
        )
    })


}

export function describeCountry(x) {
    return async () => {
        const dataForApi = {
            "type": "Country",
            "uri": x.geoArea['@id']
        }

        await callDescribeApi(dataForApi)
    }
}

export function expandAllCountryDetailsOnClick() {
    this.setState({
        countrySeriesData: this.state.countrySeriesData.map(x => {
            let elem = document.getElementById("Series" + x['@id'])
            if (x.open === "+") {
                x.open = "-"
            }
            else {
                x.open = "+"
            }

            if (elem.style.height === "auto") {
                elem.style.height = "24px"
            }
            else {
                elem.style.height = "auto";
            }
            return x;
        })
    })

}

export function expandCountryDetailsOnClick(x) {
    return () => {
        let elem = document.getElementById("Series" + x['@id'])
        // this should be fixed
        this.setState({
            countrySeriesData: this.state.countrySeriesData.map(elem => {
                if (elem['@id'] === x['@id']) {
                    if (elem.open === "+") {
                        elem.open = "-"
                    }
                    else {
                        elem.open = "+"
                    }
                }
                return elem;
            })
        })

        if (elem.style.height === "auto") {
            elem.style.height = "24px"
        }
        else {
            elem.style.height = "auto";
        }
    }
}

export function getJsonWithImportantFields(x) {
    if (typeof (x) === 'object') {
        let tab = require(`./data/jsonSeriesData.json`);
        let data = []
        for (let y in x) {
            if (tab.filter(x => x === y).length > 0) {
                data.push(y + ": " + x[y]);
            }
        }
        return data.map(elem => { return <li key={x['@id'] + elem.split(" ")[1]}>{elem}</li> })
    }
}

export async function getSeriesJsonFromApi() {
    try {
        const dataForApi = {
            "countries": this.props.dataForSeries,
            "stat": this.state.clickedData.id
        }

        const text = await axios.post(config.statsApiUrl, dataForApi, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (text.status !== 200 && text.status !== 201) {
            throw new Error('Failed!');
        }

        var myWindow = window.open("", "MsgWindow");
        myWindow.document.write('<pre id="json"></pre>');
        myWindow.document.getElementById("json").innerHTML = JSON.stringify(text.data, undefined, 2);

    } catch (error) {
        console.log("ERROR");
    }
}

export async function getJsonDescribeOfUri() {
    const dataForApi = {
        "type": this.state.clickedData.label.split(" ")[0],
        "uri": this.state.clickedData.id
    }
    await callDescribeApi(dataForApi)
}

const callDescribeApi = async (dataForApi) => {
    try {
        const text = await axios.post(config.describeApiUrl, dataForApi, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        if (text.status !== 200 && text.status !== 201) {
            throw new Error('Failed!');
        }

        var myWindow = window.open("", "MsgWindow");
        myWindow.document.write('<pre id="json"></pre>');
        myWindow.document.getElementById("json").innerHTML = JSON.stringify(text.data, undefined, 2);

    } catch (error) {
        console.log("ERROR");
    }
}
