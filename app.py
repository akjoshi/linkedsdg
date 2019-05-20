#!flask/bin/python
from flask import Flask, flash, request, redirect
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
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        if filename.split('.')[-1] == 'pdf':
            text = parser.from_file(filename)
            return text['content']
        if filename.split('.')[-1] == 'doc':
            return "DOC FILE"
        if filename.split('.')[-1] == 'html':
            return "HTML FILE"

    flash("Something went wrong, try again!")
    return redirect(request.url)


if __name__ == '__main__':
    app.run(debug=True)
