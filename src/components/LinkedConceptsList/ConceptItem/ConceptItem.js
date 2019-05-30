import React from 'react';
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import './ConceptItem.scss';


class ConceptItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    renderConcepts = (data) => {
        const text = [];

        for (var key in data) {
            text.push({
                id: key,
                weight: data[key].weight,
                label: data[key]['linkedConcept'].map(x => x.label)
            })
        }
        return text.map((x, index) => <li key={index} className="collapse-item">{index+1}. <a href={x['id']}> {x.label} </a></li>);
    };

    render() {
        const { open } = this.state;
        return (
            <li className="linked-concept-list-item">
                <div>
                    <a href={this.props.data.id}>
                    <span className="annotation">({this.props.data.type})</span>
                    {this.props.data.label}
                    </a> 
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
                        <ul>
                            {this.renderConcepts(this.props.data.concept)}
                        </ul>
                    </div>
                </Collapse>
            </li>
        );
    }
}


export default ConceptItem;