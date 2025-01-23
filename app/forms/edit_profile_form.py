from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError, Optional
from flask_wtf.file import FileField, FileAllowed
from app.models import User
from app.s3_helpers import ALLOWED_EXTENSIONS

def validate_email(self, field):
    if field.data != current_user.email:
        user = User.query.filter(User.email == field.data).first()
        if user:
            raise ValidationError('Email address is already in use.')

def validate_username(self, field):
    if field.data != current_user.username:
        user = User.query.filter(User.username == field.data).first()
        if user:
            raise ValidationError('Username is already in use.')
        
def is_not_alpha(form, field):
    if not field.data.isalpha():
        raise ValidationError(f'{field.label.text} must contain only letters.')        
        
class EditProfileForm(FlaskForm):
    profile_pic_url = FileField('Profile Picture', validators=[
        Optional(),
        FileAllowed(list(ALLOWED_EXTENSIONS))
    ])
    first_name = StringField('First Name', validators=[DataRequired(), is_not_alpha])
    last_name = StringField('Last Name', validators=[DataRequired(), is_not_alpha])
    username = StringField('Username', validators=[DataRequired(), validate_username])
    email = StringField('Email', validators=[DataRequired(), Email(), validate_email])
    password = PasswordField('Password', validators=[Optional()])
