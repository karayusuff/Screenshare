from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    status = db.Column(db.String(20), default='active', nullable=False)
    total_points = db.Column(db.Integer, default=0, nullable=False)
    badge = db.Column(db.String(50), default='Newbie', nullable=False)
    # welcome_movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), nullable=True)
    welcome_movie_id = db.Column(db.Integer, nullable=True)
    welcome_movie_note = db.Column(db.Text, nullable=True)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

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
            'welcome_movie_note': self.welcome_movie_note
        }
    
    def add_points_and_update_badge(self, points):
        self.total_points += points
        if self.total_points >= 50:
            self.badge = "Movie Monster"
        elif self.total_points >= 20:
            self.badge = "Movie Enthusiast"
        else:
            self.badge = "Newbie"
        db.session.commit()
