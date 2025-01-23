import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdateMovie } from "../../redux/movies";
import { useModal } from "../../context/Modal";
import "./AdminEditMovieModal.css";

const AdminEditMovieModal = ({ movie, onEditSuccess }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [title, setTitle] = useState(movie.title || "");
  const [description, setDescription] = useState(movie.description || "");
  const [releaseDate, setReleaseDate] = useState(movie.release_date || "");
  const [genres, setGenres] = useState(movie.genres || "");
  const [director, setDirector] = useState(movie.director || "");
  const [stars, setStars] = useState(movie.stars || "");
  const [poster, setPoster] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("release_date", releaseDate);
    formData.append("genres", genres);
    formData.append("director", director);
    formData.append("stars", stars);
    if (poster) {
      formData.append("poster", poster);
    }

    const result = await dispatch(thunkUpdateMovie(movie.id, formData));

    if (result?.error) {
      // setError(result.error);
      setError(JSON.stringify(result.error));
    } else {
      closeModal();
      onEditSuccess();
    }
  };

  return (
    <div className="edit-movie-modal">
      <h2>Edit Movie</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Poster
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPoster(e.target.files[0])}
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <label>
          Release Date
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </label>
        <label>
          Genres
          <input
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
          />
        </label>
        <label>
          Director
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
          />
        </label>
        <label>
          Stars
          <input
            type="text"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
          />
        </label>
        <div className="modal-actions">
          <button type="submit" className="submit-button">Save Changes</button>
          <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditMovieModal;
