#!flask/bin/python

from flask import Flask, request, abort
from tika import parser
from langdetect import detect
from flask_cors import CORS, cross_origin
import requests
import json
from os.path import join, dirname, realpath
import time
import re
import string
import os 


app = Flask(__name__)
CORS(app)

@app.route('/file', methods=['POST'])
def get_task_file():
    if 'file' not in request.files:
        abort(400)
    file = request.files['file']

    abort(400)
    return 'Something went wrong, try again!'


@app.route('/url', methods=['POST'])
def get_task_url():
    response_obj = {}
    print(request.data)  

    # TEXT EXTRACT
    url = 'http://linkedsdg.apps.officialstatistics.org/text/apiURL'
    payload = str(request.data, "utf-8")
  
    r1 = requests.request("POST", url, data=payload)
    # r = requests.post(url, data=payload) 
 

    response_obj["textAPI"] = r1.json()


    url2 = 'http://linkedsdg.apps.officialstatistics.org/concepts/api'
    payload2 = json.dumps(response_obj["textAPI"])
    headers2 = {'Content-type': 'application/json'} 
    r2 = requests.request("POST", url2, data=payload2, headers=headers2)
    
    
    response_obj["contextExtractedAPI"] = r2.json()
 

    return json.dumps(response_obj)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=False)
