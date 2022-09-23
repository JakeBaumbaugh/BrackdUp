"""Endpoints for retrieving tournament data"""
import json
from flask import Blueprint, jsonify
import db

bp = Blueprint('tournament', __name__, url_prefix='/api/tournament')

@bp.route('/list')
def get_tournament():
    names = db.get_db().execute(
        'SELECT t.id, t.name '
        'FROM tournament t '
    ).fetchall()
    return [dict(row) for row in names]

@bp.route('/<int:tournament_id>/phase/<int:phase_id>')
def get_tournament_phase(tournament_id, phase_id):
    phase = db.get_db().execute(
        'SELECT *'
        'FROM tournament_phase tp '
        'LEFT JOIN tournament_match tm '
        '   ON tm.phase_id = tp.id '
        'WHERE tp.id = ? '
        '   AND tp.tournament_id = ? '
        , (phase_id, tournament_id)
    ).fetchall()
    return {
        'id': phase[0]['id'],
        'matchups': [dict(row) for row in phase]
    }