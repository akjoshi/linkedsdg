import * as d3 from "d3";
import axios from 'axios';

export async function drawChart() {
    const uris = require('./data/sdgURIS.json')
    const colors = require(`./data/sdgColors.json`)
    let data = this.props.data;
    let width = 932
    let radius = 155.33333333333334
    let arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

        
    const mouseover = (p) => {
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


    return svg.node();
}

