import * as d3 from "d3";
import React from 'react';
import axios from 'axios';
import { selectFilter } from 'react-bootstrap-table2-filter';
import { textFilter } from 'react-bootstrap-table2-filter';

let config = require('../../config.json');

export async function drawChart() {
    const uris = require('./data/sdgURIS.json')
    const colors = require(`./data/sdgColors.json`)
    let data = this.props.data;
    let width = 932
    let radius = 155.33333333333334
    let clickEnevtBlock = false;
    let arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))


    const mouseover = (p) => {
        let box = document.getElementById("informationFromTheSun");
        if (box.clientHeight > 0) {
            box.setAttribute("style", "height:" + box.clientHeight + "px");
        }

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
        this.setState({
            dataForPreview: undefined
        })
        if (this.state.clickedData.id === undefined) {
            this.setState({ selectedGoal: undefined, selectedGoalName: 'Sustainable Development Goals' })
        }
        let box = document.getElementById("informationFromTheSun");
        if (box.clientHeight > 0) {
            box.setAttribute("style", "height:auto");
        }

    }

    const clicked = async (p) => {
        parent.datum(p.parent || root);

        this.chooseState(p)


        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        let openKeyWords = [];
        for (let keywordUri in p.data.keywords) {
            openKeyWords.push({
                open: false,
                uri: keywordUri,
            })
        }

        this.setState({
            clickedData: {
                id: p.data.id,
                name: p.data.name,
                label: p.data.label,
                keyWords: p.data.keywords
            },
            keyWords: openKeyWords,
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

            let middleTitle = this.state.sunState;
            middleTitle = middleTitle + "s";
            if (middleTitle === 'seriess') {
                middleTitle = "Series";
            }

            middleTitle = "BACK TO " + middleTitle.toUpperCase();

            midTitle.text(function (d) { return middleTitle })
                .attr("x", 0)
                .attr("y", "10px")
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
            .attrTween("d", d => () => arc(d.current))
            .on('end', function () {
                clickEnevtBlock = false;
            });


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
                console.log(this.props.dataForSeries)
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
                // text.data['@graph'].sort(function (a, b) {
                //     let textA = a.geoAreaName.toUpperCase();
                //     let textB = b.geoAreaName.toUpperCase();
                //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                // });

                // text.data['@graph'] = text.data['@graph'].map(x => {return {...x , "open": "+"}})

                // create columns 

                let columns = constructColumns(text)

                await this.setState({
                    countrySeriesData: text.data,
                    columns: columns
                })

            } catch (error) {
                console.log("ERROR");
            }
        }
        else {
            this.setState({ countrySeriesData: [] })
        }
    }

    const partition = data => {
        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        return d3.partition()
            .size([2 * Math.PI, root.height + 1])(root);
    }

    const arcVisible = (d) => {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    const labelVisible = (d) => {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    const labelTransform = (d) => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    const root = partition(data);

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
            return "pointer"
        })
        .on("click", d => {
            if (arcVisible(d.current) || (d.children === undefined && arcVisible(d.current))) {
                if (clickEnevtBlock === false) {
                    clicked(d)
                    clickEnevtBlock = true;
                }
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
            return d.data.sunburst_label;
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


    return svg.node();
}

export function constructColumns(text) {

    let dataCodes = require('./DataSeriesComponent/dataCodes.json');



    let columns = [
        {
            dataField: 'id',
            text: 'ID',
            filter: textFilter(),
            hidden: true
        }
    ]


    let notRelevantFields = [
        "@id",
        "@type",
        "measureType",
        "unitMeasure",
        "geoAreaCode",
        "yearCode"
    ]



    let geoArea = new Set();
    for (let obj of text.data['@graph']) {
        geoArea.add(dataCodes["geoAreaCode"]["codes"][obj["geoAreaCode"]].label);
    }

    let geoAreaMap = {};
    for (let key of geoArea) {
        geoAreaMap[key] = key;
    }

    const ordered = {};
    Object.keys(geoAreaMap).sort().forEach(function (key) {
        ordered[key] = geoAreaMap[key];
    });

    geoAreaMap = ordered
 
    columns.push({
        dataField: "country",
        text: "country",
        formatter: cell => cell,
        filter: selectFilter({
            options: geoAreaMap
        })
    })

    let years = new Set();
    for (let obj of text.data['@graph']) {
        years.add(obj["yearCode"])
    }

    let yearsMap = {};
    for (let key of years) {
        yearsMap[key] = key;
    }

    columns.push({
        dataField: "yearCode",
        text: "year",
        formatter: cell => yearsMap[cell],
        filter: selectFilter({
            options: yearsMap
        })
    })

    let props = [];

    for (let obj of text.data['@graph']) {
        for (let key in obj) {
            if (notRelevantFields.includes(key) || key === obj['measureType']) {
                continue;
            }
            props.push(key)
            notRelevantFields.push(key)
        }
    }

    for (let prop of props) {
        let set = new Set();

        for (let obj of text.data['@graph']) {
            set.add(obj[prop])
        }

        let setMap = {};
        for (let key of set) {
            setMap[key] = dataCodes[prop]["codes"][key].label;
        }

        columns.push({
            dataField: prop,
            text: dataCodes[prop].label,
            formatter: cell => setMap[cell],
            filter: selectFilter({
                options: setMap
            })
        })
    }


    columns.push(
        {
            dataField: 'value',
            sort: true,
            text: "value",
            headerFormatter: (column, colIndex, components) => {
                return <div>
                    <p>
                        value
                            <span className="sort-arrows">
                            &#x25B2; &#x25BC;
                            </span>
                    </p>
                    <p className="series-unit">
                        {text.data['@graph'][0] !== undefined ?
                            dataCodes["unitsCode"]["codes"][text.data['@graph'][0].unitMeasure].label :
                            <React.Fragment>-</React.Fragment>}
                    </p>
                </div>
            },
            sortFunc: (a, b, order, dataField) => {
                if (order === 'asc') {
                    return b - a;
                }
                return a - b; // desc
            }
        }
    )

    columns.push(
        {
            dataField: 'unit',
            text: "unit of measurement"
        }
    )

    columns.push(
        {
            dataField: 'measureType',
            text: 'measure type',
            hidden: true
        }
    )

    columns.push(
        {
            dataField: 'keyWords',
            text: 'key words',
            hidden: true
        }
    )


    return columns;
}