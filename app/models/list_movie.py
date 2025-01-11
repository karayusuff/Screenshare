from .db import db, environment, SCHEMA, add_prefix_for_prod


class ListMovie(db.Model):
    __tablename__ = 'list_movies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("lists.id")), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("movies.id")), nullable=False)

    list = db.relationship("List", back_populates="list_movies")
    movie = db.relationship("Movie", back_populates="list_movies")

    def to_dict(self):
        return {
            'id': self.id,
            'list_id': self.list_id,
            'movie_id': self.movie_id
        }
