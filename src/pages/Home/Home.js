import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Home.scss'
import infoImg from './rdiDvaws.png';

class Upload extends Component {
    state = {

    };

    render() {
        return (
            <div className="Home">
                <span className="Title">Sustainable Development Links</span>
                <p className="Description">
                Sustainable Development Links is a demo app that automatically extracts key concepts related to sustainable development from your text documents and links them to the most relevant sustainable development goals, targets, indicators and series.
                </p>
                <img className="main-image" src={infoImg} alt="Upload"></img>
                {/* <Row>
                    <Col sm={6}>
                        <p className="Description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mi orci, bibendum id feugiat sit amet, laoreet viverra arcu. Maecenas pulvinar mauris vitae iaculis suscipit. Phasellus scelerisque orci nec sollicitudin fringilla. Donec eu luctus metus, dictum sollicitudin dui. Nullam sit amet metus justo. Ut auctor dignissim orci eu congue.
                        </p>
                    </Col>
                    <Col sm={6}>
                        <p className="Description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mi orci, bibendum id feugiat sit amet, laoreet viverra arcu. Maecenas pulvinar mauris vitae iaculis suscipit. Phasellus scelerisque orci nec sollicitudin fringilla. Donec eu luctus metus, dictum sollicitudin dui. Nullam sit amet metus justo. Ut auctor dignissim orci eu congue.
                        </p>
                    </Col>
                </Row> */}
            </div>
        )
    }
}

export default Upload;