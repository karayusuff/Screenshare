from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.sql import func


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    status = db.Column(db.String(20), default='active', nullable=False)
    total_points = db.Column(db.Integer, default=0, nullable=False)
    badge = db.Column(db.String(50), default='Newbie', nullable=False)
    welcome_movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), nullable=True)
    welcome_movie_note = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=func.now(), server_default=func.now(), nullable=False)

    lists = db.relationship("List", back_populates="user", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="user", cascade="all, delete-orphan")
    followers = db.relationship("Follow", foreign_keys="[Follow.following_id]", back_populates="following", cascade="all, delete-orphan")
    following = db.relationship("Follow", foreign_keys="[Follow.follower_id]", back_populates="follower", cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def add_points_and_update_badge(self, points):
        self.total_points += points
        if self.total_points >= 50:
            self.badge = "Movie Monster"
        elif self.total_points >= 20:
            self.badge = "Movie Enthusiast"
        else:
            self.badge = "Newbie"
        db.session.commit()

    def create_default_lists(self):
        from app.models import List
        
        default_lists = [
            {"name": "Favourites", "list_type": "Default", "user_id": self.id},
            {"name": "Watchlist", "list_type": "Default", "user_id": self.id},
            {"name": "Watched", "list_type": "Default", "user_id": self.id}
        ]
        for default_list in default_lists:
            new_list = List(**default_list)
            db.session.add(new_list)
        db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'status': self.status,
            'total_points': self.total_points,
            'badge': self.badge,
            'welcome_movie_id': self.welcome_movie_id,
            'welcome_movie_note': self.welcome_movie_note,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }