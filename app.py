#!flask/bin/python
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

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
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        print("FILENAME: " + filename)
        return file.read()

    return "Something went wrong, try again!"


if __name__ == '__main__':
    app.run(debug=True)
