const axios = require('axios');
const util = require('util');

const fetchData = async (fieldNodes, database, tree) => {
    database.updateDB();

    fieldNodes = fieldNodes.filter(x => x.name.value === "DataSet")
    for (let fieldNode of fieldNodes) {
        // console.log(util.inspect(fieldNode, false, null, true /* enable colors */))

        const imports = `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX qb: <http://purl.org/linked-data/cube#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        `

        let { CONSTRUCT, WHERE } = renderQueryData(fieldNode, tree)
        // GET ALL DATA

        const query = `${imports}\nCONSTRUCT {\n${CONSTRUCT}}\nwhere {\n${WHERE}}`
        console.log('\n')
        console.log('\n')
        console.log(query)
        console.log('\n')
        console.log('\n')

        let response = await axios.get("http://graphdb:3030/stats/sparql",
            {
                params: {
                    query: query
                }
            });

        await database.insertRDF(response.data, null)
        // PUT IT IN DB
    }
    console.log(database.database.size)
    return
}

const renderQueryData = (fieldNode, tree) => {
    console.log("RENDER")
    constructTriples = []
    whereBody = ``

    // MAIN TYPE
    // console.log(util.inspect(tree[fieldNodeType], false, null, true /* enable colors */))
    // console.log(tree[fieldNode.name.value])
    let fieldNodeType = tree[fieldNode.name.value].uri;

    let baseTriple = `?x a <${fieldNodeType}> .\n`
    constructTriples.push(baseTriple);
    whereBody += baseTriple
    //ADD BASE FILTERS
    if (fieldNode.arguments.length > 0) {
        for (let filter of fieldNode.arguments) {
            if (filter.name.value === "series") {
                whereBody += `\nFILTER (?x in (<http://metadata.un.org/sdg/${filter.value.value}>))\n`
            }
        }
    }
    // FILTER (?x in ( <http://metadata.un.org/sdg/EN_H2O_OPAMBQ>))

    count = [0]
    if (fieldNode.selectionSet) {
        let data = renderOptionals(fieldNode.selectionSet.selections, tree, tree[fieldNode.name.value], "x", fieldNode.arguments, count)
        constructTriples = [baseTriple, ...data.triples];

        // whereBody += `OPTIONAL { \n`
        whereBody += data.optionals;
        // whereBody += `}\n`
    }

    return { CONSTRUCT: constructTriples.join(""), WHERE: whereBody }
}

const renderOptionals = (selections, tree, parent, parentQueryName, parentArguments, count) => {
    // console.log(parentArguments)
    let triples = []
    let optionals = ``

    for (let selection of selections) {
        let propertyName = selection.name.value;
        if (propertyName === "_id") {
            continue;
        }

        let objID = `x_${count[0]}`;
        count[0] += 1;

        let objInfo = parent.data[propertyName]
        if (parent.data[selection.name.value].kind === "ListType") {
            objInfo = objInfo.data;
        }

        newTriple = `?${parentQueryName} <${objInfo.uri}> ?${objID} .\n`

        if (propertyName === "_type") {
            newTriple = `?${parentQueryName} a ?${objID} .\n`
        }

        triples.push(newTriple)

        let optional = ``

        // filters on Slice ... get data even if not asked for
        // Add filter on year
        if (parent.name === "Slice") {
            let filter = parentArguments.filter(x => `http://metadata.un.org/sdg/codes/${x.name.value}` === objInfo.uri)[0]
            if (filter) {
                if (filter.value.kind === "EnumValue") {
                    optional += newTriple
                    let value = filter.value.value
                    if (value.startsWith("_")) {
                        value = value.replace("_", "")
                    }
                    optional += `FILTER (?${objID} in (<${objInfo.uri}/${value}>))\n`
                }

                else if (filter.value.kind === "ListValue") {
                    let values = filter.value.values.map(x => {
                        let value = x.value
                        if (value.startsWith("_")) {
                            value = value.replace("_", "")
                        }
                        return value
                    })
                    optional += newTriple 
                    optional += `FILTER (?${objID} in (${values.map(x => `<${objInfo.uri}/${x}> `)}))\n`


                }
                else {
                    console.log("ERROR on slice filter:")
                    console.log(filter)
                }
            }
            else {
                optional = `OPTIONAL { \n`
                optional += newTriple
            }
        }
        else if (parent.name === "Observation") {
            let filter = parentArguments.filter(x => x.name.value === propertyName)[0]
            if (filter) {
                if (filter.value.kind === "IntValue") {
                    optionals += newTriple
                    let value = filter.value.value
                    if (value.startsWith("_")) {
                        value = value.replace("_", "")
                    }
                    optionals += `FILTER ((str(?${objID}) = "${value}"))\n`
                }
                else if (filter.value.kind === "ListValue") {
                    let values = filter.value.values.map(x => `"${x.value}"`)
                    optionals += `VALUES ?${objID} { ${values.join(" ")} } .\n`
                    optionals += newTriple
                }
                else {
                    console.log("ERROR on Observation filter:")
                    console.log(filter)
                }

            }
            else {
                optional = `OPTIONAL { \n`
                optional += newTriple
            }
        }
        else {
            optional = `OPTIONAL { \n`
            optional += newTriple
        }

        // TEST
        console.log(selection)
        if (selection.selectionSet && (selection.name.value === "slice" || selection.name.value === "observation")) {
            let objInfoChild = parent.data[selection.name.value]
            if (parent.data[selection.name.value].kind === "ListType") {
                objInfoChild = objInfoChild.data;
            }

            let data = renderOptionals(selection.selectionSet.selections, tree, tree[objInfoChild.name], objID, selection.arguments, count)
            triples = [...triples, ...data.triples];
            optional += data.optionals;
            // console.log("FOR :")
            // console.log(propertyName)
            // console.log(data.optionals)
            data = addMissingFilters(selection.selectionSet.selections, tree, tree[objInfoChild.name], objID, selection.arguments, count)
            triples = [...triples, ...data.triples];
            optional += data.optionals;
        }

        if (optional.startsWith("OPTIONAL { \n")) {
            optional += "}\n"
        }
        optionals += optional
    }

    return { triples: triples, optionals: optionals }
}


