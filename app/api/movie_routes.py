from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Movie, Review
from app.forms import MovieForm, ReviewForm

movie_routes = Blueprint('movies', __name__)


@movie_routes.route('/')
def get_all_movies():
    """
    Returns all movies
    """
    movies = Movie.query.all()
    return jsonify([movie.to_dict() for movie in movies]), 200


@movie_routes.route('/', methods=['POST'])
@login_required
def add_movie():
    """
    Creates a new movie (admin only)
    """
    if not current_user.is_admin:
        return {"error": "Unauthorized access."}, 403

    form = MovieForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_movie = Movie(
            title = form.title.data,
            poster_url = form.poster_url.data,
            description = form.description.data,
            release_date = form.release_date.data,
            genres = form.genres.data,
            director = form.director.data,
            writer = form.writer.data,
            producer = form.producer.data,
            stars = form.stars.data,
            platforms = form.platforms.data
        )        
        db.session.add(new_movie)
        db.session.commit()
        return new_movie.to_dict(), 201

    return form.errors, 400


@movie_routes.route('/<int:movie_id>', methods=['PUT'])
@login_required
def update_movie(movie_id):
    """
    Updates an existing movie (admin only)
    """
    if not current_user.is_admin:
        return {"error": "Unauthorized access."}, 403

    movie = Movie.query.get(movie_id)
    if not movie:
        return {"error": "Movie not found."}, 404

    form = MovieForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        movie.title = form.title.data or movie.title
        movie.poster_url = form.poster_url.data or movie.poster_url
        movie.description = form.description.data or movie.description
        movie.release_date = form.release_date.data or movie.release_date
        movie.genres = form.genres.data or movie.genres
        movie.director = form.director.data or movie.director
        movie.writer = form.writer.data or movie.writer
        movie.producer = form.producer.data or movie.producer
        movie.stars = form.stars.data or movie.stars
        movie.platforms = form.platforms.data or movie.platforms

        db.session.commit()
        return movie.to_dict(), 200

    return {"errors": form.errors}, 400


@movie_routes.route('/<int:movie_id>', methods=['DELETE'])
@login_required
def delete_movie(movie_id):
    """
    Deletes a movie (admin only)
    """
    if not current_user.is_admin:
        return {"error": "Unauthorized access."}, 403
    
    movie = Movie.query.get(movie_id)
    if not movie:
        return {"error": "Movie not found."}, 404
    
    db.session.delete(movie)
    db.session.commit()
    return {"message": "Movie deleted successfully."}, 200


# Review Endpoints

@movie_routes.route('/<int:movie_id>/reviews', methods=['POST'])
@login_required
def add_review(movie_id):
    """
    Adds review to a movie
    """
    user_id = current_user.id
    movie = Movie.query.get(movie_id)
    if not movie:
        return {"error": "Movie not found."}, 404
    
    existing_review = Review.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if existing_review:
        return jsonify({"message": "User already has a review for this movie"}), 400
    
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_review = Review(
            review_text = form.review_text.data,
            rating = form.rating.data,
            user_id = user_id,
            movie_id = movie_id
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.to_dict()), 201
    return form.errors, 400