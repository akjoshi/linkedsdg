import React from 'react';
import './ConceptList.scss';
import ConceptItem from './ConceptItem/ConceptItem';

const ConceptList = props => (
    <ul> 
         {/* Add sorting by weight */}
        {props.Concepts.map( (concept, index) => <ConceptItem concept={concept} key={index}></ConceptItem>)}
    </ul>
);

export default ConceptList;