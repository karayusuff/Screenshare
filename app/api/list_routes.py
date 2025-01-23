from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import db, List, ListMovie, Movie, User
from app.forms import ListForm
from sqlalchemy.orm import joinedload

list_routes = Blueprint('lists', __name__)


@list_routes.route('/')
def get_all_lists():
    """
    Returns all lists
    """
    lists = List.query.order_by(List.created_at.desc()).all()
    return jsonify({"Lists": [list.to_dict() for list in lists]}), 200


@list_routes.route('/recent')
def get_recent_lists():
    """
    Returns recent 5 custom lists along with their movies
    """
    lists = List.query.options(
        joinedload(List.user),
        joinedload(List.list_movies).joinedload(ListMovie.movie)
    ).filter_by(list_type="Custom").order_by(List.created_at.desc()).limit(5).all()

    return jsonify({
        "Lists": [{
            **list.to_dict(),
            "username": list.user.username,
            "movies": [{
                "id": list_movie.movie.id,
                "title": list_movie.movie.title,
                "poster_url": list_movie.movie.poster_url
            } for list_movie in list.list_movies]
        }  for list in lists]
    }), 200


@list_routes.route('/<int:list_id>')
def get_list_details(list_id):
    """
    Returns a list along with its movies
    """
    list = List.query.get(list_id)
    if not list:
        return jsonify({"error": "List not found"}), 404
    
    user = User.query.get(list.user_id)

    list_movies = ListMovie.query.filter_by(list_id=list_id).all()
    movies = [{
        "id": list_movie.movie_id,
        "title": list_movie.movie.title,
        "poster_url": list_movie.movie.poster_url
    } for list_movie in list_movies]

    return jsonify({
        "id": list.id,
        "user_id": list.user_id,
        "name": list.name,
        "list_type": list.list_type,
        "movies": movies,
        "username": user.username,
        "created_at": list.created_at,
        "updated_at": list.updated_at
    }), 200


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
    
    if list.list_type == 'Default':
        return jsonify({"error": "Cannot change name of a default list."}), 400

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
    if list.list_type != "Custom":
        return jsonify({"error": "You cannot delete a default list."}), 403
    
    if current_user.id != list.user_id:
        return jsonify({"error": "Unauthorized."}), 401
    
    db.session.delete(list)
    db.session.commit()
    return jsonify({"message": "List deleted successfully."}), 200


# List-Movie Routes

@list_routes.route('/<int:list_id>/movies/<int:movie_id>', methods=['POST'])
@login_required
def add_movie_to_list(list_id, movie_id):
    """
    Adds a movie to a list
    """
    list = List.query.get(list_id)
    if not list:
        return jsonify({"error": "List not found", "list_id": list_id}), 404

    if list.user_id != current_user.id:
        return jsonify({"error": "Unauthorized", "user_id": current_user.id}), 401

    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"error": "Movie not found", "movie_id": movie_id}), 404

    existing_movie = ListMovie.query.filter_by(list_id=list_id, movie_id=movie_id).first()
    if existing_movie:
        return jsonify({
            "error": "Movie already in the list",
            "list_id": list_id,
            "movie_id": movie_id
        }), 400

    new_list_movie = ListMovie(list_id=list_id, movie_id=movie_id)
    db.session.add(new_list_movie)
    db.session.commit()
    return jsonify({"message": f"\"{movie.title}\" is added to \"{list.name}\" successfully."}), 200



@list_routes.route('/<int:list_id>/movies/<int:movie_id>', methods=['DELETE'])
@login_required
def remove_movie_from_list(list_id, movie_id):
    """
    Removes a movie from a list
    """
    list = List.query.get(list_id)
    if not list:
        return jsonify({"error": "List not found."}), 404
    
    if list.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 401
    
    existing_movie = ListMovie.query.filter_by(list_id=list_id, movie_id=movie_id).first()
    if not existing_movie:
        return jsonify({"error": "Movie not found in the list"}), 404
    
    movie = Movie.query.get(movie_id)
    db.session.delete(existing_movie)
    db.session.commit()
    return jsonify({"message": f"\"{movie.title}\" is removed from \"{list.name}\" successfully."}), 200