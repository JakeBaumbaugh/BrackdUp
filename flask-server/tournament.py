"""Endpoints for retrieving tournament data"""
import json
from flask import Blueprint, jsonify
import db

bp = Blueprint('tournament', __name__, url_prefix='/api/tournament')

@bp.route('/list')
def get_tournament():
    names = db.get_db().execute(
        'SELECT t.name '
        'FROM tournament t '
    ).fetchall()
    return [dict(row) for row in names]