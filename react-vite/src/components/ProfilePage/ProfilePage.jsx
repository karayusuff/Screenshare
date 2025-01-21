import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigateTo } from "../../utils/navigation";
import "./ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigateToList = useNavigateTo('lists');
  const { username } = useParams();
  const currentUser = useSelector((state) => state.session.user);
  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [welcomeMovie, setWelcomeMovie] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserByUsername = () => {
      fetch(`/api/users/${username}`)
        .then((res) => res.json())
        .then((data) => {
          setProfileUser(data); 
          setIsLoading(false);
        })  
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.error) {
            setErrors((prevErrors) => ({ ...prevErrors, profileUser: data.error }));
          }
          setIsLoading(false);
        });
    };

    if (username) {
      fetchUserByUsername();
    }
  }, [username]);

  useEffect(() => {
    if (profileUser) {
      const fetchUserReviews = () => {
        fetch(`/api/users/${profileUser.id}/reviews`)
          .then((res) => res.json())
          .then((data) => setReviews(data.Reviews))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.error) {
              setErrors((prevErrors) => ({ ...prevErrors, reviews: data.error }));
            }
          });
      };
      const fetchUserLists = () => {
        fetch(`/api/users/${profileUser.id}/lists`)
          .then((res) => res.json())
          .then((data) => setLists(data.Lists))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.error) {
              setErrors((prevErrors) => ({ ...prevErrors, lists: data.error }));
            }
          });
      };
      const fetchFollowers = () => {
        fetch(`/api/users/${profileUser.id}/followers`)
          .then((res) => res.json())
          .then((data) => setFollowers(data.Followers))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.error) {
              setErrors((prevErrors) => ({ ...prevErrors, followers: data.error }));
            }
          });
      };
      const fetchFollowing = () => {
        fetch(`/api/users/${profileUser.id}/following`)
          .then((res) => res.json())
          .then((data) => setFollowing(data.Following))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.error) {
              setErrors((prevErrors) => ({ ...prevErrors, following: data.error }));
            }
          });
      };
      const fetchWelcomeMovie = () => {
        fetch(`/api/movies/${profileUser.welcome_movie_id}`)
          .then((res) => res.json())
          .then((data) => setWelcomeMovie(data))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.error) {
              setErrors((prevErrors) => ({ ...prevErrors, welcomeMovie: data.error }));
            }
          });
      };
      fetchUserReviews();
      fetchUserLists();
      fetchFollowers();
      fetchFollowing();
      fetchWelcomeMovie();
    }
  }, [profileUser, dispatch]);

  if (username === "admin") return <div>Not Found</div>;
  if (isLoading) return <div>Loading...</div>;
  if (Object.values(errors).length > 0) {
    return (
      <div>
        {Object.entries(errors).map(([key, message]) => (
          <p key={key}>{message}</p>
        ))}
      </div>
    );
  }

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
                    <img key={movie.id} src={movie.poster_url} title={movie.title} alt={movie.title} />
                  ))}
                  {list.movies.length > 5 && (
                    <button onClick={() => navigateToList(list.id)}>See All</button>
                  )}
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
