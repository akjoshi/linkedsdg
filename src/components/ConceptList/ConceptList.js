import React from 'react';
import './ConceptList.scss';
import ConceptItem from './ConceptItem/ConceptItem';

const ConceptList = props => (
    <ul>
        {props.Concepts.map(concept => <ConceptItem concept={concept} key={concept.id}></ConceptItem>)}
    </ul>
);

export default ConceptList;