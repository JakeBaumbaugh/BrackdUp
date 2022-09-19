"""Main app for tournament site"""
import os

from flask import Flask, jsonify

import db

def create_app(test_config=None):
    """Create the running app"""
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'db.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    import tournament
    app.register_blueprint(tournament.bp)

    @app.route("/api/")
    def test_route():
        return jsonify("200 OK")

    return app
