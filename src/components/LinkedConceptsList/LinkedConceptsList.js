import React from 'react';
import './LinkedConceptsList.scss';
import ConceptItem from './ConceptItem/ConceptItem';

const LinkedConceptsList = props => (
    <React.Fragment>
    <h3 className="Title">Data linked with concepts</h3>
    <ul> 
         {/* Add sorting by weight */}
        {props.Data.map( (data, index) => <ConceptItem data={data} key={index}></ConceptItem>)}
    </ul>
    </React.Fragment>
);

export default LinkedConceptsList;