from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import db, Follow, User

follow_routes = Blueprint('/follows', __name__)


@follow_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def follow_user(user_id):
    """
    Follows a user
    """
    if user_id == current_user.id:
        return jsonify({"error": "You cannot follow yourself."}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    existing_follow = Follow.query.filter_by(follower_id=current_user.id, following_id=user_id).first()
    if existing_follow:
        return jsonify({"error": "You are already following this user."}), 400
    
    new_follow = Follow(follower_id=current_user.id, following_id=user_id)
    db.session.add(new_follow)
    db.session.commit()
    return jsonify ({"message": f"You are now following {user.username}."}), 201


@follow_routes.route('/<int:user_id>', methods=['DELETE'])
@login_required
def unfollow_user(user_id):
    """
    Unfollows a user
    """
    user = User.query.get(user_id)

    existing_follow = Follow.query.filter_by(follower_id=current_user.id, following_id=user_id).first()
    if not existing_follow:
        return jsonify({"error": "You are not following this user."}), 400    
    
    db.session.delete(existing_follow)
    db.session.commit()
    return jsonify({"message": f"You have unfollowed {user.username} successfully."}), 200