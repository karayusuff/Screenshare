from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required, logout_user
from app.models import db, Follow, List, Review
from app.forms import ListForm

session_routes = Blueprint('session', __name__)


# Profile Endpoints

@session_routes.route('/update-profile', methods=['PUT'])
@login_required
def update_profile():
    """
    Update the profile information of the current user.
    """
    data = request.get_json()
    valid_fields = ['first_name', 'last_name', 'username', 'email', 'password', 'profile_pic_url']

    for field in data.keys():
        if field not in valid_fields:
            return {"error": f"Invalid field: {field}"}, 400

    current_user.first_name = data.get('first_name', current_user.first_name)
    current_user.last_name = data.get('last_name', current_user.last_name)
    current_user.username = data.get('username', current_user.username)
    current_user.email = data.get('email', current_user.email)
    current_user.profile_pic_url = data.get('profile_pic_url', current_user.profile_pic_url)

    if 'password' in data and data['password']:
        current_user.password = data['password']

    db.session.commit()
    return current_user.to_dict(), 200


@session_routes.route('/update-profile-movie', methods=['PUT'])
@login_required
def update_profile_movie():
    """
    Update the welcome movie information of the current user.
    """
    data = request.get_json()
    valid_fields = ['welcome_movie_id', 'welcome_movie_note']

    for field in data.keys():
        if field not in valid_fields:
            return {"error": f"Invalid field: {field}"}, 400
    
    current_user.welcome_movie_id = data.get('welcome_movie_id', current_user.welcome_movie_id)
    current_user.welcome_movie_note = data.get('welcome_movie_note', current_user.welcome_movie_note)

    db.session.commit()
    return current_user.to_dict(), 200


@session_routes.route('/delete-account', methods=['DELETE'])
@login_required
def delete_account():
    """
    Deletes current user account and logs out
    """
    if current_user.is_admin:
        return jsonify({"error": "Admin account cannot be deleted."}), 401

    db.session.delete(current_user)
    db.session.commit()
    logout_user()
    return jsonify({"message": "Your account has been deleted."})


# Follow Endpoints

@session_routes.route('/following')
@login_required
def get_following():
    """
    Get the list of users the current user is following.
    """
    following = Follow.query.filter_by(follower_id=current_user.id).order_by(Follow.created_at.desc()).all()
    
    if not following:
      return jsonify({"message": "You are not following anyone yet."}), 200
    
    return jsonify({
        "Following": [{
            'id': user.following.id,
            'username': user.following.username
        } for user in following]
    }), 200


@session_routes.route('/followers')
@login_required
def get_followers():
    """
    Get the list of users following the current user.
    """
    followers = Follow.query.filter_by(following_id=current_user.id).order_by(Follow.created_at.desc()).all()

    if not followers:
      return jsonify({"message": "You don't have a follower yet."}), 200

    return jsonify({
        "Followers": [{
            'id': user.follower.id,
            'username': user.follower.username
        } for user in followers]
    }), 200


# List Endpoints

@session_routes.route('/lists')
@login_required
def get_user_lists():
    """
    Get all the lists belong to the current user.
    """
    lists = List.query.filter_by(user_id=current_user.id).order_by(List.created_at.desc()).all()

    if not lists:
      return jsonify({"message": "You don't have a list yet."}), 200
    
    return jsonify([list.to_dict() for list in lists]), 200


@session_routes.route('/lists', methods=['POST'])
@login_required
def create_list():
    """
    Create a new custom list for the current user.
    """
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if form.name.data in ["Favourites", "Watchlist", "Watched"]:
            return jsonify({"error": "Cannot create a list with default names"}), 400

        new_list = List(
            name=form.name.data,
            list_type="Custom",
            user_id=current_user.id
        )
        db.session.add(new_list)
        db.session.commit()
        return jsonify(new_list.to_dict()), 201

    return form.errors, 400



# Review Endpoints

@session_routes.route('/reviews')
@login_required
def get_user_reviews():
    """
    Returns all the reviews created by the current user.
    """
    reviews = Review.query.filter_by(user_id=current_user.id).order_by(Review.created_at.desc()).all()

    if not reviews:
      return jsonify({"message": "You haven't added a review yet."}), 200
    
    return jsonify([review.to_dict() for review in reviews]), 200
