import React, { Component } from 'react';
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";
import './PrivateDashboard.scss';
import schemaString from '../../schema/objects'
import SplitPane from 'react-split-pane'
import axios from 'axios';


class PrivateDashboard extends Component {

  state = {
    id: "",
    tabs: undefined,
    showObjects: true,
  }

  // componentDidMount = () => { 


  //   /// send request 
  //   // Make a request for a user with a given ID
  //   this.getId();
  //   // .then(function (response) {
  //   //   // handle success
  //   //   console.log(response);
  //   //   this.setState({id: response})
  //   // }) 


  // }

  getId = async () => {
    let res = await axios.get('http://localhost:4000/api/dynamic');
    if (res.status === 200) {
      this.setState({
        id: res.data, tabs: [
          {
            "endpoint": "http://localhost:4000/graphql" + res.data,
            "query": "defaultQuery",
          }
        ]
      })
    }
  }

  setPlaygroundHeight = (e) => { 
  }

  render() {
    return (
            <Provider store={store}>
              <Playground endpoint={"http://localhost:4000/graphql"} className="playground" id="playground"
                tabs={this.state.tabs}
              />
            </Provider>

    )
  }
}


export default PrivateDashboard;

