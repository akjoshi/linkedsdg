#!flask/bin/python
from flask import Flask, request, abort
from werkzeug.utils import secure_filename
from tika import parser


ALLOWED_EXTENSIONS = set(['pdf', 'doc', 'html'])

app = Flask(__name__)


@app.route('/')
def index():
    return "Hello, World!"


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api', methods=['GET'])
def get_task():
    if 'file' not in request.files:
        return {'message': 'No file part'}, 400
    file = request.files['file']
    if file.filename == '':
        return {'message': 'No selected file'}, 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        text = parser.from_file(filename)
        return ' '.join(text['content'].split())

    return 'Something went wrong, try again!'


if __name__ == '__main__':
    app.run(debug=True)
