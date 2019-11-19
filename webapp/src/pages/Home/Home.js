import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Home.scss'
import infoImg from './rdiDvaws2.png';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button'

class Upload extends Component {
    render() {
        return (
            <div className="Home">
                <Row className="home-content">
                    <Col lg={4} className="side-box">
                        <h3 className="title">LinkedSDG</h3>
                        <p className="Description">
                            A demo app that automatically extracts key concepts related to sustainable development from your text documents and links them to the most relevant sustainable development goals, targets, indicators and series.
                        </p>
                        <NavLink to="/upload">
                            <Button variant="primary" className="start-button">
                                START
                            </Button>    
                        </NavLink>
                    </Col>
                    <Col lg={8} className="main-image">
                        <img   src={infoImg} alt="Upload"></img>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Upload;