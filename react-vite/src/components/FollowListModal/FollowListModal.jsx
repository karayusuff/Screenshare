import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkFollowUser, thunkUnfollowUser } from "../../redux/follows";
import "./FollowListModal.css";

const FollowListModal = ({ type, userId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsers = () => {
      const endpoint =
        type === "followers"
          ? `/api/users/${userId}/followers`
          : `/api/users/${userId}/following`;
      
      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          setUsers(data[type === "followers" ? "Followers" : "Following"]);
        })
        .catch((err) => {
          console.error(err);
          setErrors((prev) => ({ ...prev, fetch: "Failed to load users." }));
        });
    };
    
    fetchUsers();
  }, [type, userId]);

  const handleFollow = async (followUserId) => {
    try {
      await dispatch(thunkFollowUser(followUserId));
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === followUserId ? { ...user, isFollowed: true } : user
        )
      );
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, follow: "Failed to follow user." }));
    }
  };

  const handleUnfollow = async (followUserId) => {
    try {
      await dispatch(thunkUnfollowUser(followUserId));
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === followUserId ? { ...user, isFollowed: false } : user
        )
      );
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, unfollow: "Failed to unfollow user." }));
    }
  };

  if (errors.fetch) return <div>{errors.fetch}</div>;

  return (
    <div className="follow-list-modal">
      <h2>{type === "followers" ? "Followers" : "Following"}</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <img src={user.profile_pic_url} alt={`${user.username}'s avatar`} />
              <span>{user.username}</span>
              {currentUser.id !== user.id && (
                <button
                  onClick={() =>
                    user.isFollowed
                      ? handleUnfollow(user.id)
                      : handleFollow(user.id)
                  }
                >
                  {user.isFollowed ? "Unfollow" : "Follow"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowListModal;