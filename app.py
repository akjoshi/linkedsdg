import spacy
import csv
from SPARQLWrapper import SPARQLWrapper, JSON, BASIC
from spacy.matcher import PhraseMatcher
from spacy.tokens import Span
import re
import string
from flask import Flask
from flask import Response
from flask import request
from flask_cors import CORS
import json


SPARQL_QUERY = """
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT DISTINCT ?id ?label where { 
	?x dct:subject ?target .
    ?id skos:broader* ?target .
    {
        {
            ?id skos:prefLabel ?prefLabel .
            FILTER(lang(?prefLabel) in ("en", "fr", "es", "ru", "ar", "zh"))
            BIND (?prefLabel as ?label)
        }
        UNION
        {
            ?id skos:altLabel ?altLabel .
            FILTER(lang(?altLabel) in ("en", "fr", "es", "ru", "ar", "zh"))
            BIND (?altLabel as ?label)
        }
    }
}
"""


SPARQL_QUERY_COUNTRIES = """
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?id ?label
    WHERE {
    GRAPH <http://data.un.org/kos/geo> {

        ?id a skos:Concept .
        
	    {
            ?id skos:prefLabel ?prefLabel .
            BIND (STRLANG(?prefLabel, 'en') as ?label)
        }
        UNION
        {
            ?id skos:altLabel ?altLabel .
            FILTER(lang(?altLabel) in ("en", "fr", "es", "ru", "ar", "zh"))
            BIND (?altLabel as ?label)
        }
    }
} 
"""

# SPARQL_COUNTRIES_INDEX = """
# PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
# PREFIX sdgo: <http://data.un.org/ontology/sdg#>

# SELECT DISTINCT ?id ?label ?name ?source 
# WHERE {
#      GRAPH <http://data.un.org/kos/geo> { 
#         ?id a skos:Concept .
#         ?id skos:prefLabel ?label .
#         OPTIONAL {
#             ?id sdgo:iso3code ?code .
#             BIND("geo" as ?s)
#         }
#         BIND(COALESCE(?code, ?label) as ?name)
#         BIND(COALESCE(?s, "geo-all") as ?source)
#     }
#  } 
# """


GRAPHDB = "http://34.66.148.181:7200/repositories/sdgs"

nlp = spacy.load('en_core_web_sm') 

concept_matcher = {
   "en": PhraseMatcher(nlp.vocab),
   "fr": PhraseMatcher(nlp.vocab),
   "es": PhraseMatcher(nlp.vocab),
   "ru": PhraseMatcher(nlp.vocab),
   "zh": PhraseMatcher(nlp.vocab),
   "ar": PhraseMatcher(nlp.vocab)
}

country_matcher = {
   "en": PhraseMatcher(nlp.vocab),
   "fr": PhraseMatcher(nlp.vocab),
   "es": PhraseMatcher(nlp.vocab),
   "ru": PhraseMatcher(nlp.vocab),
   "zh": PhraseMatcher(nlp.vocab),
   "ar": PhraseMatcher(nlp.vocab)
}

CONTEXT_SIZE = 5

concept_ids = {}
concept_labels = {}
concept_source = {}
concept_spacy_ids = {
    "en": {},
    "fr": {},
    "es": {},
    "ru": {},
    "zh": {},
    "ar": {}
}
concept_index = {}
stopwords=[]

country_ids = {}
country_labels = {}
country_source = {}
country_spacy_ids = {
    "en": {},
    "fr": {},
    "es": {},
    "ru": {},
    "zh": {},
    "ar": {}
}
country_index = {}

def normalise_white_space(text):
    text = re.sub(' +',' ', text)
    text = re.sub('\n',' ', text)
    return text
    
def shallow_clean(text):
    text = normalise_white_space(text).lower()
    for char in string.punctuation:
        text = text.replace(char, ' ')
    text = normalise_white_space(text)
    return text

def add_to_concept_matcher(label, i, lang):
    if label not in concept_spacy_ids[lang]:
        concept_pattern = [nlp(text) for text in [label]]
        concept_matcher[lang].add(i, None, *concept_pattern)
        concept_spacy_ids[lang][label]=[i]
    else:
        concept_spacy_ids[lang][label].append(i)

def add_to_country_matcher(label, i, lang):
    if label not in country_spacy_ids[lang]:
        country_pattern = [nlp(text) for text in [label]]
        country_matcher[lang].add(i, None, *country_pattern)
        country_spacy_ids[lang][label] = [i]
    else:
        country_spacy_ids[lang][label].append(i)
        
        

def get_sparql_results(sparql_query):
    sparql = SPARQLWrapper(GRAPHDB)
    sparql.setHTTPAuth(BASIC)
    sparql.setCredentials("sdg-guest", "lod4stats")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return results

