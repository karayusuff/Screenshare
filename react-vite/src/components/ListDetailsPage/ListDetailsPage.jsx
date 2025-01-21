import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigateTo } from "../../utils/navigation";
import { thunkGetListDetails } from "../../redux/lists";
import "./ListDetailsPage.css";

const ListDetailsPage = () => {
  const { listId } = useParams();
  const dispatch = useDispatch();
  const navigateToMovie = useNavigateTo("movies");
  const currentUser = useSelector((state) => state.session.user);
  const listDetails = useSelector((state) => state.lists.listDetails);

  const [isEditingMovies, setIsEditingMovies] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [updatedMovies, setUpdatedMovies] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (listId) {
      dispatch(thunkGetListDetails(listId))
        .catch((error) => setErrors((prev) => ({ ...prev, fetch: error })));
    }
  }, [dispatch, listId]);

  useEffect(() => {
    if (listDetails) {
      setEditedName(listDetails.name);
      setUpdatedMovies(listDetails.movies);
    }
  }, [listDetails]);

  const handleEditNameToggle = () => {
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedName }),
      });

      if (response.ok) {
        setIsEditingName(false);
        dispatch(thunkGetListDetails(listId));
      } else {
        const data = await response.json();
        setErrors((prev) => ({ ...prev, saveName: data.error }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, saveName: error }));
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName(listDetails.name);
  };

  const handleEditMoviesToggle = () => {
    setIsEditingMovies(!isEditingMovies);
  };

  const handleRemoveMovie = async (movieId) => {
    try {
      const response = await fetch(`/api/lists/${listId}/movies/${movieId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUpdatedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
      } else {
        const data = await response.json();
        setErrors((prev) => ({ ...prev, removeMovie: data.error }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, removeMovie: error }));
    }
  };

  if (!listDetails) return <div>Loading...</div>;

  return (
    <div className="list-detail-page">
      <div className="list-header">
        {isEditingName ? (
          <div>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <button onClick={handleSaveName}>Save Changes</button>
            <button onClick={handleCancelEditName}>Cancel</button>
            {errors.saveName && <p className="error-message">{errors.saveName}</p>}
          </div>
        ) : (
          <h1>{listDetails.name}</h1>
        )}
        <p>Created by: {listDetails.username}</p>
        {currentUser && currentUser.id === listDetails.user_id && (
          <div>
            {listDetails.list_type === "Custom" && !isEditingName && !isEditingMovies && (
              <button onClick={handleEditNameToggle}>Edit List Name</button>
            )}
            <button
              onClick={handleEditMoviesToggle}
              disabled={updatedMovies.length === 0}
            >
              {isEditingMovies ? "Done Editing" : "Edit List Movies"}
            </button>
          </div>
        )}
      </div>
      <div className="list-movies">
        {updatedMovies.length > 0 ? (
          <ul>
            {updatedMovies.map((movie) => (
              <li key={movie.id}>
                <p>{movie.title}</p>
                <img
                  src={movie.poster_url}
                  title={movie.title}
                  alt={movie.title}
                  className={isEditingMovies ? "editing-disabled" : ""}
                  onClick={!isEditingMovies ? () => navigateToMovie(movie.id) : undefined}
                />
                {isEditingMovies && (
                  <button onClick={() => handleRemoveMovie(movie.id)}>-</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies in this list.</p>
        )}
      </div>
    </div>
  );
};

export default ListDetailsPage;
