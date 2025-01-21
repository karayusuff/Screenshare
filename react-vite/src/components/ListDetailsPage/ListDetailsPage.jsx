import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useNavigateTo } from "../../utils/navigation";
import { thunkGetListDetails } from "../../redux/lists";
import { useModal } from "../../context/Modal";
import "./ListDetailsPage.css";

const ListDetailsPage = () => {
  const { listId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateToMovie = useNavigateTo("movies");
  const currentUser = useSelector((state) => state.session.user);
  const listDetails = useSelector((state) => state.lists.listDetails);
  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    if (listId) {
      dispatch(thunkGetListDetails(listId));
    }
  }, [dispatch, listId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        closeModal();
        navigate(-1); // Bir önceki sayfaya yönlendir
      } else {
        const data = await response.json();
        alert(data.error || "An error occurred.");
      }
    } catch (error) {
      alert("Failed to delete the list.");
    }
  };

  const openDeleteModal = () => {
    setModalContent(
      <div>
        <h3>Are you sure you want to delete this list?</h3>
        <button onClick={handleDelete}>Yes, Delete</button>
        <button onClick={closeModal}>No, Cancel</button>
      </div>
    );
  };

  if (!listDetails) return <div>Loading...</div>;

  return (
    <div className="list-detail-page">
      <div className="list-header">
        <h1>{listDetails.name}</h1>
        <p>Created by: {listDetails.username}</p>
        {currentUser && currentUser.id === listDetails.user_id && 
        listDetails.list_type === "Custom" && (
          <button onClick={openDeleteModal}>Delete List</button>
        )}
      </div>
      <div className="list-movies">
        {Object.entries(listDetails.movies).length > 0 ? (
          <ul>
            {listDetails.movies.map((movie) => (
              <li key={movie.id}>
                <p>{movie.title}</p>
                <img 
                src={movie.poster_url} 
                title={movie.title} 
                alt={movie.title}
                onClick={() => navigateToMovie(movie.id)} />
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
