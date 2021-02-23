let schemaMapping = undefined; // require('../../schema/schema-mapping');
const fetchData = require("./fetchData")
const util = require('util')
handleDataTypeResolver = (tree, object) => {
    let newResolverBody = {}

    for (var propertyName in tree[object].data) {
        if (propertyName === '_value') {

            newResolverBody['_value'] = async (parent) => { return parent.value }
        }
        else if (propertyName === '_type') {
            newResolverBody['_type'] = (parent) => {
                let types = [parent.datatype.value]

                types = types.map(x => {
                    for (let key in schemaMapping['@context']) {
                        if (schemaMapping['@context'][key] === x)
                            return key;
                    }
                    return ""
                })

                return types;
            }
        }
    }

    return newResolverBody;
}
handleClassTypeResolver = (tree, object, database) => {
    let newResolverBody = {}
    // console.log(object + '\n\n')
    for (var propertyName in tree[object].data) {

        // console.log(tree[object].data[propertyName])
        let currentObject = tree[object].data[propertyName];
        let isItList = false;

        if (currentObject.kind == 'ListType') {
            currentObject = currentObject.data;
            isItList = true;
        }

        if (propertyName === '_id') {

            // newResolverBody['_id'] = (parent, args) => {
            //     if (parent[0]) { parent = parent[0] } 
            //     if (parent.value) { return parent.value }
            //     return parent
            // };

            newResolverBody['_id'] = (parent, args) => {
                if (typeof (parent) !== "string" && parent[0]) { parent = parent[0] }
                if (parent.value !== undefined) { return parent.value }
                return parent
            };
        }
        else if (propertyName === '_type') {
            newResolverBody['_type'] = (parent, args) => {
                if (parent.value) {
                    parent = parent.value;
                }
                if (args.inferred) {
                    return database.getObjectsValueArray((parent), database.stampleDataType)
                }
                let types = database.getObjectsValueArray((parent), ("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"))
                types = types.map(x => {
                    for (let key in schemaMapping['@context']) {
                        if (schemaMapping['@context'][key] === x)
                            return key;
                    }
                    return ""
                })
 

                return types.filter(x => x !== "")[0]
            };
        }

        else {
            let uri = schemaMapping["@context"][propertyName];
            if (uri === undefined) {
                // throw new GraphQLError({ key: `Uri not found`, message: 'URI for: {propertyName} was not found' });
                uri = "http://schema.org/" + propertyName;
            }
            // console.log(uri)
            // // console.log(tree)
            // console.log(util.inspect(tree, false, null, true /* enable colors */))
            // console.log("\n\n\n\n\n\n\n\n\n\n")
            // console.log(currentObject.name) 
            if (tree[currentObject.name] && tree[currentObject.name].type === "UnionType") {
                const name = uri;
                let constr = (name) => {
                    return (parent) => {
                        // console.log(parent);
                        // console.log(name);
                        if (typeof (parent) !== "string" && parent[0]) { parent = parent[0] }
                        if (parent.value !== undefined) { parent = parent.value }
                        let data = database.getObjectsValueArray((parent), (name));
                        return data;
                    }
                };
                newResolverBody[propertyName] = constr(name);

            }
            else {
                const name = uri;
                let constr = (name, isItList) => {
                    return ((parent, args) => {
                        if (name === "@reverse") {
                            let data = database.getTriplesByObjectUri(parent);
                            return data;
                        }
                        // console.log("Parent")
                        // console.log(parent)
                        if (parent.value) {
                            parent = parent.value;
                        }

                        if (typeof (parent) !== "string" && parent[0]) { parent = parent[0] }

                        if (isItList) {
                            let allData = database.getObjectsValueArray((parent), (name));
                            // console.log(args)
                            // console.log(parent, name, "------------------")
                            // console.log(data)
                            // start filters 
                            let data = []
                            let keysForFilters = require("./sliceFilter.json");
                            // console.log("ERROR TU JEST")
                            // console.log(args)
                            for (let filter in args) {
                                if (filter === "inferred" || filter === "page" || filter === "year") {
                                    continue;
                                }

                                filterURI = schemaMapping["@context"][filter]; 
                                for (let filterVal of args[filter]) {
                                    if (keysForFilters[filterVal] !== undefined) {
                                        filterVal = keysForFilters[filterVal]
                                    }

                                    if (data.length === 0) {
                                        data = allData.filter(x => {
                                            return database.getObjectsValueArray(x, filterURI).includes(filterVal)
                                        })
                                    }
                                    else {
                                        data = data.filter(x => {
                                            return database.getObjectsValueArray(x, filterURI).includes(filterVal)
                                        })
                                    }
                                }
                                // console.log(filterURI)
                            }
                            if (data.length === 0) {
                                return allData;
                            }
                            return data

                        }
                        else {
                            // console.log(`database.getSingleLiteral((parent), (name))`)
                            // console.log(database.getSingleLiteral((parent), (name))) 
                            let node = database.getSingleLiteral((parent), (name))
                            if (node && node.datatype) {
                                return node.value;
                            }
                            return node;
                        }
                    })
                };
                newResolverBody[propertyName] = constr(name, isItList);
            }
        }
    }
    return newResolverBody;
}
handleUnionTypeResolver = (tree, object, database) => {
    let newResolverBody = {}

    let constr = (name) => {
        return (parent) => {
            // console.log("PARENT", parent)
            // console.log("NAME", name)
            // console.log("------------------------")
            let typesOfObject = tree[name].values.map(value => {
                let uriToName = {};
                uriToName[schemaMapping["@context"][value]] = value;
                return uriToName;
            })
            typeOfObject = database.getObjectsValueArray(parent, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type")[0];
            typesOfObject = typesOfObject.filter(x => x[typeOfObject] !== undefined)[0]

            return typesOfObject[typeOfObject];
        };

    };

    newResolverBody['__resolveType'] = constr(object)
    return newResolverBody
}
handleReverseDataTypeResolver = (tree, object) => {
    let newResolverBody = {}

    for (var propertyName in tree[object].data) {
        let uri = tree[object].data[propertyName].data.uri;

        let constr = (name) => {
            return ((parent, args) => {
                parent = parent.filter(x => x.predicate.value === name);
                let data = parent.map(x => x.subject.value);
                return data;
            })
        };

        newResolverBody[propertyName] = constr(uri);
    }
    return newResolverBody;
}

createQueryResolvers = (database, tree, Warnings, schemaMappingArg) => {
    // -------------------------------------------------- RENDER SCHEMA + SCHEMA-MAPPING TREE
    schemaMapping = schemaMappingArg;
    let queryResolverBody = {};
    queryResolverBody['Query'] = {};
    queryResolverBody['Objects'] = {};
    queryResolverBody['Data'] = {};

    // -------------------------------------------------- CREATE RESOLVERS
    let objectsFromSchemaObjectTree = [];
    for (var propertyName in tree) { objectsFromSchemaObjectTree.push(tree[propertyName]); };
    // console.log(objectsFromSchemaTree)

    for (var object in tree) {
        // console.log("\nNEW OBJECT\n")

        if (tree[object].type === "http://schema.org/DataType") {
            let newResolver = tree[object].name;
            queryResolverBody['Data'][newResolver] = handleDataTypeResolver(tree, object)
        }
        else if (tree[object].type === "http://www.w3.org/2000/01/rdf-schema#Class") {
            // Core Query
            let uri = tree[object]['uri'];
            let constr = (uri) => {
                return async (obj, args, context, info) => {
                    await fetchData(info.fieldNodes, database, tree)
                    // console.log(args) 
                    let data = database.getSubjectsByType((uri), "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", args.inferred);
                    // console.log(data)
                    if (args.series && uri === "http://purl.org/linked-data/cube#DataSet") {
                        let names = require("./dsFilter.json")
                        // console.log(names)
                        // console.log(args.series)
                        let allowed = names[args.series]

                        data = data.filter((id) => { return id === allowed });
                    }
                    if (args.codeSchemes && uri === "http://www.w3.org/2004/02/skos/core#ConceptScheme") {
                        let names = require("./codeSchemeFilter.json")
                        // console.log(names)
                        // console.log(args.series)
                        let allowed = names[args.codeSchemes]

                        data = data.filter((id) => { return id === allowed });
                    }
                    // data = data.filter((id, index) => { return index >= (args.page - 1) * 10 && index < args.page * 10 });
                    return data;
                }
            };
            queryResolverBody['Query'][tree[object].name] = constr(uri);

            //OBJECT
            let newResolver = tree[object].name;
            queryResolverBody['Objects'][newResolver] = handleClassTypeResolver(tree, object, database);
        }
        else if (tree[object].type === "UnionType") {
            let newResolver = tree[object].name;
            queryResolverBody['Data'][newResolver] = handleUnionTypeResolver(tree, object, database);
        }
        else if (tree[object].type === "EnumType") {
            //....
        }
        else if (tree[object].type === "Reverse") {
            let newResolver = tree[object].name;
            queryResolverBody['Data'][newResolver] = handleReverseDataTypeResolver(tree, object);
        }
        else if (object === "_CONTEXT") {
            // queryResolverBody["Query"]["_CONTEXT"] = () => { return {"value": "https://raw.githubusercontent.com/UNStats/LOD4Stats/master/sdg-data/sdg-series-data-cubes-context.jsonld"}}
        }
        else if (object === "_OBJECT") {
            queryResolverBody["Query"]["_OBJECT"] = (obj, args, context, info) => {
                let data = database.getSubjectsByType("http://schema.org/Thing", database.stampleDataType, args.inferred);
                // data = data.filter((id, index) => { return index >= (args.page - 1) * 10 && index < args.page * 10 });
                data = data.map((id) => { return { '_id': id, '_type': database.getObjectsValueArray(id, database.stampleDataType) } });
                return data;
            }
        }
        else {
            console.log("UNHANDLED TYPE")
            console.log(object)
            console.log(tree[object].type)
        }
    }
    //console.log(queryResolverBody);
    return queryResolverBody;
}


module.exports = createQueryResolvers