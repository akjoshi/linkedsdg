
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';


import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './DataSeriesComponent.scss'

const { ExportCSVButton } = CSVExport;

const sizePerPageRenderer = ({
  options,
  currSizePerPage,
  onSizePerPageChange
}) => (
    <div className="btn-group" role="group">
      {
        options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn page-size-button ${isSelect ? 'btn-primary' : 'page-size-button-not-active'}`}
            >
              {option.text}
            </button>
          );
        })
      }
    </div>
  );


const options = {
  sizePerPageRenderer
};


class DataSeriesComponent extends Component {

  state = ({
    csvData: [this.props.columns.filter(x => x.dataField !== 'id').map(x => x.dataField)],
    keyWordsString: ""
  });

  componentDidMount() {

    let keyWordsString = "";
    for (let obj in this.props.keyWords) {
      keyWordsString = keyWordsString + this.props.keyWords[obj].label + ", ";
    }

    this.setState({ keyWords: keyWordsString });
  }


  render() {
    return (
      <React.Fragment>
        <h3 className="Title add-top-margin">
          DATA SERIES
      </h3>
        <div className="table-series">
          <h5>{this.props.description}</h5>
          {this.props.data['@graph'] ?
            <div>

              <ToolkitProvider
                keyField="id"
                data={this.props.data['@graph'].map((cube, index) => {
                  let dataCodes = require('./dataCodes.json');
                  let returnObject = {
                    id: index,
                    country: dataCodes["geoAreaCode"]["codes"][cube.geoAreaCode].label,
                    value: cube[cube["measureType"]],
                    unit: dataCodes["unitsCode"]["codes"][cube.unitMeasure].label,
                    year: cube.yearCode,
                    measureType: this.props.description,
                    keyWords: this.state.keyWords,
                  }
                  // need to add dimentions
                  let notRelevantFields = [
                    "@id",
                    "@type",
                    "measureType",
                    "unitMeasure",
                    "geoAreaCode"
                  ]
                  // console.log("GOT DATA START LOOP")
                  // console.log(new Date().toISOString())

                  for (let key in cube) {
                    if (notRelevantFields.includes(key) || key === cube['measureType']) {
                      continue;
                    }
                    // console.log("new key !")
                    // console.log(key)
                    // console.log(dataCodes[key]["codes"][ cube[key] ].label)
                    returnObject[key] = cube[key];
                    notRelevantFields.push(key)

                  }

                  return returnObject;
                })}
                columns={this.props.columns}
                exportCSV
              >
                {
                  props => (
                    <div>
                      <BootstrapTable {...props.baseProps} pagination={paginationFactory(options)} filter={filterFactory()} />
                      <ExportCSVButton {...props.csvProps} className="export-csv-button">Export CSV</ExportCSVButton>
                    </div>
                  )
                }
              </ToolkitProvider>

            </div>
            : <React.Fragment></React.Fragment>
          }
        </div>


      </React.Fragment>
    );
  }
}


export default DataSeriesComponent;

