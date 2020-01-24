/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './Api.scss'

import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"


class Api extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        swagger: require('./swagger.json'),
        swaggerStat: require('./swaggerStat.json')
    };

    render() {
        return (
            <React.Fragment>
                <div className="api-container">
                    <div className="api-content">
                        <Row>
                            <Col lg={12}>
                                <SwaggerUI spec={this.state.swagger} /> 
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <SwaggerUI spec={this.state.swaggerStat} /> 
                            </Col>
                        </Row>

                    </div>
                </div>

            </React.Fragment>


        )
    }
}

export default Api;




