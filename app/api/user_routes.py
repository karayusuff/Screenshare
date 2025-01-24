from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Follow, Review, List, ListMovie
from sqlalchemy.orm import joinedload

user_routes = Blueprint('users', __name__)


# @user_routes.route('/')
# def users():
#     """
#     Query for all users and returns them in a list of user dictionaries
#     """
#     users = User.query.filter(User.is_admin == False).order_by(User.created_at.desc()).all()
#     return jsonify({"Users": [user.to_dict() for user in users]}), 200

@user_routes.route('/')
def search_users():
    """
    Adds query filters to get all users
    """
    query = request.args.get('q', default="", type=str).lower()
    users = User.query.filter(User.is_admin == False, User.username.ilike(f"%{query}%")).all()
    return jsonify({"Users": [user.to_dict() for user in users]}), 200


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
    Returns top users with most followers
    """
    users = User.query.filter(User.is_admin == False)\
        .outerjoin(Follow, Follow.following_id == User.id)\
        .group_by(User.id).order_by(db.func.count(Follow.id).desc()).all()
    return jsonify({"TopUsers": [user.to_dict() for user in users]}), 200


@user_routes.route('/top-scorers')
def get_top_scorers():
    """
    Returns top users with most points
    """
    users = User.query.filter(User.is_admin == False).order_by(User.total_points.desc()).all()
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
    Returns a specific user's followers with profile_pic_url
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    followers = Follow.query.filter_by(following_id=user_id).order_by(Follow.created_at.desc()).all()

    current_user_following = []
    if current_user.is_authenticated:
        current_user_following = [
            follow.following_id for follow in Follow.query.filter_by(follower_id=current_user.id).all()
        ]

    followers_list = []
    for follow in followers:
        follower_user = follow.follower
        followers_list.append({
            'id': follower_user.id,
            'username': follower_user.username,
            'profile_pic_url': follower_user.profile_pic_url,
            'isFollowed': follower_user.id in current_user_following
        })

    return jsonify({"Followers": followers_list}), 200


@user_routes.route('/<int:user_id>/following')
def get_user_following(user_id):
    """
    Returns the list of users a specific user is following with profile_pic_url
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    following = Follow.query.filter_by(follower_id=user_id).order_by(Follow.created_at.desc()).all()

    current_user_following = []
    if current_user.is_authenticated:
        current_user_following = [
            follow.following_id for follow in Follow.query.filter_by(follower_id=current_user.id).all()
        ]

    following_list = []
    for follow in following:
        following_user = follow.following
        following_list.append({
            'id': following_user.id,
            'username': following_user.username,
            'profile_pic_url': following_user.profile_pic_url,
            'isFollowed': following_user.id in current_user_following
        })

    return jsonify({"Following": following_list}), 200


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
