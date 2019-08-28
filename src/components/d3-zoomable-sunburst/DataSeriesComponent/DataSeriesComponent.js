
import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './DataSeriesComponent.scss'
 

class DataSeriesComponent extends Component {
  state = ({

  });

  render() {
    return (
      <div className="table-series">
        <h5>{this.props.description}</h5>
        {this.props.data['@graph'] ?
          <div>

            <BootstrapTable keyField='id' data={this.props.data['@graph'].map((cube, index) => {
              let dataCodes = require('./dataCodes.json');
              let returnObject = {
                id: index,
                country: dataCodes["geoAreaCode"]["codes"][cube.geoAreaCode].label,
                value: cube[cube["measureType"]],
                unit: dataCodes["unitsCode"]["codes"][cube.unitMeasure].label,
                year: cube.yearCode,
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

              // console.log(new Date().toISOString())

              return returnObject;
            })} columns={this.props.columns} pagination={paginationFactory()} filter={filterFactory()} />

            </div>
          : <React.Fragment></React.Fragment>
        }
      </div>
    );
  }
}


export default DataSeriesComponent;

