from app.models import db, List, environment, SCHEMA
from sqlalchemy.sql import text

def seed_lists():
    seed_data = [
        List(
            user_id=1,
            name="Favourites",
            list_type="Default"
        ),
        List(
            user_id=2,
            name="Watchlist",
            list_type="Default"
        ),
        List(
            user_id=3,
            name="Watched",
            list_type="Default"
        ),
        List(
            user_id=1,
            name="Best Action Movies",
            list_type="Custom"
        ),
        List(
            user_id=2,
            name="Comfort Movies",
            list_type="Custom"
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_lists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.lists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM lists"))
        
    db.session.commit()
