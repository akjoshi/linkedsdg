import PropTypes from 'prop-types';
import React from 'react';
import Datamaps from 'datamaps';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './DataMaps.scss';
import Button from 'react-bootstrap/Button';
import ReactJson from 'react-json-view'
const MAP_CLEARING_PROPS = [
    'height', 'scope', 'setProjection', 'width'
];

const propChangeRequiresMapClear = (oldProps, newProps) => {
    return MAP_CLEARING_PROPS.some((key) =>
        oldProps[key] !== newProps[key]
    );
};

export default class Datamap extends React.Component {

    state = {
        displayJson: false,
    }

    static propTypes = {
        arc: PropTypes.array,
        arcOptions: PropTypes.object,
        bubbleOptions: PropTypes.object,
        bubbles: PropTypes.array,
        data: PropTypes.object,
        graticule: PropTypes.bool,
        height: PropTypes.any,
        labels: PropTypes.bool,
        responsive: PropTypes.bool,
        style: PropTypes.object,
        updateChoroplethOptions: PropTypes.object,
        width: PropTypes.any
    };

    handleCollapse = async () => {
        this.setState({ displayJson: !this.state.displayJson })
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeMap);
        console.log(this.props)
        this.drawMap();
    }

    componentDidUpdate() {
        this.drawMap();
    }

    componentWillReceiveProps(newProps) {
        if (propChangeRequiresMapClear(this.props, newProps)) {
            this.clear();
        }
    }

    componentWillUnmount() {
        this.clear();
        window.removeEventListener('resize', this.resizeMap);

    }

    clear() {
        const { container } = this.refs;

        for (const child of Array.from(container.childNodes)) {
            container.removeChild(child);
        }

        delete this.map;
    }

    drawMap() {
        const {
            arc,
            arcOptions,
            bubbles,
            bubbleOptions,
            data,
            graticule,
            labels,
            updateChoroplethOptions
        } = this.props;

        let map = this.map;

        if (!map) {
            map = this.map = new Datamaps({
                ...this.props,
                fills: {
                    defaultFill: "#BDBDBB",
                    areaColor: "#CADCEB",
                    countryColor: "#FCCAC6"
                },
                element: this.refs.container
            });
        } else {
            map.updateChoropleth(data, updateChoroplethOptions);
        }

        if (arc) {
            map.arc(arc, arcOptions);
        }

        if (bubbles) {
            map.bubbles(bubbles, bubbleOptions);
        }

        if (graticule) {
            map.graticule();
        }

        if (labels) {
            map.labels();
        }
    }

    resizeMap = () => {
        this.map.resize();
    }

    handleDownload = async () => {
        let dataForJson = [];
        for (let key in this.props.downloadData) {
            dataForJson.push(this.props.downloadData[key])
        }

        var myWindow = window.open("", "MsgWindow");
        myWindow.document.write('<pre id="json"></pre>');
        myWindow.document.getElementById("json").innerHTML = JSON.stringify(dataForJson, undefined, 2);
    }

    render() {
        const style = {
            display: 'relative',
            ...this.props.style
        };

        return <div className="dataMap">
            <h3 className="Title">
                Extracted geographical locations
            </h3>
            <div ref="container" id="containerForMap" style={style} > </div>
            <Row className="Datamap-info">
                <Col>
                    <i><span className="areaColor"></span> Regions</i>
                    <i><span className="countryColor"></span> Countries</i>
                </Col>
            </Row>
            <Row>
                <Col className="download-button">
                    <Button variant="primary" onClick={this.handleCollapse}>
                        {!this.state.displayJson ? <React.Fragment>Show data</React.Fragment> : <React.Fragment>Hide data</React.Fragment>}
                    </Button>
                </Col>
            </Row>

            {this.state.displayJson ?
                <React.Fragment>
                    <div className="json-with-data">
                        <ReactJson src={this.props.downloadData} collapsed={2} displayDataTypes={false} name={"Country data"} />
                    </div>
                    <Button variant="primary" onClick={this.handleDownload}>
                        ⤓ download
                        </Button>
                </React.Fragment>
                : <React.Fragment></React.Fragment>
            }
        </div>
    }

}
