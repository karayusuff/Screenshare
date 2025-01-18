import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetMovieOfTheDay } from "../../redux/movies";
import { thunkGetReviewsByMovie } from "../../redux/reviews";
import { thunkGetRecentLists } from "../../redux/lists";
import { thunkGetTopUsers, thunkGetTopScorers } from "../../redux/users";
import { thunkGetFollowersCount } from "../../redux/follows";
import './LandingPage.css'

export default function LandingPage() {
  const dispatch = useDispatch();
  const movieOfTheDay = useSelector((state) => state.movies.movieOfTheDay);
  const reviews = useSelector((state) => state.reviews.reviews);
  const recentLists = useSelector((state) => state.lists.recentLists);
  const topUsers = useSelector((state) => state.users.topUsers);
  const topScorers = useSelector((state) => state.users.topScorers);
  const followersCount = useSelector((state) => state.follows.followersCount);


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
    dispatch(thunkGetTopUsers());
    dispatch(thunkGetTopScorers());
  }, [dispatch]);


  useEffect(() => {
    if (topUsers.length > 0) {
      dispatch(thunkGetFollowersCount(topUsers));
    }
  }, [topUsers, dispatch]);
  

  if (!movieOfTheDay) return <h2>Loading...</h2>;


  return (
    <div className="landing-page">
      <span className="slogan">Lights, Camera, Socialize!</span>
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
      <div className="leaderboard">
        <h3>Leaderboard</h3>
        <div className="leaderboard-container">
          <div className="leaderboard-section">
            <h4>Top Users</h4>
            {topUsers.length > 0 ? (
              <ul>
                {topUsers.map((user) => (
                  <li key={user.id}>
                    <p><strong>{user.username}</strong> ({followersCount[user.id]} followers)</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data available.</p>
            )}
          </div>
          <div className="leaderboard-section">
            <h4>Top Scorers</h4>
            {topScorers.length > 0 ? (
              <ul>
                {topScorers.map((user) => (
                  <li key={user.id}>
                    <p><strong>{user.username}</strong> {user.badge} ({user.total_points} points)</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
