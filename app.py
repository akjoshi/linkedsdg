#!flask/bin/python

from flask import Flask, request, abort
from tika import parser
from flask_cors import CORS, cross_origin
import requests
from os.path import join, dirname, realpath


UPLOADS_PATH = join(dirname(realpath(__file__)), 'static/uploads/..')
ALLOWED_EXTENSIONS = set(['pdf', 'doc', 'html', 'docx'])


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://34.66.148.181:3000"}})


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
        return ' '.join(text['content'].split())

    abort(400)
    return 'Something went wrong, try again!'


@app.route('/apiURL', methods=['POST'])
def get_task_url():
    response = requests.get(request.data)

    h = requests.head(request.data, allow_redirects=True)
    header = h.headers
    content_type = header.get('content-type')

    response.raw.decode_content = True
    if response.status_code == 200:
        if content_type == 'application/pdf':
            return ' '.join(parser.from_buffer(response.content)['content'].split())
        else:
            return ' '.join(parser.from_buffer(response.text)['content'].split())

    abort(400)
    return 'Something went wrong, try again!'


if __name__ == '__main__':
    app.run(port=5001, debug=False, host="0.0.0.0")
