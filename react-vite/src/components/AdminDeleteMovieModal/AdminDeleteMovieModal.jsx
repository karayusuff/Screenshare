import { useDispatch } from "react-redux";
import { thunkDeleteMovie } from "../../redux/movies";
import { useModal } from "../../context/Modal";
import "./AdminDeleteMovieModal.css";

const AdminDeleteMovieModal = ({ movieId, movieTitle }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const result = await dispatch(thunkDeleteMovie(movieId));

    if (!result?.error) {
      closeModal();
    } else {
      alert("Failed to delete the movie. Please try again.");
    }
  };

  return (
    <div className="delete-movie-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete the movie &quot;{movieTitle}&quot;?</p>
      <div className="modal-actions">
        <button onClick={handleDelete} className="delete-button">Yes, Delete</button>
        <button onClick={closeModal} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default AdminDeleteMovieModal;
