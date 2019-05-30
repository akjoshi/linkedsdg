import React from 'react';
import './ConceptList.scss';
import ConceptItem from './ConceptItem/ConceptItem';

const ConceptList = props => (
    <React.Fragment>
    <h3 className="Title">
        Found:
    </h3>
    <ul> 
        {props.Concepts.map( (concept, index) => <ConceptItem concept={concept} key={index}></ConceptItem>)}
    </ul>
    </React.Fragment>
);

export default ConceptList;