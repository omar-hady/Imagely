from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/explore')
def explore():
    return render_template('explore.html')

@app.route('/save')
def save():
    return render_template('save.html')

@app.route('/generate')
def generate():
    return render_template('generate.html')
