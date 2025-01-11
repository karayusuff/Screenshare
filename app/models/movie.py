from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class Movie(db.Model):
    __tablename__ = 'movies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    poster_url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=True)
    release_date = db.Column(db.Date, nullable=True)
    genres = db.Column(db.String(50), nullable=True)
    director = db.Column(db.String(50), nullable=True)
    stars = db.Column(db.Text, nullable=True)
    writer = db.Column(db.String(50), nullable=True)
    producer = db.Column(db.String(50), nullable=True)
    platforms = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=func.now(), server_default=func.now(), nullable=False)

    reviews = db.relationship("Review", back_populates="movie", cascade="all, delete-orphan")
    list_movies = db.relationship("ListMovie", back_populates="movie", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'poster_url': self.poster_url,
            'description': self.description,
            'release_date': str(self.release_date) if self.release_date else None,
            'genres': self.genres,
            'director': self.director,
            'stars': self.stars,
            'writer': self.writer,
            'producer': self.producer,
            'platforms': self.platforms,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
