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

                <Row className="home-content">
                    <Col lg={4}>
                        <div className="Title">Sustainable Development Links</div>
                        <p className="Description">
                            Sustainable Development Links is a demo app that automatically extracts key concepts related to sustainable development from your text documents and links them to the most relevant sustainable development goals, targets, indicators and series.
                        </p>
                    </Col>
                    <Col lg={8}>
                        <img className="main-image" src={infoImg} alt="Upload"></img>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Upload;