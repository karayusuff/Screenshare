from app.models import db, Follow, environment, SCHEMA
from sqlalchemy.sql import text

def seed_follows():
    seed_data = [
        Follow(
            follower_id=3,
            following_id=2
        ),
        Follow(
            follower_id=4,
            following_id=3
        ),
        Follow(
            follower_id=2,
            following_id=3
        ),
        Follow(
            follower_id=3,
            following_id=4
        ),
        Follow(
            follower_id=4,
            following_id=5
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_follows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM follows"))
        
    db.session.commit()
