import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigateTo } from "../../utils/navigation";
import "./UserListsPage.css";

const UserListsPage = () => {
  const { username } = useParams();
  const navigateToList = useNavigateTo("lists");
  const [userId, setUserId] = useState(null);
  const [lists, setLists] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserIdByUsername = () => {
      fetch('/api/users')
        .then((res) => res.json())
        .then((data) => {
          const user = data.Users.find((u) => u.username === username);
            setUserId(user.id);
            setIsLoading(false);
        })    
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.error) {
            setErrors((prevErrors) => ({ ...prevErrors, user: data.error }));
          }
          setIsLoading(false);
        });
    };

    if (username) {
      fetchUserIdByUsername();
    }
  }, [username]);

  useEffect(() => {
    if (userId) {
      const fetchUserLists = () => {
        fetch(`/api/users/${userId}/lists`)
          .then((res) => res.json())
          .then((data) => {
            setLists(data.Lists.filter((list) => list.list_type === "Custom"));
            setIsLoading(false);
          })
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.error) {
              setErrors((prevErrors) => ({ ...prevErrors, lists: data.error }));
            }
            setIsLoading(false);
          });
        };

      fetchUserLists();
    }
  }, [userId]);

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
    <div className="user-lists-page">
      <h2>{username}&apos;s Custom Lists</h2>
      <div className="user-lists-container">
        {lists.length === 0 ? (
          <p>No custom lists available.</p>
        ) : (
          lists.map((list) => (
            <div className="user-list-card" key={list.id}>
              <h3 onClick={() => navigateToList(list.id)}>{list.name}</h3>
              <div className="user-list-movies">
                {list.movies.slice(0, 5).map((movie) => (
                  <img
                  key={movie.id}
                  src={movie.poster_url}
                  title={movie.title}
                  alt={movie.title}
                  />
                ))}
                {list.movies.length > 5 && <p>And more...</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserListsPage;