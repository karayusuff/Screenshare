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