import React, { Component } from 'react';
import * as d3 from "d3";
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Wheel from './img/wheel.png';
import './ZoomableSunburst.scss'


class ZoomableSunburst extends Component {
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
    }

    setSunState(deeper = true) {
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
            else if (this.state.sunState === "series") {
                this.setState({ sunState: "dataseries" })
            }
        }
        else {
            if (this.state.sunState === "dataseries") {
                this.setState({ sunState: "series" })
            }
            else if (this.state.sunState === "series") {
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

    reciveSeriesJsonFromApi = async () => {
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

    reciveJsonFromApi = async () => {
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

    drawChart = async () => {
        const uris = require('./sdgURIS.json')

        const mouseover = (p) => {
            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            this.setState({
                dataForPreview: {
                    id: p.data.id,
                    name: p.data.name,
                    label: p.data.label,
                    concept: p.data.concept
                }
            })
            if (p.parent === null) {
                this.setState({ selectedGoal: p.data.id, selectedGoalName: p.data.name })
            }
            else if (this.state.selectedGoal === undefined) {
                if (uris.includes(p.data.id)) {
                    this.setState({ selectedGoal: p.data.id, selectedGoalName: p.data.name })
                }
                else if (p.parent !== null && uris.includes(p.parent.data.id)) {

                    this.setState({ selectedGoal: p.parent.data.id, selectedGoalName: p.parent.data.name })
                }
            }
        }

        const mouseout = (p) => {
            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            this.setState({
                dataForPreview: undefined
            })
            if (this.state.clickedData.id === undefined) {
                this.setState({ selectedGoal: undefined, selectedGoalName: 'Sustainable Development Goals' })
            }

        }

        const clicked = async (p) => {
            parent.datum(p.parent || root);

            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            this.setState({
                clickedData: {
                    id: p.data.id,
                    name: p.data.name,
                    label: p.data.label,
                    concept: p.data.concept
                }
            })
            if (p.parent === null) {
                this.setState({ selectedGoal: p.data.id, selectedGoalName: p.data.name })
            }
            else if (this.state.selectedGoal === undefined) {
                if (uris.includes(p.data.id)) {
                    this.setState({ selectedGoal: p.data.id, selectedGoalName: p.data.name })
                }
                else if (p.parent !== null && uris.includes(p.parent.data.id)) {

                    this.setState({ selectedGoal: p.parent.data.id, selectedGoalName: p.parent.data.name })
                }
            }

            const t = g.transition().duration(750);

            if (p.data.label !== undefined) {

                let midTitle = g.select("text#middleTitle");

                let middleTitle = p.data.label.split(" ");
                middleTitle = middleTitle[0] + "s";
                if (middleTitle === 'Seriess') {
                    middleTitle = "Series";
                }

                middleTitle = "BACK TO " + middleTitle.toUpperCase();

                midTitle.text(function (d) { return middleTitle })
                    .attr("x", 0)
                    .attr("y", 0)

                var height = "10px";

                midTitle
                    .attr("y", height)
            }
            else {
                g.select("text#middleTitle")
                    .text(function (d) { return "" })
                    .attr("x", 0)
                    .attr("y", 0)
            }

            path.transition(t)
                .tween("data", d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                })
                .filter(function (d) {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                .attrTween("d", d => () => arc(d.current));


            if (p.children !== undefined) {
                path.transition(t)
                    .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 1 : 0.6) : 0)
            }

            label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
                .attr("fill-opacity", d => +labelVisible(d.target))
                .attrTween("transform", d => () => labelTransform(d.current));


            if (this.state.clickedData.label !== undefined && this.state.clickedData.label.split(" ")[0] === "Series") {
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
                    text.data['@graph'].sort(function (a, b) {
                        let textA = a.geoAreaName.toUpperCase();
                        let textB = b.geoAreaName.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    this.setState({ countrySeriesData: text.data['@graph'] })

                } catch (error) {
                    console.log("ERROR");
                }
            }
            else {
                this.setState({ countrySeriesData: [] })
            }
        }

        let width = 932
        let radius = 155.33333333333334
        let arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))


        let data = this.props.data;

        const partition = data => {
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            return d3.partition()
                .size([2 * Math.PI, root.height + 1])(root);
        }

        const root = partition(data);

        let colors = require(`./sdgColors.json`)

        root.each(d => d.current = d);

        const svg = d3.select("#ZoomableSunburst")
            .append("svg")
            .attr("viewBox", [0, 0, width, width])
            .style("font", "10px sans-serif");

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${width / 2})`);

        const path = g.append("g")
            .selectAll("path")
            .data(root.descendants().slice(1))
            .join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return colors[d.data.id]; })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 1 : 0.6) : 0)
            .attr("d", d => arc(d.current));

        path.filter(d => d)
            .style("cursor", d => {
                if (!arcVisible(d.current)) {
                    return ""
                }
                return "pointer"
            })
            .on("click", d => {
                if (arcVisible(d.current || (d.children === undefined && arcVisible(d.current)))) {
                    clicked(d)
                    mouseout(d)
                }
            })
            .on("mouseover", d => {
                if (arcVisible(d.current) || (d.children === undefined && arcVisible(d.current))) {
                    mouseover(d)
                }
            })
            .on("mouseout", d => {
                if (arcVisible(d.current) || (d.children === undefined && arcVisible(d.current))) {
                    mouseout(d)
                }
            })

        const label = g.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
            .selectAll("text")
            .data(root.descendants().slice(1))
            .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => {
                return d.data.label;
            })
            .style("font-size", (d) => {
                if (d.data.label.split(" ")[0] !== 'Series') {
                    return "16px"
                }
                return "12px"
            })


        let parent = g.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")

        parent = g
            .append("text")
            .style("text-anchor", "middle")
            .attr("id", "middleTitle")
            .text(function (d) { return "" })
            .style("font-size", "28px")
            .style("font-weight", "700")
            .style("cursor", "pointer")
            .attr("pointer-events", "all")
            .on("click", clicked);

        function arcVisible(d) {
            return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
        }

        function labelVisible(d) {
            return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }

        function labelTransform(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2 * radius;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }

        return svg.node();
    }

    selectImage = () => {
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

    loadConcepts = () => {
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

    callForCountryApi = (x) => {
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


    genOnClick = (x) => {
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

    getJsonText = (x) => {
        if (typeof (x) === 'object') {
            let tab = require(`./jsonSeriesData.json`);
            let data = []
            for (let y in x) {
                if (tab.filter(x => x === y).length > 0) {
                    data.push(y + ": " + x[y]);
                }
            }
            return data.map(elem => { return <li key={x['@id'] + elem.split(" ")[1]}>{elem}</li> })
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
                        {this.state.clickedData.label !== undefined && this.state.clickedData.label.split(" ")[0] === "Series" ? (
                            <div className="country-series-info">
                                <h4>Values</h4>
                                <Row >
                                    <Col>Name</Col>
                                    <Col>Value </Col>
                                    <Col>Units </Col>
                                    <Col xs={1}></Col>
                                </Row>
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