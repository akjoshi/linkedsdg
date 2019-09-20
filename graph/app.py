from flask import Flask, request, abort, Response
from SPARQLWrapper import SPARQLWrapper, JSON, BASIC
import json
import csv
import copy
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
from pyld import jsonld


app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://34.66.148.181:3000"}})

GRAPHDB = "http://34.66.148.181:7200/repositories/sdg"
# GRAPHDB = "http://localhost:7200/repositories/sdg-stats"
QUERY = """
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?concept ?conceptBroader ?entity ?typeLabel WHERE {
    VALUES ?concept { %s }

    GRAPH <http://data.un.org/concepts/sdg/extracted> {
        ?concept skos:broader* ?conceptBroader .   
    }
    
    ?conceptBroader skos:exactMatch ?conceptBroaderExact .
    ?entity dct:subject ?conceptBroaderExact .


    ?entity rdf:type ?type .
    FILTER (CONTAINS(str(?type), "ontology/sdg"))
    ?type rdfs:label ?typeName .
    FILTER(lang(?typeName)='en')

    BIND(STR(?typeName) as ?typeLabel)
}
"""

KEYWORD_QUERY = """
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX sdgo: <http://data.un.org/ontology/sdg#>
SELECT ?id ?type (GROUP_CONCAT(DISTINCT ?con; separator=";") as ?matches) where { 
    
    # GRAPH <http://data.un.org/kos/sdg> { 
        VALUES ?t { sdgo:Goal sdgo:Target sdgo:Indicator sdgo:Series }
        ?id a ?t
        BIND(STRAFTER(str(?t), "http://data.un.org/ontology/sdg#") as ?type)
    # }
    
    OPTIONAL {
        		?id dct:subject ?conc .
        		?con skos:exactMatch ?conc .
        FILTER (CONTAINS(str(?con), "http://data.un.org/concepts"))
    }
} GROUP BY ?id ?type
"""

STAT_QUERY = """
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX sdgo: <http://data.un.org/ontology/sdg#>
PREFIX codes: <http://data.un.org/codes/sdg/>
CONSTRUCT {
        ?obs ?p ?y .    
    	?obs ?z ?u .
     	?obs <http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?unitCode .
    	?obs qb:measureType ?series .
}
where { 
    GRAPH <http://data.un.org/series/sdg> {
        BIND(<%s> as ?series)
        # VALUES ?country { %s } 

        ?series qb:slice ?slice .
        # ?slice <http://data.un.org/codes/sdg/geoArea> ?country .
        ?series <http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?unitCode .
        ?slice qb:observation ?obs .
        FILTER EXISTS { 
            ?obs ?series [] .
        }
        ?slice ?z ?u .
        ?z a qb:DimensionProperty .  
        ?obs ?p ?y . 
    }
} 
"""

# STAT_QUERY2 = """
# PREFIX qb: <http://purl.org/linked-data/cube#>
# PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
# PREFIX sdgo: <http://data.un.org/ontology/sdg#>
# PREFIX codes: <http://data.un.org/codes/sdg/>
# CONSTRUCT {
#         ?observation a qb:Observation .    
#     	?observation ?predicate ?object .
# }
# where { 
#     GRAPH <http://data.un.org/series/sdg/observations> {
#         BIND(<%s> as ?series)
#         VALUES ?country { %s } 
        
#         ?observation <http://data.un.org/codes/sdg/geoArea> ?country .
#         ?observation ?series ?value .
#         ?observation ?predicate ?object .
#     }
# } 
# """

DESCRIBE_QUERY = """
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX sdgo: <http://data.un.org/ontology/sdg#>
PREFIX codes: <http://data.un.org/codes/sdg/>
CONSTRUCT {
        ?node ?pred ?obj .
}
where { 
        VALUES ?node { <%s> } 
        
        ?node ?pred ?obj .
} 
"""

with open('response-template.json', encoding="utf-8") as f:
    response_template = json.load(f)

with open('cubes.json', encoding="utf-8") as f:
    cubes = json.load(f)


