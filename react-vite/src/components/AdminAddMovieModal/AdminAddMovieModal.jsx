import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateMovie } from "../../redux/movies";
import "./AdminAddMovieModal.css";

const AdminAddMovieModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState(null);
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genres, setGenres] = useState("");
  const [director, setDirector] = useState("");
  const [writer, setWriter] = useState("");
  const [producer, setProducer] = useState("");
  const [stars, setStars] = useState("");
  // const [platforms, setPlatforms] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (poster) formData.append("poster", poster);
    formData.append("description", description);
    formData.append("release_date", releaseDate);
    formData.append("genres", genres);
    formData.append("director", director);
    formData.append("writer", writer);
    formData.append("producer", producer);
    formData.append("stars", stars);
    // formData.append("platforms", platforms);

    setLoading(true);

    const result = await dispatch(thunkCreateMovie(formData));

    setLoading(false);

    if (result?.error) {
      setErrors(result.error);
      // setErrors(JSON.stringify(result.error));
    } else {
      closeModal();
    }
  };

  return (
    <div className="admin-add-movie-modal">
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPoster(e.target.files[0])}
        />
        {errors.poster && <p className="error-message">{errors.poster}</p>}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        {errors.release_date && <p className="error-message">{errors.release_date}</p>}
        <input
          type="text"
          placeholder="Genres"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
        />
        <input
          type="text"
          placeholder="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
        />
        <input
          type="text"
          placeholder="Writer"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Producer"
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
        />
        <input
          type="text"
          placeholder="Stars"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
        />
        {/* <input
          type="text"
          placeholder="Platforms"
          value={platforms}
          onChange={(e) => setPlatforms(e.target.value)}
        /> */}
        {/* {Object.values(errors).map((err, idx) => (
          <p key={idx} className="error-message">
            {err}
          </p>
        ))} */}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add Movie"}
        </button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminAddMovieModal;
