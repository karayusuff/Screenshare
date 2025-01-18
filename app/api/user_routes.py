from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Follow

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
    if not followers:
      return jsonify({"message": "You don't have a follower yet."}), 200

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