import React from 'react';
import './ConceptList.scss';
import ConceptItem from './ConceptItem/ConceptItem';



class ConceptList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.Concepts,
            loadCount: 10,
            displayData: []
        };
    }

    componentDidMount() {
        this.displayData()
    }


    displayData = async () => {
        const { data, loadCount } = this.state;
        const chunkOfData = await data.filter((data, index) => index < loadCount && index >= loadCount - 10)
        this.setState({ displayData: chunkOfData });
    }

    loadMore = async () => {
        await this.setState({ loadCount: this.state.loadCount + 10 });
        this.displayData()
    }

    loadLess = async () => {
        await this.setState({ loadCount: this.state.loadCount - 10 });
        this.displayData()
    }

    render() {
        return (
            <div className="linked-concepts-container">
                <h3 className="Title">
                    Extracted concepts:
                </h3>
                <ul>
                    {this.state.displayData.map((concept, index) => <ConceptItem concept={concept} key={index+this.state.loadCount}></ConceptItem>)}
                </ul>

                <div className="link-box">
                    {this.state.loadCount < this.state.data.length ? (
                        <p className="link next" onClick={this.loadMore}>Next</p>
                    ) : (
                            <p>Next</p>
                        )}
                    {this.state.loadCount > 10 ? (
                        <p className="link prev" onClick={this.loadLess}>Previous</p>
                    ) : (
                            <p>Previous</p>
                        )}
                </div>
            </div>
        );
    }
}


export default ConceptList;