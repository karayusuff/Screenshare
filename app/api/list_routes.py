from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import db, List
from app.forms import ListForm

list_routes = Blueprint('lists', __name__)


@list_routes.route('/')
def get_all_lists():
    """
    Returns all lists
    """
    lists = List.query.order_by(List.created_at.desc()).all()
    return jsonify({"Lists": [list.to_dict() for list in lists]}), 200


@list_routes.route('/<int:list_id>', methods=['PUT'])
@login_required
def update_list(list_id):
    """
    Updates a list belogs to the current user.
    """
    list = List.query.get(list_id)
    if not list:
        return jsonify({"error": "List not found."}), 404
    
    if current_user.id != list.user_id:
        return jsonify({"error": "Unauthorized."}), 401

    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        list.name = form.name.data or list.name

        db.session.commit()
        return jsonify(list.to_dict()), 200
    
    return form.errors, 400


@list_routes.route('/<int:list_id>', methods=['DELETE'])
@login_required
def delete_list(list_id):
    """
    Deletes a list belogs to the current user.
    """
    list = List.query.get(list_id)
    if not list:
        return jsonify({"error": "List not found."}), 404
    
    if current_user.id != list.user_id:
        return jsonify({"error": "Unauthorized."}), 401
    
    db.session.delete(list)
    db.session.commit()
    return jsonify({"message": "List deleted successfully."}), 200