from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/")
def test_route():
    return jsonify("200 OK")