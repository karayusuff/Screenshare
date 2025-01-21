from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, TextAreaField, DateField
from wtforms.validators import DataRequired
from app.s3_helpers import ALLOWED_EXTENSIONS

class MovieForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    poster = FileField('Poster', validators=[
        FileRequired(),
        FileAllowed(list(ALLOWED_EXTENSIONS), 'File type not allowed.')
    ])
    description = TextAreaField('Description')
    release_date = DateField('Release Date')
    genres = StringField('Genres')
    director = StringField('Director')
    writer = StringField('Writer')
    producer = StringField('Producer')
    stars = StringField('Stars')
    platforms = StringField('Platforms')
