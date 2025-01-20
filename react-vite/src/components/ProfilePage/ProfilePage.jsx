import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetUserReviews } from "../../redux/reviews";
import { thunkGetUserLists } from "../../redux/lists";
import { thunkGetFollowers, thunkGetFollowing } from "../../redux/follows";
import { thunkGetUserByUsername } from "../../redux/users";
import { thunkGetMovieById } from "../../redux/movies";
import "./ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const currentUser = useSelector((state) => state.session.user);
  const profileUser = useSelector((state) => state.users.userByUsername);
  const reviews = useSelector((state) => state.reviews.userReviews);
  const lists = useSelector((state) => state.lists.userLists);
  const followers = useSelector((state) => state.follows.followers);
  const following = useSelector((state) => state.follows.following);
  const welcomeMovie = useSelector((state) => state.movies.movie);

  useEffect(() => {
    if (username) {
      dispatch(thunkGetUserByUsername(username));
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (profileUser) {
      dispatch(thunkGetUserReviews(profileUser.id));
      dispatch(thunkGetUserLists(profileUser.id));
      dispatch(thunkGetFollowers(profileUser.id));
      dispatch(thunkGetFollowing(profileUser.id));

      if (profileUser.welcome_movie_id) {
        dispatch(thunkGetMovieById(profileUser.welcome_movie_id));
      }
    }
  }, [dispatch, profileUser]);

  if (username === "admin") return <div>Not Found</div>;
  if (!profileUser) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="left-section">
        <div className="profile-card">
          <div className="profile-photo">
            <img
              src={
                profileUser.profile_pic_url ||
                "https://screenshare-app-images.s3.eu-north-1.amazonaws.com/no+pp+image.png"
              }
              alt="Profile Picture"
            />
          </div>
          <div className="profile-stats">
            <p>{profileUser.total_points} points</p>
            <p>{profileUser.badge}</p>
          </div>
          <div className="profile-info">
            <div className="profile-header">
              <h2>@{profileUser.username}</h2>
              {currentUser && currentUser.id === profileUser.id ? (
                <button>Edit Profile</button>
              ) : currentUser && currentUser.is_admin ? (
                <select>
                  <option value="active">Active</option>
                  <option value="restricted">Restricted</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              ) : currentUser && followers.some((follower) => follower.id === currentUser.id) ? (
                <button>Unfollow</button>
              ) : (
                <button>Follow</button>
              )}
            </div>
            <div className="profile-details">
              <p>{profileUser.first_name} {profileUser.last_name}</p>
              <p>
                {lists.filter((list) => list.list_type === "Custom").length}{" "}
                {lists.filter((list) => list.list_type === "Custom").length <= 1 ? "list" : "lists"}
              </p>
              <p>{following.length} following</p>
              <p>{followers.length} {followers.length <= 1 ? "follower" : "followers"}</p>
            </div>
          </div>
          {profileUser.welcome_movie_id && welcomeMovie && (
            <div className="welcome-movie">
              <p>{profileUser.welcome_movie_note}</p>
              <img src={welcomeMovie.poster_url} title={welcomeMovie.title} alt="Welcome Movie" />
            </div>
          )}
        </div>
        <div className="lists-section">
          {currentUser && currentUser.id === profileUser.id ? (
            <h3>Your Lists</h3>
          ) : (
            <h3>{profileUser.username}&apos;s Lists</h3>
          )}
          <div className="default-lists">
            {lists.filter((list) => list.list_type === "Default").map((list) => (
              <div className="list-card" key={list.id}>
                <p>
                  {list.name} ({list.movies.length})
                </p>
                <div className="list-movies">
                  {list.movies.slice(0, 5).map((movie) => (
                    <img key={movie.id} src={movie.poster_url} alt={movie.title} />
                  ))}
                  {list.movies.length > 5 && <button>See All</button>}
                </div>
              </div>
            ))}
          </div>
          <div className="custom-lists">
            <button>See Custom Lists</button>
          </div>
        </div>
      </div>
      <div className="reviews-section">
      {currentUser && currentUser.id === profileUser.id ? (
            <h3>Your recent reviews</h3>
          ) : (
            <h3>{profileUser.username}&apos;s recent reviews</h3>
          )}
        <div className="reviews-list">
          {!reviews.length ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <div className="review-content">
                  {review.review_text ? <p>{review.review_text}</p> : null}
                  <p>☆ {review.rating}/10</p>
                </div>
                <div className="review-movie-poster">
                  <img src={review.movie_poster} title={review.movie_title} alt={review.movie_title} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
