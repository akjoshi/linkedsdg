import React, { Component } from 'react';
import * as d3 from "d3";
import './ZoomableSunburst.scss'

class ZoomableSunburst extends Component {
    componentDidMount() {
        this.drawChart();
    }


    state = {
        svgElement: '',
    }




    drawChart = async () => {
        let width = 932
        let radius = 155.33333333333334
        let arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))


        let data = require('./data');

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

        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);

        path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.label).reverse().join("/")}\n${format(d.value)}`);

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
            .text(d => d.data.label);

        const parent = g.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked);

        function clicked(p) {
            console.log(p)
            parent.datum(p.parent || root);

            root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            const t = g.transition().duration(750);

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
                .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 1 : 0.6) : 0)
                .attrTween("d", d => () => arc(d.current));

            label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
                .attr("fill-opacity", d => +labelVisible(d.target))
                .attrTween("transform", d => () => labelTransform(d.current));
        }

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








    render() {
        return (
            <div id={"ZoomableSunburst"} className="ZoomableSunburst">
            </div>
        )
    }
}

export default ZoomableSunburst;