def get_sparql_results(sparql_query):
    sparql = SPARQLWrapper(GRAPHDB)
    sparql.setHTTPAuth(BASIC)
    sparql.setCredentials("sdg-guest", "lod4stats")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return results

concept_index_main = {}

concept_index_source = csv.DictReader(open("concepts-source-index.tsv", encoding="utf8"), delimiter="\t")
for concept in concept_index_source:
    exact = []
    exacts = concept["matches"].split(";")
    for con in exacts:
        if "metadata" in con:
            source = "UNBIS"
        else:
            source = "EuroVoc"
        ex = {
            "uri": con,
            "source": source
        }
        exact.append(ex)

    concept_index_main[concept["id"]] = {
        "uri": concept["id"],
        "label": concept["label"],
        "sources": exact
    }

keywords_index = {}
    
keyword_results = get_sparql_results(KEYWORD_QUERY)['results']['bindings']

for entity in keyword_results:
    keyword_concepts = entity["matches"]["value"].split(";")
    keyword_records = {}
    for keyword in keyword_concepts:
        if keyword !='':
            keyword_records[keyword] = concept_index_main[keyword]
    keywords_index[entity["id"]["value"]] = {
        "type": entity["type"]["value"],
        "keywords": keyword_records
    }


# ?concept skos:broader* ?conceptBroader .
#     ?entityLow dct:subject ?conceptBroader .
#     ?entityLow skos:broader* ?entity .
#     ?entity dct:subject ?conceptBroader .
    
def add_remaining_keywords(entities_results):
    for entity in keywords_index:
        if entity in entities_results:
            for keyword in keywords_index[entity]["keywords"]:
                if keyword not in entities_results[entity]["keywords"]:
                    entities_results[entity]["keywords"][keyword] = keywords_index[entity]["keywords"][keyword]
        else:
            entities_results[entity] = keywords_index[entity]

    return entities_results



def merge(source, target):
    for key in source:
        target[key] = source[key]
        if key == 'value':
            target[key] = round(target[key])

    return target

def get_final_result(entities):

    resp = copy.deepcopy(response_template)
    
    goals = []

    for goal in resp["children"]:
        if goal["id"] in entities:
            goal_entity = entities[goal["id"]]
            goal_entity["name"] = goal["name"]

            targets = []

            for target in goal["children"]:
                if target["id"] in entities:
                    target_entity = entities[target["id"]]
                    target_entity["name"] = target["name"]

                    indicators = []

                    for indicator in target["children"]:
                        if indicator["id"] in entities:
                            indicator_entity = entities[indicator["id"]]
                            indicator_entity["name"] = indicator["name"]

                            serieses = []

                            for series in indicator["children"]:
                                if series["id"] in entities:
                                    series_entity = entities[series["id"]]
                                    series_entity["name"] = series["name"]

                                    new_series = merge(series_entity, series)

                                    if new_series["value"] > 4:
                                        serieses.append(new_series)

                            indicator["children"] = serieses

                            new_indicator = merge(indicator_entity, indicator)
                    
                            if new_indicator["value"] > 4  or len(serieses)>0:
                                if len(serieses)>0:
                                    new_indicator.pop("value")
                                    for series_inst in serieses:
                                        series_inst["value"] = series_inst["value"] / (len(serieses) / 1.3)
                                indicators.append(new_indicator)

                    target["children"] = indicators

                    new_target = merge(target_entity, target)
            
                    if new_target["value"] > 4 or len(indicators)>0:
                        if len(indicators)>0:
                            new_target.pop("value")
                            for indicator_inst in indicators:
                                if "value" in indicator_inst:
                                    indicator_inst["value"] = indicator_inst["value"] / (len(indicators) / 1.3)
                        targets.append(new_target)

            goal["children"] = targets

            new_goal = merge(goal_entity, goal)
            
            if new_goal["value"] > 4 or len(targets)>0:
                if len(targets)>0:
                    new_goal.pop("value")
                    for target_inst in targets:
                        if "value" in target_inst:
                            target_inst["value"] = target_inst["value"] / (len(targets) / 1.3)
                goals.append(new_goal)

    resp["children"] = goals

    return resp





