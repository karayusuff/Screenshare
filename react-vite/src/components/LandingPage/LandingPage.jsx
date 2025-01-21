import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigateTo } from "../../utils/navigation";
import { thunkGetMovieOfTheDay } from "../../redux/movies";
import { thunkGetReviewsByMovie } from "../../redux/reviews";
import { thunkGetRecentLists } from "../../redux/lists";
import { thunkGetTopUsers, thunkGetTopScorers } from "../../redux/users";
import { thunkGetFollowersCount } from "../../redux/follows";
import './LandingPage.css'

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigateToMovie = useNavigateTo('movies');
  const navigateToList = useNavigateTo('lists');
  const navigateToUser = useNavigateTo('users');
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
    }, 15000);
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

  if (!movieOfTheDay) return <div>Loading...</div>;

  return (
    <div className="landing-page">
      <div className="main-content">
        <div className="movie-section">
          {/* <h1>Movie of the Day</h1> */}
          <div className="movie-details-landing">
            <img
              src={movieOfTheDay.poster_url}
              title={movieOfTheDay.title}
              alt={movieOfTheDay.title}
              onClick={() => navigateToMovie(movieOfTheDay.id)}
            />
            <h2>{movieOfTheDay.title}</h2>
            <p>{movieOfTheDay.description}</p>
          </div>
          <div className="recent-reviews">
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
        </div>
        <div className="right-section">
          <div className="recent-lists">
            <h3>Recent Lists</h3>
            {recentLists.length > 0 ? (
              <ul>
                {recentLists.map((list) => (
                  <li key={list.id}>
                    <p><strong onClick={() => navigateToList(list.id)}>{list.name}</strong> by <span onClick={() => navigateToUser(list.username)}>{list.username}</span></p>
                    <div className="list-movies">
                      {list.movies.slice(0, 5).map((movie) => (
                        <img 
                        key={movie.id} 
                        src={movie.poster_url} 
                        title={movie.title} 
                        alt={movie.title}
                        onClick={() => navigateToMovie(movie.id)} />
                      ))}
                      {list.movies.length > 5 && (
                        <button onClick={() => navigateToList(list.id)}>See All</button>
                      )}
                    </div>
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
                        <p><strong onClick={() => navigateToUser(user.username)}>{user.username}</strong> ({followersCount[user.id]} followers)</p>
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
                        <p><strong onClick={() => navigateToUser(user.username)}>{user.username}</strong> {user.badge} ({user.total_points} points)</p>
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
      </div>
    </div>
  );
}

export default LandingPage;