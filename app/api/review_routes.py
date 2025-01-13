from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Review
from app.forms import ReviewForm

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/')
def get_all_reviews():
    """
    Returns all reviews
    """
    reviews = Review.query.all()
    return jsonify({"Reviews": [review.to_dict() for review in reviews]}), 200


@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    """
    Updates a review
    """
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found."}), 404
    
    if current_user.id != review.user_id:
        return jsonify({"error": "Unauthorized."}), 401
    
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        review.review_text = form.review_text.data or review.review_text
        review.rating = form.rating.data or review.rating

        db.session.commit()
        return jsonify(review.to_dict()), 200
    
    return form.errors, 400


@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    """
    Deletes a review
    """
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found."}), 404
    
    if current_user.id != review.user_id:
        return jsonify({"error": "Unauthorized."}), 401
    
    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted successfully."}), 200