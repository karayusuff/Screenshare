import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigateTo } from "../../utils/navigation";
import { thunkGetMovieById, clearMovie } from "../../redux/movies";
import { thunkGetReviewsByMovie } from "../../redux/reviews";
import { useModal } from "../../context/Modal";
import AddToListModal from "../AddToList/AddToListModal";
import AdminEditMovieModal from "../AdminEditMovieModal/AdminEditMovieModal";
import AdminDeleteMovieModal from "../AdminDeleteMovieModal/AdminDeleteMovieModal";
import "./MoviePage.css";
import { FaCog } from "react-icons/fa";

const MoviePage = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const navigateToUser = useNavigateTo("users");
  const { setModalContent } = useModal();
  const movie = useSelector((state) => state.movies.movie);
  const reviews = useSelector((state) => state.reviews.reviews);
  const currentUser = useSelector((state) => state.session.user);

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    dispatch(thunkGetMovieById(movieId));
    dispatch(thunkGetReviewsByMovie(movieId));
    return () => dispatch(clearMovie());
  }, [dispatch, movieId]);

  const openAddToListModal = () => {
    setModalContent(<AddToListModal movieId={movieId} />);
  };

  const openEditMovieModal = () => {
    setModalContent(<AdminEditMovieModal movie={movie} />);
  };

  const openDeleteMovieModal = () => {
    setModalContent(<AdminDeleteMovieModal movieId={movie.id} movieTitle={movie.title} />);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      setShowMenu(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

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
          <div className="movie-header">
            <h1>{movie.title}</h1>
            {currentUser?.is_admin && (
              <div className="settings-container">
                <FaCog className="settings-icon" onClick={toggleMenu} />
                {showMenu && (
                  <ul className="dropdown-menu">
                    <li onClick={openEditMovieModal}>Edit Movie</li>
                    <li onClick={openDeleteMovieModal}>Delete Movie</li>
                  </ul>
                )}
              </div>
            )}
          </div>
          <p><strong>Release Date:</strong> {movie.release_date || "Unknown"}</p>
          <p><strong>Genres:</strong> {movie.genres || "N/A"}</p>
          <p><strong>Director:</strong> {movie.director || "N/A"}</p>
          <p><strong>Stars:</strong> {movie.stars || "N/A"}</p>
          <p><strong>Average Rating:</strong> {averageRating()}</p>
          <p className="movie-description">{movie.description}</p>
          {!currentUser?.is_admin && (
            <button onClick={openAddToListModal} className="add-to-list-button">
              Add to Your List
            </button>
          )}
        </div>
      </div>
      <div className="movie-reviews">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p><strong onClick={() => navigateToUser(review.username)}>{review.username}</strong>: {review.review_text}</p>
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
