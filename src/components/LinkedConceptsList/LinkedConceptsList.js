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
            <React.Fragment>
                <h3 className="Title">Data linked with concepts</h3>
                <ul>
                    {this.state.displayData.map((data, index) => <ConceptItem data={data} key={index}></ConceptItem>)}
                </ul>

                {this.state.loadCount < this.state.data.length ? (
                    <p onClick={this.loadMore}>Next</p>
                ) : (
                        <p> Next but not working</p>
                    )}

                {this.state.loadCount > 10 ? (
                    <p onClick={this.loadLess}>Previous</p>
                ) : (
                        <p> Previous but not working</p>
                    )}
            </React.Fragment>
        );
    }
}

export default LinkedConceptsList;