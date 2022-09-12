"""Database functions"""
import os
import sqlite3

import click
from flask import current_app, g


def get_db():
    """Retrieve the database"""
    if 'db' not in g:
        print(current_app.config['DATABASE'])
        g.db = sqlite3.connect(current_app.config['DATABASE'], detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db():
    """Close the database"""
    db = g.pop('db', None)
    if db is not None:
        db.close()

@click.command('init-db')
def init_db_command():
    """Initialize the database, run with `flask init-db` in terminal"""
    db = get_db()
    path = os.path.join('db', 'tournament-schema.sql')
    with current_app.open_resource(path) as file:
        db.executescript(file.read().decode('utf8'))
    click.echo('Initialized the database.')

def init_app(app):
    """Add initialize and close database functions to the app"""
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
 