#!flask/bin/python
from flask import Flask, request, abort 
from flask_cors import CORS, cross_origin
import requests
import json
from os.path import join, dirname, realpath
import os  
from flask_caching import Cache


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './'
CORS(app)

cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_KEY_PREFIX': 'sdgapi_cache',
    'CACHE_REDIS_HOST': 'redis',
    'CACHE_REDIS_PORT': '6379',
    'CACHE_REDIS_URL': 'redis://redis:6379'
    })

@app.route('/file', methods=['POST'])
@cache.memoize(timeout=60)
def get_task_file(): 
    if 'file' not in request.files:
        abort(400) 
     
    # TEXT EXTRACT
    f = request.files['file'] 
    url1 = 'http://linkedsdg.apps.officialstatistics.org/text/api'   
    files = {'file': (f.filename, f.stream, f.content_type, f.headers)}
    r1 = requests.request("POST", url1, files=files)  
     
    return create_response(r1)


@app.route('/url', methods=['POST'])
@cache.memoize(timeout=60)
def get_task_url(): 
    # TEXT EXTRACT
    url = 'http://linkedsdg.apps.officialstatistics.org/text/apiURL' 
    payload = str(request.data, "utf-8")
    r1 = requests.request("POST", url, data=payload)
 
    return create_response(r1)
 

@cache.memoize(timeout=60)
def create_response(r1):
    response_obj = {}
    response_obj["text"] = r1.json()
    del response_obj["text"]["size"]

    # to be removed
    response_obj["text"]["text"] = response_obj["text"]["text"].replace('\n','').replace('\t','')

    url2 = 'http://linkedsdg.apps.officialstatistics.org/concepts/api'
    payload2 = json.dumps(response_obj["text"])
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

    response_obj["concepts"] = concepts 
    response_obj["geoAreas"] = countries 

    url3 = "http://linkedsdg.apps.officialstatistics.org/graph/api"
    payload3 = json.dumps(data['concepts'])
    r3 = requests.request("POST", url3, data=payload3, headers=headers2)
      
    response_obj["sdgs"] = data_sdgs_fix(r3.json())

    return json.dumps(response_obj)

@cache.memoize(timeout=60)
def data_sdgs_fix(obj):
    obj["children"] = children_sdgs_fix(obj["children"])

    return obj

@cache.memoize(timeout=60)
def children_sdgs_fix(arr):
    for obj in arr:
        if "children" in obj.keys():
            children_sdgs_fix(obj["children"])
        if "keywords" in obj.keys():
            obj["keywords"] = obj_to_arr(obj["keywords"])

    return arr
        
@cache.memoize(timeout=60)
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
