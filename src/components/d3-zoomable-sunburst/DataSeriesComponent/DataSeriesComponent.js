
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './DataSeriesComponent.scss'

class DataSeriesComponent extends Component {
  constructor(props) {
    super(props);
  }



  state = ({ 
  });


  render() {
    return (
      <div className="table-series">

        {this.props.data['@graph'] ?
          <BootstrapTable keyField='id'  data={this.props.data['@graph'].map((cube, index) => {
            let dataCodes = require('./dataCodes.json'); 
            let returnObject = {
              id: index,
              country: dataCodes["geoAreaCode"]["codes"][cube.geoAreaCode].label,
              value: cube[cube["measureType"]],
              unit: dataCodes["unitsCode"]["codes"][cube.unitMeasure].label,
              year: cube.yearCode,
            }
            // need to add dimentions
            
            return returnObject;
          })} columns={this.props.columns} pagination={ paginationFactory() } filter={filterFactory()} /> : <React.Fragment></React.Fragment>
        }
      </div>
    );
  }
}


export default DataSeriesComponent;

