from flask_wtf import FlaskForm
from wtforms import TextAreaField, IntegerField
from wtforms.validators import DataRequired, NumberRange

class ReviewForm(FlaskForm):
    review_text = TextAreaField('Review')
    rating = IntegerField('Rating', validators=[DataRequired(), NumberRange(min=1, max=10)])