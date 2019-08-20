/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import * as d3 from "d3";
import './BubbleChart.scss';

class BubbleChart extends React.Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart = async () => {
        const clicked = async (p) => {
            this.props.handlerForOpen(p.data.id)

            let myElement = document.getElementById(p.data.id);
            let w = window.innerWidth;
            if (w < 992) {
                myElement.scrollIntoView(true);
            }
            else {
                var topPos = myElement.offsetTop - document.getElementById("keywords-list-id").offsetTop;
                document.getElementById("keywords-list-id").scrollTop = topPos;
            }
        }

        let data = [];
        let color = d3.scaleOrdinal(data.map(d => d.group), d3.schemePastel1);
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


        data.sort((a, b) => (a.value < b.value) ? 1 : -1)
        data = data.slice(0, 30);

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
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
            .attr("id", d => (d.data.id))
            .on("mouseover", function (d) {
                d3.select(this).select("text").remove()
                d3.select(this).raise()
                    .attr("fill-opacity", 1)
                    .append("text")
                    .attr("pointer-events", "none")
                    .attr("y", (d, i, nodes) => {

                        return `${(d.r / d.data.name.length) / 2 + 5}px`;
                    })
                    .text(d.data.name)
                    .style("font-size", `${(d.r / d.data.name.length) * 2.2 + 20}px`)
                    .style("fill", "black");

            })
            .on("mouseout", function (d) {
                svg.selectAll("g")
                    .attr("fill-opacity", 1);

                d3.select(this).select("text").remove()
                d3.select(this)
                    .append("text").raise()
                    .attr("pointer-events", "none")
                    .attr("y", (d, i, nodes) => {
                        return `${(d.r / d.data.name.length) / 2}px`;
                    })
                    .text(d.data.name)
                    .style("font-size", `${(d.r / d.data.name.length) * 2.2}px`)
                    .style("fill", "#555555");
            });


        leaf.append("circle")
            .attr("r", d => d.r)
            .attr("fill-opacity", 0.7)
            .attr("fill", d => color(d.data.group))
            .style("cursor", "pointer")
            .on("click", clicked)

        leaf.append("text")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => {
                if(d.data.name !== undefined){
                    return `${(d.r / d.data.name.length) / 2}px`;
                }
                else{
                    return `${(d.r) / 2}px`;
                }
            })
            .text(d => { return d.data.name })
            .style("font-size", d => {
                if(d.data.name !== undefined) {
                    return `${(d.r / d.data.name.length) * 2.2}px`;
                }
                else{
                    return `${(d.r) * 2.2}px`;
                }
            })
            .style("fill", "#555555");



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