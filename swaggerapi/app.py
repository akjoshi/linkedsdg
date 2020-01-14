#!flask/bin/python
from flask import Flask, request, abort 
from flask_cors import CORS, cross_origin
import requests
import json
from os.path import join, dirname, realpath
import os  


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './'
CORS(app)

@app.route('/file', methods=['POST'])
def get_task_file(): 
    if 'file' not in request.files:
        abort(400) 
     
    # TEXT EXTRACT
    f = request.files['file'] 
    url1 = 'http://linkedsdg.apps.officialstatistics.org/text/api'   
    files = {'file': (f.filename, f.stream, f.content_type, f.headers)}
    r1 = requests.request("POST", url1, files=files)  

    payload = {}
    if "options" in request.form:
        payload = json.loads(request.form["options"]) 
     
    return create_response(r1, payload)


@app.route('/url', methods=['POST'])
def get_task_url(): 
    # TEXT EXTRACT
    url = 'http://linkedsdg.apps.officialstatistics.org/text/apiURL' 
    payload = request.get_json()
    print(payload["query"]) 
    r1 = requests.request("POST", url, data=payload["query"])
    return create_response(r1, payload)
 


def create_response(r1, payload):
    print(payload)
    if "geoAreas" not in  payload:
         payload["geoAreas"] = True
    if "concepts" not in  payload:
         payload["concepts"] = True
    if "sdgs" not in  payload:
         payload["sdgs"] = True
    if "text" not in  payload:
        payload["text"] = True

    geoAreasFlag = payload["geoAreas"]
    conceptsFlag = payload["concepts"]
    sdgsFlag = payload["sdgs"]
    textFlag = payload["text"]  

    print(geoAreasFlag)
    print(conceptsFlag)
    print(sdgsFlag)
    print(textFlag)


    response_obj = {}
    if geoAreasFlag == False and conceptsFlag == False and sdgsFlag == False and textFlag == False:
        return json.dumps(response_obj)


    if textFlag == True:
        response_obj["text"] = r1.json() 
        del response_obj["text"]["size"]
        response_obj["text"]["text"] = response_obj["text"]["text"].replace('\n','').replace('\t','')

    if geoAreasFlag == False and conceptsFlag == False and sdgsFlag == False:
        return json.dumps(response_obj)

    data = {}
    data["text"] = r1.json() 
    del data["text"]["size"]
    data["text"]["text"] = data["text"]["text"].replace('\n','').replace('\t','')

    url2 = 'http://linkedsdg.apps.officialstatistics.org/concepts/api'
    payload2 = json.dumps(data["text"])
    headers2 = {'Content-type': 'application/json'} 
    r2 = requests.request("POST", url2, data=payload2, headers=headers2)

    data = r2.json() 
    concepts = []
    countries = []
    for i, item in enumerate( data ): 
        if item == "concepts_show_data": 
            concepts = data[item]

        if item == "countries": 
            countries = data[item]["show_data"]

    if  conceptsFlag == True:
        response_obj["concepts"] = concepts 

    if geoAreasFlag == True:
        response_obj["geoAreas"] = countries 

    if sdgsFlag == False:
        return json.dumps(response_obj)

    url3 = "http://linkedsdg.apps.officialstatistics.org/graph/api"
    payload3 = json.dumps(data['concepts'])
    r3 = requests.request("POST", url3, data=payload3, headers=headers2)
      
    response_obj["sdgs"] = data_sdgs_fix(r3.json())

    return json.dumps(response_obj)

def data_sdgs_fix(obj):
    obj["children"] = children_sdgs_fix(obj["children"])

    return obj

def children_sdgs_fix(arr):
    for obj in arr:
        if "children" in obj.keys():
            children_sdgs_fix(obj["children"])
        if "keywords" in obj.keys():
            obj["keywords"] = obj_to_arr(obj["keywords"])

    return arr
        

def obj_to_arr(obj):
    arr = []
    for prop_name in obj.keys(): 
        if "concepts" in obj[prop_name].keys():
            obj[prop_name]["concepts"] = obj_to_arr(obj[prop_name]["concepts"])
        if "uri" in obj[prop_name].keys():
            obj[prop_name]["uri"] = obj[prop_name]["uri"].strip("http://linkedsdg.org/")
        arr.append(obj[prop_name])

    return arr


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=False)
