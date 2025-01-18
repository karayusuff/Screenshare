import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetMovieOfTheDay } from "../../redux/movies";
import { thunkGetReviewsByMovie } from "../../redux/reviews";
import { thunkGetRecentLists } from "../../redux/lists";
import './LandingPage.css'

export default function LandingPage() {
  const dispatch = useDispatch();
  const movieOfTheDay = useSelector((state) => state.movies.movieOfTheDay);
  const reviews = useSelector((state) => state.reviews.reviews);
  const recentLists = useSelector((state) => state.lists.recentLists);

  useEffect(() => {
    dispatch(thunkGetMovieOfTheDay());
    const interval = setInterval(() => {
      dispatch(thunkGetMovieOfTheDay());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (movieOfTheDay) {
      dispatch(thunkGetReviewsByMovie(movieOfTheDay.id));
    }
  }, [movieOfTheDay, dispatch]);

  useEffect(() => {
    dispatch(thunkGetRecentLists());
  }, [dispatch]);  

  if (!movieOfTheDay) return <h2>Loading...</h2>;

  return (
    <div className="landing-page">
      <h1>Movie of the Day</h1>
      <div className="movie-details">
        <img src={movieOfTheDay.poster_url} title={movieOfTheDay.title} alt={movieOfTheDay.title} />
        <h2>{movieOfTheDay.title}</h2>
        <p>{movieOfTheDay.description}</p>
      </div>
      <div className="recent-reviews">
        <h3>Recent Reviews</h3>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <p><strong>{review.username}:</strong> {review.review_text}</p>
                <p>Rating: {review.rating}/10</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available for this movie.</p>
        )}
      </div>
      <div className="recent-lists">
        <h3>Recent Lists</h3>
        {recentLists.length > 0 ? (
          <ul>
            {recentLists.map((list) => (
              <li key={list.id}>
                <p><strong>{list.name}</strong> by {list.username}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No lists available.</p>
        )}
      </div>
    </div>
  );
}
