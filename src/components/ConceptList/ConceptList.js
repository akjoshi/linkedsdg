import React from 'react';
import './ConceptList.scss';
import ConceptItem from './ConceptItem/ConceptItem';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



class ConceptList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.Concepts,
            loadCount: 10,
            displayData: []
        };
    }

    componentDidMount() {
        this.displayData()
    }


    displayData = async () => {
        const { data, loadCount } = this.state;
        const chunkOfData = await data.filter((data, index) => index < loadCount && index >= loadCount - 10)
        this.setState({ displayData: chunkOfData });
    }

    loadMore = async () => {
        await this.setState({ loadCount: this.state.loadCount + 10 });
        this.displayData()
    }

    loadLess = async () => {
        await this.setState({ loadCount: this.state.loadCount - 10 });
        this.displayData()
    }

    handleDownload = async () => {
        let filename = "export.json";
        let contentType = "application/json;charset=utf-8;";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.state.data)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
        } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.state.data));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        }
    }

    render() {
        return (
            <div className="linked-concepts-container">
                <Row>
                    <Col>
                        <h3 className="Title">
                            Extracted concepts:
                        </h3>
                    </Col>
                    <Col className="download-button">
                        <Button variant="primary" onClick={this.handleDownload}>
                            ⤓ Download
                        </Button>
                    </Col>
                </Row>

                <ul>
                    {this.state.displayData.map((concept, index) => <ConceptItem concept={concept} key={index + this.state.loadCount}></ConceptItem>)}
                </ul>

                <div className="link-box">
                    {this.state.loadCount < this.state.data.length ? (
                        <p className="link next" onClick={this.loadMore}>Next</p>
                    ) : (
                            <p>Next</p>
                        )}
                    {this.state.loadCount > 10 ? (
                        <p className="link prev" onClick={this.loadLess}>Previous</p>
                    ) : (
                            <p>Previous</p>
                        )}
                </div>
            </div>
        );
    }
}


export default ConceptList;