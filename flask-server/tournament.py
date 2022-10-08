"""Endpoints for retrieving tournament data"""
from flask import Blueprint
import db

bp = Blueprint('tournament', __name__, url_prefix='/api/tournament')

@bp.route('/list')
def list_tournaments():
    """Retrieve a list of the current tournaments"""
    names = db.get_db().execute(
        'SELECT t.id, t.name '
        'FROM tournament t '
    ).fetchall()
    return [dict(row) for row in names]

@bp.route('/<int:tournament_id>')
def get_tournament(tournament_id):
    """Retrieve data on a tournament"""
    data = db.get_db().execute(
        'SELECT '
        '   t.id, '
        '   t.name, '
        '   tp.id AS phase_id, '
        '   tp.name AS phase_name, '
        '   tm.id AS match_id, '
        '   s1.id AS song_1_id, '
        '   s1.title AS song_1_title, '
        '   s1.artist AS song_1_artist, '
        '   s2.id AS song_2_id, '
        '   s2.title AS song_2_title, '
        '   s2.artist AS song_2_artist, '
        '   tm.song_winner AS song_winner_id '
        'FROM tournament t '
        'LEFT JOIN tournament_phase tp '
        '   ON tp.tournament_id = t.id '
        'LEFT JOIN tournament_match tm '
        '   ON tm.phase_id = tp.id '
        'LEFT JOIN song s1 '
        '   ON s1.id = tm.song_1 '
        'LEFT JOIN song s2 '
        '   ON s2.id = tm.song_2 '
        'WHERE t.id = ? '
        , (tournament_id,)
    ).fetchall()
    return {
        'id': data[0]['id'],
        'name': data[0]['name'],
        'phases': map_phases(data),
    }

@bp.route('/<int:tournament_id>/phase/<int:phase_id>')
def get_tournament_phase(tournament_id, phase_id):
    """Retrieve data on one phase of a tournament"""
    data = db.get_db().execute(
        'SELECT '
        '   tp.id, '
        '   tp.name, '
        '   tp.tournament_id, '
        '   tm.id AS match_id, '
        '   s1.id AS song_1_id, '
        '   s1.title AS song_1_title, '
        '   s1.artist AS song_1_artist, '
        '   s2.id AS song_2_id, '
        '   s2.title AS song_2_title, '
        '   s2.artist AS song_2_artist, '
        '   tm.song_winner AS song_winner_id '
        'FROM tournament_phase tp '
        'LEFT JOIN tournament_match tm '
        '   ON tm.phase_id = tp.id '
        'LEFT JOIN song s1 '
        '   ON s1.id = tm.song_1 '
        'LEFT JOIN song s2 '
        '   ON s2.id = tm.song_2 '
        'WHERE tp.id = ? '
        '   AND tp.tournament_id = ? '
        , (phase_id, tournament_id)
    ).fetchall()
    return {
        'id': data[0]['id'],
        'name': data[0]['name'],
        'tournament_id': data[0]['tournament_id'],
        'matches': [map_match(row) for row in data]
    }

def map_phases(rows):
    """Map database data to phase objects"""
    phase_ids = list({row['phase_id'] for row in rows})
    phase_ids.sort()
    phase_id_map = {phase_ids[i] : i for i in range(len(phase_ids))}
    phases = [{ 'matches': [] } for _ in range(len(phase_ids))]
    for row in rows:
        index = phase_id_map[row['phase_id']]
        print('phase index', index, row['phase_name'])
        phases[index]['id'] = row['phase_id']
        phases[index]['name'] = row['phase_name']
        phases[index]['matches'].append(map_match(row))
    return phases

def map_match(row):
    """Map database data to match objects"""
    return {
        'id': row['match_id'],
        'song_1': {
            'id': row['song_1_id'],
            'title': row['song_1_title'],
            'artist': row['song_1_artist'],
            'is_winner': row['song_1_id'] == row['song_winner_id']
        },
        'song_2': {
            'id': row['song_2_id'],
            'title': row['song_2_title'],
            'artist': row['song_2_artist'],
            'is_winner': row['song_2_id'] == row['song_winner_id']
        }
    }
