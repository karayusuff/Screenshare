from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reviews():
    seed_data = [
        Review(
            user_id=2,
            movie_id=1,
            review_text="An absolute masterpiece. Nolan at his best!",
            rating=9
        ),
        Review(
            user_id=2,
            movie_id=2,
            review_text="Visually stunning and thought-provoking.",
            rating=7
        ),
        Review(
            user_id=4,
            movie_id=4,
            review_text="A true classic. Tarantino's writing shines.",
            rating=8
        ),
        Review(
            user_id=5,
            movie_id=5,
            review_text="The greatest movie ever made!",
            rating=9
        ),
        Review(
            user_id=2,
            movie_id=6,
            review_text=None,
            rating=10
        ),
        Review(
            user_id=2,
            movie_id=7,
            review_text="A brilliant critique of modern society.",
            rating=5
        ),
        Review(
            user_id=3,
            movie_id=8,
            review_text="Tom Hanks was phenomenal as always.",
            rating=6
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()