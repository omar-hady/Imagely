from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/explore')
def explore():
    return render_template('explore.html')

@app.route('/save')
def save():
    return render_template('save.html')