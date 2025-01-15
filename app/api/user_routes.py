from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)

    if not user:
        return {"error": "User not found."}, 404

    return user.to_dict()


@user_routes.route('/<int:id>/status', methods=['PUT'])
@login_required
def update_user_status(id):
    if not current_user.is_admin:
        return {"error": "Unauthorized access."}, 403
    
    user = User.query.get(id)
    
    if not user:
        return {"error": "User not found."}, 404
    
    data = request.get_json()
    user.status = data.get('status', user.status)
    db.session.commit()
    
    return user.to_dict()


@user_routes.route('/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user_account(user_id):
    """
    Deletes a user's account (admin only)
    """
    user_to_delete = User.query.get(user_id)
    if not user_to_delete:
        return jsonify({"error": "User not found."}), 404
    
    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403
    db.session.delete(user_to_delete)
    db.session.commit()
    return jsonify({"message": f"{user_to_delete.username}'s account successfully deleted."}), 200