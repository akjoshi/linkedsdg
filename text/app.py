#!flask/bin/python

from flask import Flask, request, abort, Response
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

graphdb_url = os.environ['GRAPHDB_URL']
graphdb_repo = os.environ['GRAPHDB_REPO']
graphdb_use_https = os.environ['GRAPHDB_USE_HTTPS']
graphdb_port = os.environ['GRAPHDB_PORT']

UPLOADS_PATH = join(dirname(realpath(__file__)), 'static/uploads/..')
ALLOWED_EXTENSIONS = set(['pdf', 'doc', 'html', 'docx'])


app = Flask(__name__)
CORS(app)

# CORS(app, resources={r"/*": {"origins": ["http://34.66.148.181:3000","http://sdg-links.org"]}})

# def normalise_white_space(text):
#     text = re.sub(' +',' ', text)
#     text = re.sub('\n',' ', text)
#     return text
    
# def shallow_clean(text):
#     label = normalise_white_space(text).lower()
#     for char in string.punctuation:
#         text = label.replace(char, ' ')
#     text = normalise_white_space(text)
#     return text


@app.route('/')
def index():
    return "Hello, World!"


@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api', methods=['POST'])
def get_task():
    if 'file' not in request.files:
        abort(400)
    file = request.files['file']
    if file.filename == '':
        abort(400)
    if file and allowed_file(file.filename):
        text = parser.from_buffer(file.read())


        result = {
            "lang": detect(text['content']),
            "text": text['content'],
            "size": True
        }

        if(text['content'].__len__() > 70000):
            result["size"] = False

        return Response(json.dumps(result), mimetype='application/json')

    abort(400)
    return 'Something went wrong, try again!'


@app.route('/apiURL', methods=['POST'])
def get_task_url():
    response = requests.get(request.data, stream=True)
    response.raw.decode_content = True
    #if response.status_code == 200:

    text = parser.from_buffer(response.content)
    
    result = {
        "lang": detect(text['content']),
        "text": text['content'],
        "size": True
    }

    if(text['content'].__len__() > 70000):
        result["size"] = False

    return Response(json.dumps(result), mimetype='application/json')

    #abort(400)
    #return 'Something went wrong, try again!'

@app.route('/apiURLcashed', methods=['POST'])
def get_task_url_cashed():

    result = {
        "spacy": "",
        "query": ""
    }
    print(request.data)
    print(dir(request))
    
    with open(request.data, encoding='utf-8') as json_file:
        
        #print(type(request.data))
        result = json.load(json_file)

    print(result)

    return Response(json.dumps(result), mimetype='application/json')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=False)