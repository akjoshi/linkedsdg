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
            <a href={this.props.concept.id}> <p>{this.props.concept.label}</p></a>
    
            <Button
            onClick={() => this.setState({ open: !open })}
            aria-controls="example-collapse-text"
            aria-expanded={open}>
            click
            </Button>
            <Collapse in={this.state.open}>
            <div id="example-collapse-text"> 
                {this.props.concept.context.map((x, index) => <p key={index}>{index} {x['context']}</p>)}
            </div>
            </Collapse>
        </li>
        );
      }
    }
    

export default ConceptItem;