import React from 'react';
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import './ConceptItem.scss';


class ConceptItem extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,

        };
    }
    render() {
        const { open } = this.state;
        return (
            <li className="event-list-item">
                <div>
                    <a href={this.props.concept.id}> {this.props.concept.label}</a> 
                    <span className="annotation">({this.props.concept.source})</span>
                </div>
                <div className="collapse-button">
                <Button
                    onClick={() => this.setState({ open: !open })}
                    aria-expanded={open}>
                    {this.state.open ? ( <p>-</p> ) : ( <p>+</p> ) }
                </Button>
                </div>
                <Collapse in={this.state.open}>
                    <div id="example-collapse-text">
                        {this.props.concept.context.map((x, index) => <p key={index}>{x['context']}</p>)}
                    </div>
                </Collapse>
            </li>
        );
    }
}


export default ConceptItem;