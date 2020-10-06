#!flask/bin/python
from flask import Flask, request, abort 
from flask_cors import CORS, cross_origin
import requests
import json
from os.path import join, dirname, realpath
import os


app = Flask(__name__)
CORS(app)


@app.route('/whereami', methods=['GET'])
def whereami(): 
    d = dict()
    url = os.getenv('HOST_URL')
    d['HOST_URL'] = url
    return json.dumps(d)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5007, debug=False)
