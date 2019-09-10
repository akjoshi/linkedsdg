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


        if(text['content'].__len__() > 70000):
            abort(400)
            return 'Sorry, the file is too big!'

        result = {
            "lang": detect(text['content']),
            "text": text['content']
        }

        return Response(json.dumps(result), mimetype='application/json')

    abort(400)
    return 'Something went wrong, try again!'


@app.route('/apiURL', methods=['POST'])
def get_task_url():
    response = requests.get(request.data, stream=True)
    response.raw.decode_content = True
    if response.status_code == 200:

        text = parser.from_buffer(response.content)
        if(text['content'].__len__() > 70000):
            abort(400)
            return 'Sorry, the file is too big!'

        result = {
            "lang": detect(text['content']),
            "text": text['content']
        }

        return Response(json.dumps(result), mimetype='application/json')

    abort(400)
    return 'Something went wrong, try again!'

@app.route('/apiURLcashed', methods=['POST'])
def get_task_url_cashed():

    result = {
        "spacy": "",
        "query": ""
    }

    with open(request.data) as json_file:
        result = json.load(json_file)

    print(result)

    return Response(json.dumps(result), mimetype='application/json')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=False)
