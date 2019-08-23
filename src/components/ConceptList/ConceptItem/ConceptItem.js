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
            <li className="event-list-item" id={this.props.concept.source[0].uri}>
                <div>
                    <h6 className="h6-concept-name">{this.props.concept.label}</h6>
                    {/* <span className="annotation">({this.props.concept.source})</span> */}
                </div>
                <div className="collapse-button">
                    <button
                        className=""
                        onClick={async () => { await this.props.handlerForOpen(this.props.concept.source[0].uri) }}
                        aria-expanded={open}>
                        {open ? (<p>-</p>) : (<p>+</p>)}
                    </button>
                </div>
                <Collapse in={open}>
                    <div id="example-collapse-text">
                        <div className="annotation">
                            <p>SOURCES:</p>
                            {
                                this.props.concept.source.map(x => <p>
                                    <a href={x.uri} target="_blank">{x.source}</a>
                                </p>)
                            }
                        </div> 
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