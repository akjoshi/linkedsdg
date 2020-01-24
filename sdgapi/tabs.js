 module.exports = [              
    {
    name:"DataSetInfo",
    endpoint: process.env.HOST_URL + '/graphql',
    query: `
    {
      DataSetInfo {
        _id
        _type
        notation
        label
        unitMeasure {
          _id
          _type
          prefLabel
        }
        structure {
          _id
          _type
          dimension {
            _id
            _type
            notation
            codeList {
              _id
              _type
              prefLabel
            }
            sdmxDSDcode
          }
          measure {
            _id
            _type
            label
          }
        }
      }
    }
    `,  
    headers: { "Accept": "application/ld+json" }
    },
    {
    name:"DataSet",
    endpoint: process.env.HOST_URL + '/graphql',
    query: `
    {
      DataSet(series: SL_DOM_TSPDCW) {
        _id
        _type
        notation
        label
        unitMeasure {
          _id
          _type
          prefLabel
        }
        slice(geoArea: _246, sex: [F, M], location: U) {
          _id
          _type
          geoArea {
            _id
            _type
            notation
            prefLabel
            sdmxDSDcode
          }
          sex {
            _id
            _type
            notation
            prefLabel
            sdmxDSDcode
          }
          age {
            _id
            _type
            notation
            prefLabel
            sdmxDSDcode
          }
          location {
            _id
            _type
            notation
            prefLabel
            sdmxDSDcode
          }
          observation(year: [2000, 2010]) {
            _id
            _type
            year
            observedValue
          }
        }
      }
    }
    `,  
    headers: { "Accept": "application/ld+json" }
    },
    {
    name:"DimensionProperty",
    endpoint: process.env.HOST_URL + '/graphql',
    query: `
    {
      DimensionProperty {
        _id
        _type
        notation
        label
        codeList {
          _id
          _type
        }
        sdmxDSDcode
      }
    }
    `,  
    headers: { "Accept": "application/ld+json" }
    },
    {
    name:"MeasureProperty",
    endpoint: process.env.HOST_URL + '/graphql',
    query: `
    {
      MeasureProperty {
        _id
        _type
        label
        notation
      }
    }
    `,  
    headers: { "Accept": "application/ld+json" }
    },
    {
    name:"CodeScheme",
    endpoint: process.env.HOST_URL + '/graphql',
    query: `
    {
      CodeScheme {
        _id
        _type
        prefLabel
        codes {
          _id
          _type
          notation
          prefLabel
          sdmxDSDcode
        }
      }
    }
    `,  
    headers: { "Accept": "application/ld+json" }
    },
    ]
     
      
    