def load_concepts():
    print("\n\nLoading concepts...")

    with open('sources.json') as f:
        sources = json.load(f)

    concept_list = get_sparql_results(SPARQL_QUERY)['results']['bindings']

    i = 1
    for concept in concept_list:
        label = concept["label"]["value"].lower()
        lang = concept["label"]["xml:lang"]
        concept_id = concept["id"]["value"]

        if len(label) < 30:
            add_to_concept_matcher(label, i, lang)
            concept_ids[i]=concept_id
            concept_labels[i]=label
            plural = ""
            if lang == 'en' and not label.endswith("s"):
                if label.endswith("y"):
                    plural = label[:-1] + "ies"
                else:
                    plural = label + "s"
                add_to_concept_matcher(plural, i, "en")
            for source in sources:
                if source in concept_id:
                    concept_source[i] = source
        i += 1
        if i > 0 and i % 1000 == 0: 
            print(i / 1000)

    print("\n\nLoading stopwords...")

    stopword_records = csv.DictReader(open("stopwords.csv", encoding="utf8"), delimiter=",")
    for word in stopword_records:
        stopwords.append(word['label'])

    print("\n\nLoading main index...")
    concept_source_index = csv.DictReader(open("concept-source-index.csv", encoding="utf8"), delimiter=",")
    for concept in concept_source_index:
        concept_id = concept["id"]
        label = concept["label"].upper()
        source = concept["source"]
        concept_index[concept_id] = {
            "label": label,
            "source": source
        }

    print("\n\nLoading countries...")
    # countries_list = csv.DictReader(open("countries.tsv", encoding="utf8"), delimiter="\t")

    countries_list = get_sparql_results(SPARQL_QUERY_COUNTRIES)['results']['bindings']

    for country in countries_list:
        label = country["label"]["value"].lower()
        lang = country["label"]["xml:lang"]
        country_id = country["id"]["value"]

        if len(label) < 30:
            add_to_country_matcher(label, i, lang)
            country_ids[i]=country_id
            country_labels[i]=label
            country_source[i] = "geo"
        i += 1

    country_source_index = csv.DictReader(open("countries-source-index.tsv", encoding="utf8"), delimiter="\t")
    for country in country_source_index:
        country_id = country["id"]
        label = country["label"]
        source = country["source"]
        country_index[country_id] = {
            "label": label,
            "source": source,
            "name": country["name"]
        }

def update_matches(start, end, match_id, current_matches, matcher_id):

    ids = {}
    labels = {}
    stops = []

    if matcher_id=="concept":
        ids = concept_ids
        labels = concept_labels
        stops = stopwords
    
    if matcher_id=="country":
        ids = country_ids
        labels = country_labels
        stops = []

    label = labels[match_id].lower()
    returned_matches = []
    returned_matches.extend(current_matches)
    if not (label in stops):
        # for match in current_matches:
        #     if match['start']<=start and match['end']>=end and label in match['label'] and not (match['label'] in label) and concept_source[match_id] in match['url']:
        #        return returned_matches
        #     if match['start']>=start and match['end']<=end and match['label'] in label and not (label in match['label']) and concept_source[match_id] in match['url']:
        #         returned_matches.remove(match)
        new_match = {'url': ids[match_id], 'label': label, 'start': start, 'end': end}
        returned_matches.append(new_match)
    return returned_matches

def extract_concepts(input, matcher_id, lang):
    labels = {}
    spacy_ids = {}
    index = {}

    if matcher_id=="concept":
        labels = concept_labels
        spacy_ids = concept_spacy_ids[lang]
        index = concept_index
        matcher = concept_matcher[lang]
    
    if matcher_id=="country":
        labels = country_labels
        spacy_ids = country_spacy_ids[lang]
        index = country_index
        matcher = country_matcher[lang]

    text = shallow_clean(input)
    final_matches = []
    doc = nlp(text)
    matches = matcher(doc)
    int_matches = []
    for match_id, start, end in matches:
        for match_all_id in spacy_ids[labels[match_id]]:
            int_matches = update_matches(start, end, match_all_id, int_matches, matcher_id)
    concepts_all = {}
    for match in int_matches:
        if match['start'] > CONTEXT_SIZE:
            start = match['start'] - CONTEXT_SIZE
        else:
            start = 0
        if match['end'] + CONTEXT_SIZE < len(doc):
            end = match['end'] + CONTEXT_SIZE
        else:
            end = len(doc)
        # context_string = "[...] " + str(doc[start:end]) + " [...]"
        phrase = str(doc[match['start']:match['end']])
        context_l= "[...] " + str(doc[start:match['start']])
        context_r = str(doc[match['end']:end]) + " [...]"
        match["contextl"] = context_l
        match["phrase"] = phrase
        match["contextr"] = context_r
        # match["context"] = context_string
        final_matches.append(match)
        if match["url"] in concepts_all:
            concepts_all[match["url"]]["weight"] += 1
        else: 
            concepts_all[match["url"]] = {
                "label": index[match["url"]]["label"],
                "source": index[match["url"]]["source"],
                "weight": 1
            }
    return final_matches, concepts_all

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route("/api", methods=['POST'])
def concepts():

    task = request.get_json()
    input_text = task["text"]
    input_lang = task["lang"]
    if input_lang not in ["en", "fr", "es", "ru", "zh", "ar"]:
        return Response("The language of the document has been identified as \"" + input_lang + "\". This language is not supported.", status=400)

    result = {}
    result["matches"], result["concepts"] = extract_concepts(input_text, 'concept', input_lang)
    country_res = {}
    country_res["matches"], country_res["countries"] = extract_concepts(input_text, 'country', input_lang)
    top = 0
    top_country = {}
    all_countries = {}
    tops = []
    for country_url in country_res["countries"]: 
        country = country_res["countries"][country_url]
        country["url"] = country_url
        country["name"]= country_index[country_url]["name"]
        all_countries[country_url] = country
        if country['weight'] > top:
            top = country['weight']
            top_country = country
    for country_url in country_res["countries"]: 
        country = country_res["countries"][country_url]
        if country['weight'] >= (top / 5):
            tops.append(country["url"])
    result["countries"] = {
        "matches": country_res["matches"],
        "total": all_countries,
        "top_region": top_country["url"],
        "top_regions": tops
    }
    resp = Response(json.dumps(result), mimetype='application/json')
    return resp

# app.run(host="0.0.0.0", port=5000)

if __name__ == '__main__':
    load_concepts()
    app.run(host="0.0.0.0", port=5000, debug=False)
