from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class List(db.Model):
    __tablename__ = 'lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(50), nullable=True)
    list_type = db.Column(db.String(25), nullable=False, default='Custom')
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, onupdate=func.now(), server_default=func.now(), nullable=False)

    user = db.relationship("User", back_populates="lists")
    list_movies = db.relationship("ListMovie", back_populates="list", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'list_type': self.list_type,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
