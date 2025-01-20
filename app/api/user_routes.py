from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Follow, Review, List, ListMovie
from sqlalchemy.orm import joinedload

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'Users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)

    if not user:
        return {"error": "User not found."}, 404

    return user.to_dict()


@user_routes.route('/top-users')
def get_top_users():
    """
    Returns top 5 users with most followers
    """
    users = User.query.outerjoin(Follow, Follow.following_id == User.id).group_by(User.id).order_by(db.func.count(Follow.id).desc()).limit(5).all()
    return jsonify({"TopUsers": [user.to_dict() for user in users]}), 200


@user_routes.route('/top-scorers')
def get_top_scorers():
    """
    Returns top 5 users with most points
    """
    users = User.query.order_by(User.total_points.desc()).limit(5).all()
    return jsonify({"TopScorers": [user.to_dict() for user in users]}), 200


@user_routes.route('/<int:id>/status', methods=['PUT'])
@login_required
def update_user_status(id):
    """
    Updates a user's account status
    """
    if not current_user.is_admin:
        return {"error": "Unauthorized."}, 403
    
    user = User.query.get(id)
    
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    data = request.get_json()
    new_status = data.get('status', user.status)

    valid_statuses = ['active', 'restricted', 'deactivated']
    if new_status not in valid_statuses:
        return jsonify({"error": "Invalid status."}), 400
    
    user.status = new_status
    db.session.commit()
    
    return user.to_dict(), 200


@user_routes.route('/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user_account(user_id):
    """
    Deletes a user's account (admin only)
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": f"{user.username}'s account successfully deleted."}), 200


@user_routes.route('/<int:user_id>/followers')
def get_user_followers(user_id):
    """
    Returns a spesific user's followers
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    followers = Follow.query.filter_by(following_id=user_id).order_by(Follow.created_at.desc()).all()

    return jsonify({
        "Followers": [{
            'id': user.follower.id,
            'username': user.follower.username
        } for user in followers]
    }), 200


@user_routes.route('/<int:user_id>/followers-count')
def get_user_followers_count(user_id):
    """
    Returns a spesific user's followers count
    """
    followers_count = Follow.query.filter_by(following_id=user_id).count()
    return jsonify({"followers_count": followers_count}), 200


@user_routes.route('/<int:user_id>/reviews')
def get_user_reviews(user_id):
    """
    Returns all the reviews created by a spesific user
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    reviews = (Review.query.options(joinedload(Review.movie))
               .filter_by(user_id=user_id)
               .order_by(Review.created_at.desc())
               .all()
            )
    return jsonify({
        "Reviews": [{
            **review.to_dict(),
            "movie_poster": review.movie.poster_url,
            "movie_title": review.movie.title
        } for review in reviews]
    }), 200


@user_routes.route('/<int:user_id>/lists')
def get_user_lists(user_id):
    """
    Returns all the lists of a specific user along with their movies
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    lists = List.query.filter_by(user_id=user.id).order_by(List.created_at.desc()).all()

    user_lists = []
    for list_item in lists:
        list_movies = ListMovie.query.filter_by(list_id=list_item.id).all()
        movies = [{
            "id": list_movie.movie.id,
            "title": list_movie.movie.title,
            "poster_url": list_movie.movie.poster_url
        } for list_movie in list_movies]
        user_lists.append({
            "id": list_item.id,
            "user_id": list_item.user_id,
            "name": list_item.name,
            "list_type": list_item.list_type,
            "movies": movies,
            "created_at": list_item.created_at,
            "updated_at": list_item.updated_at
        })

    return jsonify({"Lists": user_lists}), 200


@user_routes.route('/<int:user_id>/following')
def get_user_following(user_id):
    """
    Returns the list of the users that a spesific user is following
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    following = Follow.query.filter_by(follower_id=user_id).order_by(Follow.created_at.desc()).all()

    return jsonify({
        "Following": [{
            'id': user.following.id,
            'username': user.following.username
        } for user in following]
    }), 200


@user_routes.route('/<string:username>')
def get_user_by_username(username):
    """
    Returns a user's profile page
    """
    if username == "admin":
        return jsonify({"error": "Not found"}), 404

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
    return user.to_dict(), 200
