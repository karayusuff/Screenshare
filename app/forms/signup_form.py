from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError, URL, Optional
from flask_wtf.file import FileRequired, FileField, FileAllowed
from app.models import User
from app.s3_helpers import ALLOWED_EXTENSIONS


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


def is_not_alpha(form, field):
    if not field.data.isalpha():
        raise ValidationError(f'{field.label.text} must contain only letters.')


class SignUpForm(FlaskForm):
    profile_pic_url = FileField('Profile Picture', validators=[
        Optional(), 
        FileAllowed(list(ALLOWED_EXTENSIONS))
    ])
    first_name = StringField('First Name', validators=[DataRequired(), is_not_alpha])
    last_name = StringField('Last Name', validators=[DataRequired(), is_not_alpha])
    username = StringField('Username', validators=[DataRequired(), username_exists])
    email = StringField('Email', validators=[DataRequired(), Email(), user_exists])
    password = PasswordField('Password', validators=[DataRequired()])
