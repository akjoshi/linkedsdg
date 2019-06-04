import React from 'react';
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
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
                label: data[key]['linkedConcept'].map(x => x.label),
                source: data[key]['linkedConcept'].map(x => x.source)
            })
        }
        
        return text.map((x, index) => (
                            <li key={index} className="collapse-item">
                            {index+1}. <a href={x['id']}> {x.label} </a> <span className="annotation">({x.source})</span> 
                            </li>
                        ));
    };

    reciveJsonFromApi = async () =>{
        console.log("CALL API")
        try {
            const dataForApi = {
                "type": this.props.data.type,
	            "uri": this.props.data.id
            }

            
            let dataInJson = JSON.stringify(dataForApi)

            console.log(dataInJson)


            const text = await axios.post('http://35.231.89.123:8080/describe', dataInJson, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (text.status !== 200 && text.status !== 201) {
                throw new Error('Failed!');
            }
            console.log(text);
            // let temp = window.open("data:text/json," + encodeURIComponent(text), "_blank");
            // temp.focus();
        } catch (error) {
            console.log("ERROR");
        }
    }

    render() {
        const { open } = this.state;
        return (
            <li className="linked-concept-list-item">
                <div>
                    <p className="link" onClick={this.reciveJsonFromApi}>
                    <span className="annotation">({this.props.data.type})</span>
                    {this.props.data.label}
                    </p> 
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