@app.route('/')
def index():
    return "This is graph query API!"


@app.route('/describe', methods=['POST'])
@cross_origin()
def get_description():
    uri = request.get_json()["uri"]
    query = DESCRIBE_QUERY % uri
    print(query)
    response = requests.get(GRAPHDB, auth=('sdg-guest', 'lod4stats'), params={"query":query}, headers={"Accept":"application/ld+json"})
    return Response(json.dumps(json.loads(response.content.decode('utf-8'))), mimetype='application/json')

@app.route('/stats', methods=['POST'])
@cross_origin()
def get_related_stats():
    input_params = request.get_json()
    # countries = "<" + ("> <").join(input_params["countries"]) + ">"
    if "countries" in input_params:
        countries = input_params["countries"] 
    else:
        countries = None
    stat = input_params["stat"]
    # query = STAT_QUERY % (stat, countries)
    # print(query)
    # response = requests.get(GRAPHDB, auth=('sdg-guest', 'lod4stats'), params={"query":query}, headers={"Accept":"application/ld+json"})
    
    graph = []

    more_data = True

    if stat in cubes:
        stat_cubes = cubes[stat]

        if countries != None:
            for country in countries:
                if country in stat_cubes:
                    graph.extend(stat_cubes[country])
        else:
            for country in stat_cubes:
                graph.extend(stat_cubes[country])
            more_data = False

    else:
        more_data = False

            
    context = {
        "Observation": "http://purl.org/linked-data/cube#Observation",
        "measureType": {
            "@id": "http://purl.org/linked-data/cube#measureType",
            "@type": "@id"
        },
        "unitMeasure": {
            "@id": "http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure",
            "@type": "@id"
        },
        "ageCode": {
            "@id": "http://data.un.org/codes/sdg/age",
            "@type": "@id"
        },
        "sexCode": {
            "@id": "http://data.un.org/codes/sdg/sex",
            "@type": "@id"
        },
        "locationCode": {
            "@id": "http://data.un.org/codes/sdg/location",
            "@type": "@id"
        },
        "nameOfInternationalInstitutionCode": {
            "@id": "http://data.un.org/codes/sdg/nameOfInternationalInstitution",
            "@type": "@id"
        },
        "citiesCode": {
            "@id": "http://data.un.org/codes/sdg/cities",
            "@type": "@id"
        },
        "typeOfProductCode": {
            "@id": "http://data.un.org/codes/sdg/typeOfProduct",
            "@type": "@id"
        },
        "boundCode": {
            "@id": "http://data.un.org/codes/sdg/bound",
            "@type": "@id"
        },
        "freqCode": {
            "@id": "http://data.un.org/codes/sdg/freq",
            "@type": "@id"
        },
        "typeOfSpeedCode": {
            "@id": "http://data.un.org/codes/sdg/typeOfSpeed",
            "@type": "@id"
        },
        "nameOfNonCommunicableDiseaseCode": {
            "@id": "http://data.un.org/codes/sdg/nameOfNonCommunicableDisease",
            "@type": "@id"
        },
        "typeOfOccupationCode": {
            "@id": "http://data.un.org/codes/sdg/typeOfOccupation",
            "@type": "@id"
        },
        "ihrCapacityCode": {
            "@id": "http://data.un.org/codes/sdg/ihrCapacity",
            "@type": "@id"
        },
        "educationLevelCode": {
            "@id": "http://data.un.org/codes/sdg/educationLevel",
            "@type": "@id"
        },
        "typeOfSkillCode": {
            "@id": "http://data.un.org/codes/sdg/typeOfSkill",
            "@type": "@id"
        },
        "levelStatusCode": {
            "@id": "http://data.un.org/codes/sdg/levelStatus",
            "@type": "@id"
        },
        "disabilityStatusCode": {
            "@id": "http://data.un.org/codes/sdg/disabilityStatus",
            "@type": "@id"
        },
        "migratoryStatusCode": {
            "@id": "http://data.un.org/codes/sdg/migratoryStatus",
            "@type": "@id"
        },
        "modeOfTransportationCode": {
            "@id": "http://data.un.org/codes/sdg/modeOfTransportation",
            "@type": "@id"
        },
        "typeOfMobileTechnologyCode": {
            "@id": "http://data.un.org/codes/sdg/typeOfMobileTechnology",
            "@type": "@id"
        },
        "geoAreaCode": {
            "@id": "http://data.un.org/codes/sdg/geoArea",
            "@type": "@id"
        },
        "unitsCode": {
            "@id": "http://data.un.org/codes/sdg/units",
            "@type": "@id"
        },
        "yearCode": {
            "@id": "http://data.un.org/codes/sdg/year",
            "@type": "http://www.w3.org/2001/XMLSchema#gYear"
        },
        "hazardTypeCode": {
            "@id": "http://data.un.org/codes/sdg/hazardType",
            "@type": "@id"
        }        
    }
    
    # doc = {'@context': context, '@graph': json.loads(response.content) }
    # flattened = jsonld.flatten(doc, context)
    # return Response(json.dumps(flattened), mimetype='application/json') 

    return Response(json.dumps({'@context':context, "more_data":more_data, '@graph': graph}), mimetype='application/json') 


