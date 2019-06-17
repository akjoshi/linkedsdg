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
select distinct ?id ?label where { 
	?x dct:subject ?target .
    ?id skos:broader* ?target .
    {
        {
            ?id skos:prefLabel ?prefLabel .
            FILTER(lang(?prefLabel) = "en")
            BIND (lcase(str(?prefLabel)) as ?label)
        }
        UNION
        {
            ?id skos:altLabel ?altLabel .
            FILTER(lang(?altLabel) = "en")
            BIND (lcase(str(?altLabel)) as ?label)
        }
    }
} 
"""
GRAPHDB = "http://34.66.148.181:7200/repositories/sdgs"

nlp = spacy.load('en_core_web_sm') 
matcher = PhraseMatcher(nlp.vocab)

CONTEXT_SIZE = 5

concept_ids = {}
concept_labels = {}
concept_source = {}
concept_spacy_ids = {}
concept_index = {}
stopwords=[]

def normalise_white_space(word):
    word = word.rstrip()
    word = word.lstrip()
    word = re.sub(' +',' ', word)
    return word
    
def shallow_clean(label):
    label = normalise_white_space(label).lower()
    for char in string.punctuation:
        label = label.replace(char, ' ')
    label = normalise_white_space(label)
    return label

def add_to_matcher(label, i):
    if label not in concept_spacy_ids:
        word_list = []
        word_list.append(label)
        concept_pattern = [nlp(text) for text in word_list]
        matcher.add(i, None, *concept_pattern)
        concept_spacy_ids[label]=[i]
    else:
        concept_spacy_ids[label].append(i)

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
    # concept_list = csv.DictReader(open("labels.csv", encoding="utf8"), delimiter=",")

    i = 1
    for concept in concept_list:
        # label = concept["label"].lower()
        # concept_id = concept["id"]

        label = concept["label"]["value"]
        concept_id = concept["id"]["value"]

        if len(label) < 30:
            add_to_matcher(label, i)
            concept_ids[i]=concept_id
            concept_labels[i]=label
            plural = ""
            if not label.endswith("s"):
                if label.endswith("y"):
                    plural = label[:-1] + "ies"
                else:
                    plural = label + "s"
                add_to_matcher(plural, i)
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

def update_matches(start, end, match_id, current_matches):
    label = concept_labels[match_id].lower()
    returned_matches = []
    returned_matches.extend(current_matches)
    if not (label in stopwords):
        # for match in current_matches:
        #     if match['start']<=start and match['end']>=end and label in match['label'] and not (match['label'] in label) and concept_source[match_id] in match['url']:
        #        return returned_matches
        #     if match['start']>=start and match['end']<=end and match['label'] in label and not (label in match['label']) and concept_source[match_id] in match['url']:
        #         returned_matches.remove(match)
        new_match = {'url': concept_ids[match_id], 'label': label, 'start': start, 'end': end}
        returned_matches.append(new_match)
    return returned_matches

def extract_concepts(input):
    text = shallow_clean(input)
    final_matches = []
    doc = nlp(text)
    matches = matcher(doc)
    int_matches = []
    for match_id, start, end in matches:
        for match_all_id in concept_spacy_ids[concept_labels[match_id]]:
            int_matches = update_matches(start, end, match_all_id, int_matches)
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
        context_string = "[...] " + str(doc[start:end]) + " [...]"
        phrase = str(doc[match['start']:match['end']])
        context_l= "[...] " + str(doc[start:match['start']])
        context_r = str(doc[match['end']:end]) + " [...]"
        match["contextl"] = context_l
        match["phrase"] = phrase
        match["contextr"] = context_r
        match["context"] = context_string
        final_matches.append(match)
        if match["url"] in concepts_all:
            concepts_all[match["url"]]["weight"] += 1
        else: 
            concepts_all[match["url"]] = {
                "label": concept_index[match["url"]]["label"],
                "source": concept_index[match["url"]]["source"],
                "weight": 1
            }
    return final_matches, concepts_all, text

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://34.66.148.181:3000"}})

@app.route("/api", methods=['POST'])
def main():
    task = request.get_json()
    input_text = task["text"]
    result = {}
    result["matches"], result["concepts"], result["clean_text"] = extract_concepts(input_text)
    resp = Response(json.dumps(result), mimetype='application/json')
    return resp

# app.run(host="0.0.0.0", port=5000)

if __name__ == '__main__':
    load_concepts()
    app.run(host="0.0.0.0", port=5000, debug=False)
