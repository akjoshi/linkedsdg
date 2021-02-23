const createTree = require('../schema/schema-tree');
const createMutationResolvers = require('./mutation-resolver/mutation-resolvers');
const createQueryResolvers = require('./query-resolvers/query-resolvers');

class rootResolver {
    constructor(db, Warnings, schemaMapping) {
        this.database = db;
        //Warnings.push({'Message': "Information about object2"})
        // console.log(schema.getTypeMap()["Person"]);

        this.rootResolver = {}

        this.tree = createTree(schemaMapping);

        // -------------------------------------------------- Create Query resolvers
        

        const queryResolvers = createQueryResolvers(this.database, this.tree, Warnings, schemaMapping);
        
        let queryObj = {} 
        queryObj["DataSet"] = queryResolvers["Query"]["DataSet"];
        queryObj["DimensionProperty"] = queryResolvers["Query"]["DimensionProperty"];
        queryObj["MeasureProperty"] = queryResolvers["Query"]["MeasureProperty"];
        queryObj["CodeScheme"] = queryResolvers["Query"]["CodeScheme"];
        queryObj["DataSetInfo"] = queryResolvers["Query"]["DataSetInfo"];
        queryObj["JSON_LD_CONTEXT"] = () => { return "https://raw.githubusercontent.com/UNStats/LOD4Stats/master/sdg-data/sdg-series-data-cubes-context.jsonld"}


        this.rootResolver["Query"] = queryObj   
        console.log( this.rootResolver["Query"])
        for (const [key, value] of Object.entries(queryResolvers["Objects"])) {
            // console.log(queryResolvers["Query"][key])
                this.rootResolver[key] = queryResolvers["Objects"][key];
        }
        for (const [key, value] of Object.entries(queryResolvers['Data'])) {
            // console.log(queryResolvers['Data'][key])
            this.rootResolver[key] = queryResolvers['Data'][key];
        }

        // const mutationResolvers = createMutationResolvers(this.database, this.tree, Warnings, schemaMapping);
        // this.rootResolver['Mutation'] = mutationResolvers;
        
        console.log(this.rootResolver.MeasureProperty)

    }
}

module.exports = rootResolver