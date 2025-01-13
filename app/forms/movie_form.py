from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField
from wtforms.validators import DataRequired, URL

class MovieForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    poster_url = StringField('Poster URL', validators=[DataRequired(), URL()])
    description = TextAreaField('Description')
    release_date = DateField('Release Date')
    genres = StringField('Genres')
    director = StringField('Director')
    writer = StringField('Writer')
    producer = StringField('Producer')
    stars = StringField('Stars')
    platforms = StringField('Platforms')
