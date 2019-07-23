import React, { Component } from 'react';
import * as d3 from "d3";
import axios from 'axios';
import Wheel from './img/wheel.png';
import Goal01 from './img/01.png';
import Goal02 from './img/02.png';
import Goal03 from './img/03.png';
import Goal04 from './img/04.png';
import Goal05 from './img/05.png';
import Goal06 from './img/06.png';
import Goal07 from './img/07.png';
import Goal08 from './img/08.png';
import Goal09 from './img/09.png';
import Goal10 from './img/10.png';
import Goal11 from './img/11.png';
import Goal12 from './img/12.png';
import Goal13 from './img/13.png';
import Goal14 from './img/14.png';
import Goal15 from './img/15.png';
import Goal16 from './img/16.png';
import Goal17 from './img/17.png';
import './ZoomableSunburst.scss'


class ZoomableSunburst extends Component {
    componentDidMount() {
        this.drawChart();
    }


    state = {
        svgElement: '',
        lastPointedData: '',
        clickedData: {},
        selectedGoal: undefined,
        selectedGoalName: 'Sustainable Development Goals',
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

        const uris = [
            "http://data.un.org/kos/sdg/01",
            "http://data.un.org/kos/sdg/02",
            "http://data.un.org/kos/sdg/03",
            "http://data.un.org/kos/sdg/04",
            "http://data.un.org/kos/sdg/05",
            "http://data.un.org/kos/sdg/06",
            "http://data.un.org/kos/sdg/07",
            "http://data.un.org/kos/sdg/08",
            "http://data.un.org/kos/sdg/09",
            "http://data.un.org/kos/sdg/10",
            "http://data.un.org/kos/sdg/11",
            "http://data.un.org/kos/sdg/12",
            "http://data.un.org/kos/sdg/13",
            "http://data.un.org/kos/sdg/14",
            "http://data.un.org/kos/sdg/15",
            "http://data.un.org/kos/sdg/16",
            "http://data.un.org/kos/sdg/17",
        ]

        const mouseover = (p) => {
            parent.datum(p.parent || root);

            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });


            // console.log(p.data.concept)

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
            parent.datum(p.parent || root);

            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            if (this.state.clickedData.id === undefined) {
                this.setState({ selectedGoal: undefined, selectedGoalName: 'Sustainable Development Goals' })
            }

        }

        const clicked = (p) => {
            parent.datum(p.parent || root);


            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            // console.log(p.data.concept)
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



            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                .tween("data", d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                })
                .filter(function (d) {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                // .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 1 : 0.6) : 0)
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


        // let data = require('./data');
        let data = this.props.data;

        console.log(data)

        let format = d3.format(",d")

        const partition = data => {
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            return d3.partition()
                .size([2 * Math.PI, root.height + 1])(root);
        }

        const root = partition(data);

        let colors = {
            "http://data.un.org/kos/sdg/01": "rgb( 229, 36,59 )",
            "http://data.un.org/kos/sdg/02": "rgb( 221, 166,58 )",
            "http://data.un.org/kos/sdg/03": "rgb( 76, 159, 56)",
            "http://data.un.org/kos/sdg/04": "rgb( 197, 25,45 )",
            "http://data.un.org/kos/sdg/05": "rgb( 255, 58, 33)",
            "http://data.un.org/kos/sdg/06": "rgb( 38, 189, 226)",
            "http://data.un.org/kos/sdg/07": "rgb( 252, 195, 11)",
            "http://data.un.org/kos/sdg/08": "rgb( 162, 25, 66)",
            "http://data.un.org/kos/sdg/09": "rgb( 253, 105, 37)",
            "http://data.un.org/kos/sdg/10": "rgb( 221, 19, 103)",
            "http://data.un.org/kos/sdg/11": "rgb( 253, 157, 36)",
            "http://data.un.org/kos/sdg/12": "rgb( 191, 139, 46)",
            "http://data.un.org/kos/sdg/13": "rgb( 63, 126, 68)",
            "http://data.un.org/kos/sdg/14": "rgb( 10, 151, 217)",
            "http://data.un.org/kos/sdg/15": "rgb( 86, 192, 43)",
            "http://data.un.org/kos/sdg/16": "rgb( 0, 104, 157)",
            "http://data.un.org/kos/sdg/17": "rgb( 25, 72, 106)",
        }

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
            .style("cursor", "pointer")
            .on("click", clicked)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        path.append("title")
            .text(d => {
                return `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`;
            });

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
            .text(d => d.data.label.substr(d.data.label.indexOf(" ") + 1))
            .style("font-size", (d) => {
                if(d.data.label.split(" ")[0] !== 'Series'){
                    return "20px"
                }
                return "12px"
            });

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
        let images = {
            "http://data.un.org/kos/sdg/01": Goal01,
            "http://data.un.org/kos/sdg/02": Goal02,
            "http://data.un.org/kos/sdg/03": Goal03,
            "http://data.un.org/kos/sdg/04": Goal04,
            "http://data.un.org/kos/sdg/05": Goal05,
            "http://data.un.org/kos/sdg/06": Goal06,
            "http://data.un.org/kos/sdg/07": Goal07,
            "http://data.un.org/kos/sdg/08": Goal08,
            "http://data.un.org/kos/sdg/09": Goal09,
            "http://data.un.org/kos/sdg/10": Goal10,
            "http://data.un.org/kos/sdg/11": Goal11,
            "http://data.un.org/kos/sdg/12": Goal12,
            "http://data.un.org/kos/sdg/13": Goal13,
            "http://data.un.org/kos/sdg/14": Goal14,
            "http://data.un.org/kos/sdg/15": Goal15,
            "http://data.un.org/kos/sdg/16": Goal16,
            "http://data.un.org/kos/sdg/17": Goal17,
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

        return data.map(x => (
            <p key={x.url}>
                <span>{x.label}</span> concept from {x.source}:
                {x.linkedConcepts.map(y => {
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
        ))
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="Title">
                    Linked concepts:
                </h3>
                <div className="grid-container">
                    <div id={"ZoomableSunburst"} className="grid-item">
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
                                {this.state.clickedData.id ? (
                                    <React.Fragment>

                                        <p>
                                            <span>LABEL: </span>
                                            {this.state.clickedData.label}
                                        </p>
                                        {this.state.clickedData.label !== undefined && this.state.clickedData.label.split(" ")[0] === "Series" ? (
                                            <p onClick={this.reciveSeriesJsonFromApi} className="uri-link">
                                                <span>GET DATA: </span>information about the data series for the most suitable countries
                                        </p>) :
                                            (<React.Fragment></React.Fragment>)
                                        }
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
                                ) : (<React.Fragment></React.Fragment>)}


                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ZoomableSunburst;