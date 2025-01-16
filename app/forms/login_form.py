from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    credential = field.data
    user = User.query.filter((User.email == credential) | (User.username == credential)).first()
    if not user:
        raise ValidationError('No user found with the provided email or username.')


def password_matches(form, field):
    # Checking if password matches
    password = field.data
    credential = form.data['credential']
    user = User.query.filter((User.email == credential) | (User.username == credential)).first()
    if not user:
        raise ValidationError('No such user exists.')
    if not user.check_password(password):
        raise ValidationError('Password was incorrect.')


class LoginForm(FlaskForm):
    credential = StringField('Email or Username', validators=[DataRequired(), user_exists])
    password = PasswordField('Password', validators=[DataRequired(), password_matches])