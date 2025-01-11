from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), nullable=False)
    review_text = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=func.now(), server_default=func.now(), nullable=False)

    user = db.relationship("User", back_populates="reviews")
    movie = db.relationship("Movie", back_populates="reviews")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'movie_id': self.movie_id,
            'review_text': self.review_text,
            'rating': self.rating,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