@app.route('/api', methods=['POST'])
@cross_origin()
def get_related_entities():
    input_matches = request.get_json()
    concept_index = {}
    for match in input_matches:
        concept_index = extend_concept_index(match, concept_index)
    values_string = ""
    entities_results = {}
    counter = 0
    for uri in concept_index:
        counter += 1
        value_string = "<" + uri + "> "
        values_string = values_string + value_string
        if (counter % 50 == 0) or counter == len(concept_index):
            print(counter)
            sparql_query = QUERY % values_string
            sparql_results_entities = get_sparql_results(sparql_query) 
            for result in sparql_results_entities['results']['bindings']:
                entities_results = process_sparql_result(result, entities_results, concept_index)
            values_string = ""


    enriched_entities = add_remaining_keywords(entities_results)
    result = get_final_result(enriched_entities)

    return json.dumps(result), 200, {'Content-Type': 'application/json'}


def process_sparql_result(result, index, concept_index):
    entity = result["entity"]["value"]
    concept = result["concept"]["value"]
    broader = result["conceptBroader"]["value"]
    type_label = result["typeLabel"]["value"]

    weight = concept_index[concept]
    if type_label=="Goal":
        weight = weight * 1 #3
    if type_label=="Target":
        weight = weight * 1 #1.3
    if type_label=="Indicator":
        weight = weight * 1 #1.1 

    if entity in index:
        ent_index = index[entity]
        ent_index["value"] += weight
        if broader in ent_index["keywords"]:
            ent_index["keywords"][broader]["value"] += weight
            if concept not in ent_index["keywords"][broader]["concepts"]:
                ent_index["keywords"][broader]["concepts"][concept] = concept_index_main[concept]
        else:
            ent_index["keywords"][broader] = {
                "value": weight,
                "label": concept_index_main[broader]["label"],
                "uri": concept_index_main[broader]["uri"],
                "sources": concept_index_main[broader]["sources"],
                "concepts": { concept: concept_index_main[concept] }
            }
    else:
        index[entity] = {
            "type": type_label, 
            "value": weight,
            "keywords": {
                broader: {
                    "value": weight,
                    "label": concept_index_main[broader]["label"],
                    "uri": concept_index_main[broader]["uri"],
                    "sources": concept_index_main[broader]["sources"],
                    "concepts": { concept: concept_index_main[concept] }
                }
            }
        }
    
    # if concept_intermediate != concept and concept_intermediate not in ent_index["concept"][concept]["intermediate"]:
    #         ent_index["concept"][concept]["intermediate"].append(concept_intermediate)
    
    return index


def extend_concept_index(match, concept_index):
    uri = match["uri"]
    weight = 1
    if 'weight' in match:
        weight = match["weight"]
    if uri in concept_index:
        concept_index[uri] += weight
    else:
        concept_index[uri] = weight
    return concept_index


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=False)
