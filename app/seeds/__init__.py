from flask.cli import AppGroup
from .users import seed_users, undo_users
from .movies import seed_movies, undo_movies
from .reviews import seed_reviews, undo_reviews
from .lists import seed_lists, undo_lists
from .list_movies import seed_list_movies, undo_list_movies
from .follows import seed_follows, undo_follows

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_follows()
        undo_list_movies()
        undo_lists()
        undo_reviews()
        undo_users()
        undo_movies()
    seed_movies()
    seed_users()
    seed_reviews()
    seed_lists()
    seed_list_movies()
    seed_follows()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_follows()
    undo_list_movies()
    undo_lists()
    undo_reviews()
    undo_users()
    undo_movies()
    # Add other undo functions here
