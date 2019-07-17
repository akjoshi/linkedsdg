/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import * as d3 from "d3";
import './BubbleChart.scss';

class BubbleChart extends React.Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart = async () => {
        let data = (await d3.csv("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.csv", ({ id, value }) => ({ name: id.split(".").pop(), title: id.replace(/\./g, "/"), group: id.split(".")[1], value: +value })))
        let color = d3.scaleOrdinal(data.map(d => d.group), d3.schemeCategory10);
        let format = d3.format(",d");
        let width = 932;
        let height = width;

        data = this.props.data.map(x => {
            x.value = x.weight;
            x.name = x.label;
            x.group = x.source;
            x.title = x.id;
            return x;
        })

        const getSize  = ( d) => {
            var bbox = this.getBBox(),
                cbbox = this.parentNode.getBBox(),
                scale = Math.min(cbbox.width/bbox.width, cbbox.height/bbox.height);
            d.scale = scale;
          }


        data.sort((a, b) => (a.value < b.value) ? 1 : -1)
        data = data.slice(0,30);

        const pack = data => d3.pack()
            .size([width - 2, height - 2])
            .padding(3)(d3.hierarchy({ children: data }).sum(d => d.value))

        const root = pack(data);

        const svg = d3.select("#BubbleChart")
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "middle");

        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        leaf.append("circle")
            .attr("r", d =>  d.r )
            .attr("fill-opacity", 0.7)
            .attr("fill", d => color(d.data.group));

        leaf.append("text")
            .attr("clip-path",  d => {return d.clipUid})
            .selectAll("tspan")
            .data(d => { return d.data.name.split(/(?=[A-Z][^A-Z])/g)})
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`) 
            .text(d => d)
            .style("font-size", `18px`)

        leaf.append("title")
            .text(d => `${d.data.title}\n${format(d.value)}`);

        return svg.node();
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <div id={"BubbleChart"} className="grid-item"></div>
                </div>
            </React.Fragment>
        );
    }
}


export default BubbleChart;