const addMissingFilters = (selections, tree, parent, parentQueryName, parentArguments, count) => {
    let triples = []
    let optionals = ``

    // list filters
    // console.log(parentArguments)
    if (parentArguments.length === 0) {
        return { triples: triples, optionals: optionals }
    }

    let filters = parentArguments.map(x => x.name.value)

    for (let elem of selections) {
        filters = filters.filter(x => x !== elem.name.value)
    }
    // console.log(filters) // those needs to be added

    for (let propertyName of filters) {
        let objID = `x_${count[0]}`;
        count[0] += 1;

        let objInfo = parent.data[propertyName]
        if (objInfo.data) {
            objInfo = objInfo.data;
        }

        newTriple = `?${parentQueryName} <${objInfo.uri}> ?${objID} .\n`


        if (parent.name === "Slice") {
            triples.push(newTriple)
            let filter = parentArguments.filter(x => x.name.value === propertyName)[0]
            if (filter.value.kind === "EnumValue") {
                optionals += newTriple
                let value = filter.value.value
                if (value.startsWith("_")) {
                    value = value.replace("_", "")
                }
                optionals += `FILTER (?${objID} in (<${objInfo.uri}/${value}>))\n`
            }

            else if (filter.value.kind === "ListValue") {
                let values = filter.value.values.map(x => {
                    let value = x.value
                    if (value.startsWith("_")) {
                        value = value.replace("_", "")
                    }
                    return value
                })
                optionals += newTriple 
                optionals += `FILTER (?${objID} in (${values.map(x => `<${objInfo.uri}/${x}> `)}))\n`
            }
            else {
                console.log("ERROR on slice filter:")
                console.log(filter)
            }
        }
        else if (parent.name === "Observation") {
            let filter = parentArguments.filter(x => x.name.value === propertyName)[0]
            if (filter) {
                if (filter.value.kind === "IntValue") {
                    optionals += newTriple
                    let value = filter.value.value
                    if (value.startsWith("_")) {
                        value = value.replace("_", "")
                    }
                    optionals += `FILTER ((str(?${objID}) = "${value}"))\n`
                }
                else if (filter.value.kind === "ListValue") {
                    let values = filter.value.values.map(x => `"${x.value}"`)
                    optionals += `VALUES ?${objID} { ${values.join(" ")} } .\n`
                    optionals += newTriple
                }
                else {
                    console.log("ERROR on Observation filter:")
                    console.log(filter)
                }

            }
            else {
                optional = `OPTIONAL { \n`
                optional += newTriple
            }
        }
        else {
            console.log(parent.name)

        }
    }

    console.log(optionals)

    return { triples: triples, optionals: optionals }
}

module.exports = fetchData


