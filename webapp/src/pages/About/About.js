/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Logo from './LinkedSDG_square.jpg';

import './About.scss'


class About extends Component {
    constructor(props) {
        super(props);
    }

    state = {
    };

    render() {
        return (
            <React.Fragment>
                <div className="about-container">
                    <div className="about-content">
                        <Row>
                            <Col lg={12}>
                                <Row>
                                    <Col lg={8}>

                                        <h3 className="title">About</h3>
                                        <p className="Description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tristique libero vitae pellentesque finibus. Nullam enim tortor, lobortis id turpis id, posuere vehicula purus. Nam gravida commodo libero, sed iaculis justo tristique aliquet. Aliquam ut lobortis justo. Sed sed sodales sapien, vel porttitor arcu. In aliquet ut tellus a pellentesque. Etiam varius lorem eu dolor elementum, eu pellentesque diam dictum. Morbi vulputate mauris non aliquet vehicula. Donec eget ligula eu libero tempus faucibus. Phasellus porttitor, enim id scelerisque rutrum, leo nunc blandit justo, sed interdum eros augue eget felis. Cras posuere, ipsum sit amet eleifend maximus, augue urna finibus augue. </p>

                                    </Col>
                                    <Col lg={4} className="main-image">

                                        <img src={Logo} alt="Upload"></img>
                                    </Col>
                                </Row>
                                
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12}>
                                <h3 className="title">Contributors</h3>
                                <p className="Description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tristique libero vitae pellentesque finibus. Nullam enim tortor, lobortis id turpis id, posuere vehicula purus. Nam gravida commodo libero, sed iaculis justo tristique aliquet. Aliquam ut lobortis justo. Sed sed sodales sapien, vel porttitor arcu. In aliquet ut tellus a pellentesque. Etiam varius lorem eu dolor elementum, eu pellentesque diam dictum. Morbi vulputate mauris non aliquet vehicula. Donec eget ligula eu libero tempus faucibus. Phasellus porttitor, enim id scelerisque rutrum, leo nunc blandit justo, sed interdum eros augue eget felis. Cras posuere, ipsum sit amet eleifend maximus, augue urna finibus augue. </p>

                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12}>
                                <h3 className="title">Contact</h3>
                                <p className="Description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tristique libero vitae pellentesque finibus. Nullam enim tortor, lobortis id turpis id, posuere vehicula purus. Nam gravida commodo libero, sed iaculis justo tristique aliquet. Aliquam ut lobortis justo. Sed sed sodales sapien, vel porttitor arcu. In aliquet ut tellus a pellentesque. Etiam varius lorem eu dolor elementum, eu pellentesque diam dictum. Morbi vulputate mauris non aliquet vehicula. Donec eget ligula eu libero tempus faucibus. Phasellus porttitor, enim id scelerisque rutrum, leo nunc blandit justo, sed interdum eros augue eget felis. Cras posuere, ipsum sit amet eleifend maximus, augue urna finibus augue. </p>

                            </Col>
                        </Row>
                    </div>
                </div>

            </React.Fragment>


        )
    }
}

export default About;