from app.models import db, ListMovie, environment, SCHEMA
from sqlalchemy.sql import text

def seed_list_movies():
    seed_data = [
        ListMovie(
            list_id=1,
            movie_id=1
        ),
        ListMovie(
            list_id=1,
            movie_id=2
        ),
        ListMovie(
            list_id=2,
            movie_id=3
        ),
        ListMovie(
            list_id=3,
            movie_id=4
        ),
        ListMovie(
            list_id=4,
            movie_id=5
        ),
        ListMovie(
            list_id=5,
            movie_id=6
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_list_movies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.list_movies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM list_movies"))
        
    db.session.commit()
