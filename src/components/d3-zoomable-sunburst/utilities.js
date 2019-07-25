import React from 'react';
import axios from 'axios';
import Wheel from './img/wheel.png';
import './ZoomableSunburst.scss'

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

export function chooseState(p){
    if(this.state.lastNode === p.parent || this.state.lastNode === undefined){
        this.setSunState(true)
    }
    else if(p.parent !== null && this.state.lastNode === p.parent.parent){
        this.setSunState(true)
        this.setState({lastNode: p})
        this.setSunState(true)
    }
    else{
        this.setSunState(false)
    }
    this.setState({lastNode: p})
}

export function  selectImage(){
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

export function  loadConcepts(){
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

    return data.map(x => {
        let linkedConceptsSorted = []
        for (let k in x.linkedConcepts) {
            if (x.linkedConcepts[k].label === x.label) {
                linkedConceptsSorted.push(x.linkedConcepts[k])
            }
        }
        for (let k in x.linkedConcepts) {
            if (x.linkedConcepts[k].label !== x.label) {
                linkedConceptsSorted.push(x.linkedConcepts[k])
            }
        }
        return <p key={x.url}>
            <span>{x.label}</span> concept from {x.source}:
            {linkedConceptsSorted.map(y => {
                if (y.label !== x.label) {
                    return <span key={y.url} className="uri-link">
                        <br></br>
                        <a href={y.url}> {y.label} +</a>
                    </span>
                }
                return <i key={y.url} className="uri-link">
                    <br></br>
                    <a href={y.url}> {y.label}</a>
                </i>
            })}
        </p>
    })
}

export function  callForCountryApi(x){
    return async () => {
        try {
            const dataForApi = {
                "type": "Country",
                "uri": x['@id']
            }

            const text = await axios.post('http://34.66.148.181:8080/describe', dataForApi, {
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
}

export function  genOnClick(x){
    return () => {
        let elem = document.getElementById("Series" + x['@id'])
        if (elem.style.height === "auto") {
            elem.style.height = "24px"
        }
        else {
            elem.style.height = "auto";
        }
    }
}

export function  getJsonText(x){
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

export async function  reciveSeriesJsonFromApi(){
    try {
        const dataForApi = {
            "countries": this.props.dataForSeries,
            "stat": this.state.clickedData.id
        }

        const text = await axios.post('http://127.0.0.1:5002/stats', dataForApi, {
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

export async function  reciveJsonFromApi(){
    try {

        const dataForApi = {
            "type": this.state.clickedData.label.split(" ")[0],
            "uri": this.state.clickedData.id
        }

        const text = await axios.post('http://34.66.148.181:8080/describe', dataForApi, {
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
