import React from 'react';
import './LinkedConceptsList.scss';
import ConceptItem from './ConceptItem/ConceptItem';

class LinkedConceptsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.Data,
            loadCount: 10,
            displayData: []
        };
    }

    componentDidMount() {
        this.displayData()
    }


    displayData = async () => {
        const { data, loadCount } = this.state;
        const chunkOfData = await data.filter((data, index) => index < loadCount)
        this.setState({displayData: chunkOfData});
    }

    loadMore = async () => {
        await this.setState({ loadCount: this.state.loadCount+10 });
        this.displayData()
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="Title">Data linked with concepts</h3>
                <ul>
                    {this.state.displayData.map((data, index) => <ConceptItem data={data} key={index}></ConceptItem>)}
                </ul>
                <p onClick={this.loadMore}>Load 10 more</p>
            </React.Fragment>
        );
    }
}

export default LinkedConceptsList;