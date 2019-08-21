
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';



import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './DataSeriesComponent.scss'

const selectOptions = {
  0: 'good',
  1: 'Bad',
  2: 'unknown'
};

const columns = [{
  dataField: 'id',
  text: 'ID'
}, {
  dataField: 'country',
  text: 'Country'
}, {
  dataField: 'year',
  text: 'Year'
}
  , {
  dataField: 'value',
  text: 'value'

}, {
  dataField: 'unit',
  text: 'Unit'
}
  // , {
  //   dataField: 'name',
  //   text: 'Product Name'
  // }, {
  //   dataField: 'quality',
  //   text: 'Product Quailty',
  //   formatter: cell => selectOptions[cell],
  //   filter: selectFilter({
  //     options: selectOptions
  //   })
  // }
];

class DataSeriesComponent extends Component {
  constructor(props) {
    super(props);
  }



  state = ({
    tableData: [
      {
        id: "1",
        country: "Poland"
      }
    ],
  });


  render() {
    return (
      <div className="table-series">

        {this.props.data['@graph'] ?
          <BootstrapTable keyField='id'  data={this.props.data['@graph'].map((cube, index) => {

            let dataCodes = require('./dataCodes.json'); 
            
            return {
              id: index,
              country: dataCodes["geoAreaCode"]["codes"][cube.geoAreaCode].label,
              year: cube.yearCode,
              value: cube[cube["measureType"]],
              unit: dataCodes["unitsCode"]["codes"][cube.unitMeasure].label,
            }
          })} columns={columns} pagination={ paginationFactory() } filter={filterFactory()} /> : <React.Fragment></React.Fragment>
        }
      </div>
    );
  }
}


export default DataSeriesComponent;

