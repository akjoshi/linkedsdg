
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';


import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './DataSeriesComponent.scss'

const selectOptions = {
  0: 'good',
  1: 'Bad',
  2: 'unknown'
};

const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'quality',
  text: 'Product Quailty',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}, {
  dataField: 'quality2',
  text: 'Product Quailty',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}, {
  dataField: 'quality3',
  text: 'Product Quailty',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}, {
  dataField: 'quality4',
  text: 'Product Quailty',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}, {
  dataField: 'quality5',
  text: 'Product Quailty',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}, {
  dataField: 'quality6',
  text: 'Product Quailty',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}, {
  dataField: 'quality7',
  text: 'Product Quailty',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}];

class DataSeriesComponent extends Component {
  constructor(props) {
    super(props);
  }


  state = ({

  });


  render() {
    return (
      <div>


        <BootstrapTable keyField='id' data={[{id: 1, name: "Data", quality:0, quality2:0 },{id: 2, name: "Data",  quality2:0 }]} columns={columns} filter={filterFactory()} />
      </div>
    );
  }
}


export default DataSeriesComponent;

