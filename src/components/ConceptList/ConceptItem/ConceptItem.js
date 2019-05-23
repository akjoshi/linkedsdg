import React from 'react';
import './ConceptItem.scss';

const ConceptItem = props => (
    <li key={props.concept.id} className="event-list-item">
       <a href={props.concept.id}> <p>{props.concept.label}</p> </a> 
       <p>{props.concept.context}</p>
    </li>
);

export default ConceptItem;