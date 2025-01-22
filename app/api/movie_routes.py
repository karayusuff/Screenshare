from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Movie, Review
from app.forms import MovieForm, ReviewForm, EditMovieForm
from datetime import datetime, timedelta, timezone
from sqlalchemy.sql import func
from sqlalchemy.orm import joinedload
from app.s3_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3

movie_routes = Blueprint('movies', __name__)


# @movie_routes.route('/')
# def get_all_movies():
#     """
#     Returns all movies
#     """
#     movies = Movie.query.all()
#     return jsonify([movie.to_dict() for movie in movies]), 200


@movie_routes.route('/')
def get_all_movies():
    """
    Adds query filters to get all movies
    """
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=20, type=int)
    movies = Movie.query.paginate(page=page, per_page=limit, error_out=False)
    return jsonify({"Movies": [movie.to_dict() for movie in movies.items]}), 200


@movie_routes.route('/<int:movie_id>')
def get_movie(movie_id):
    """
    Returns a movie by id
    """
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"error": "Movie not found."}), 404
    return jsonify(movie.to_dict()), 200


last_selected_time = None
current_movie = None

@movie_routes.route('/random')
def get_random_movie():
    """
    Returns a random movie
    """
    global last_selected_time, current_movie
    now = datetime.now(timezone.utc)
    if not last_selected_time or now - last_selected_time > timedelta(seconds=15):
        current_movie = Movie.query.order_by(func.random()).first()
        last_selected_time = now
    if not current_movie:
        return jsonify({"error": "No movies found."}), 404
    return current_movie.to_dict(), 200


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
        poster = form.poster.data
        poster.filename = get_unique_filename(poster.filename)
        upload = upload_file_to_s3(poster)
        
        if "url" not in upload:
            return {"errors": "Failed to upload image"}, 400

        new_movie = Movie(
            title=form.title.data,
            poster_url=upload["url"],
            description=form.description.data,
            release_date=form.release_date.data,
            genres=form.genres.data,
            director=form.director.data,
            writer=form.writer.data,
            producer=form.producer.data,
            stars=form.stars.data,
            platforms=form.platforms.data
        )
        
        db.session.add(new_movie)
        db.session.commit()
        return new_movie.to_dict(), 201

    return form.errors, 400


@movie_routes.route('/<int:movie_id>', methods=['PUT'])
@login_required
def update_movie(movie_id):
    """
    Updates a movie's info
    """
    if not current_user.is_admin:
        return {"error": "Unauthorized access."}, 403
    
    movie = Movie.query.get(movie_id)
    if not movie:
        return {"error": "Movie not found."}, 404

    form = EditMovieForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        poster = form.poster.data
        if poster:
            if movie.poster_url:
                remove_file_from_s3(movie.poster_url)
            
            poster.filename = get_unique_filename(poster.filename)
            upload = upload_file_to_s3(poster)
            
            if "url" not in upload:
                return {"errors": "Failed to upload image"}, 400
            
            movie.poster_url = upload["url"]
        
        movie.title = form.title.data
        movie.description = form.description.data
        movie.release_date = form.release_date.data
        movie.genres = form.genres.data
        movie.director = form.director.data
        movie.writer = form.writer.data
        movie.producer = form.producer.data
        movie.stars = form.stars.data
        movie.platforms = form.platforms.data

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

    if movie.poster_url:
        remove_file_from_s3(movie.poster_url)
    
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


@movie_routes.route('/<int:movie_id>/reviews')
def get_reviews_by_movie(movie_id):
    """
    Returns all reviews for a movie
    """
    reviews = Review.query.options(joinedload(Review.user)).filter_by(movie_id=movie_id).order_by(Review.created_at.desc()).all()
    
    return jsonify([{**review.to_dict(), 'username': review.user.username} for review in reviews]), 200