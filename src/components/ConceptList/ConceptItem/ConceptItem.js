/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import Collapse from 'react-bootstrap/Collapse'
import './ConceptItem.scss';


class ConceptItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
        };
    }

    render() {
        let open = this.props.concept.open;
        return (
            <li className="event-list-item" id={this.props.concept.id} 
            onClick={ () => {  this.props.handlerForOpen(this.props.concept.id) }}
            >
                <div>
                    <h6 className="h6-concept-name">{this.props.concept.label}</h6>
                    <div className="sources"> 
                            {
                                this.props.concept.source.map((x,index) => <p key={index} onClick={ (event) => {
                                    event.stopPropagation();
                                 }}>
                                    <a href={x.uri} target="_blank">{x.source}</a>
                                </p>)
                            }
                        </div>  
                </div>
                <div className="collapse-button">
                    <button
                        className=""
                        aria-expanded={open}>
                        {open ? (<p>&#x2303;</p>) : (<p className="open-arrow">&#x2303;</p>)}
                    </button>
                </div>
                <Collapse in={open}>
                    <div id="example-collapse-text">
                        
                        <ul className="concept-list">
                            {this.props.concept.context.map((x, index) => <li key={index} className="collapse-item">{index + 1}. {x['contextl']} <strong>{x['phrase']}</strong> {x['contextr']}</li>)}
                        </ul>
                    </div>
                </Collapse>
            </li>
        );
    }
}


export default ConceptItem;