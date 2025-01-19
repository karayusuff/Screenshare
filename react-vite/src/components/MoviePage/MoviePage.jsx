import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetMovieById, clearMovie } from "../../redux/movies";
import { thunkGetReviewsByMovie } from "../../redux/reviews";
import "./MoviePage.css";

const MoviePage = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.movies.movie);
  const reviews = useSelector((state) => state.reviews.reviews);

  useEffect(() => {
    dispatch(thunkGetMovieById(movieId));
    dispatch(thunkGetReviewsByMovie(movieId));
    return () => dispatch(clearMovie());
  }, [dispatch, movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const averageRating = () => {
    if (!reviews.length) return "No ratings yet.";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="movie-page">
      <div className="movie-details">
        <img src={movie.poster_url} title={movie.title} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p><strong>Release Date:</strong> {movie.release_date || "Unknown"}</p>
          <p><strong>Genres:</strong> {movie.genres || "N/A"}</p>
          <p><strong>Director:</strong> {movie.director || "N/A"}</p>
          <p><strong>Stars:</strong> {movie.stars || "N/A"}</p>
          <p><strong>Average Rating:</strong> {averageRating()}</p>
          <p className="movie-description">{movie.description}</p>
        </div>
      </div>
      <div className="movie-reviews">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p><strong>{review.username}</strong>: {review.review_text}</p>
              <p>Rating: {review.rating}/10</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
