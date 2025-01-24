import { useModal } from "../../context/Modal";
import AdminAddMovieModal from "./AdminAddMovieModal";
import "./AddMovieButton.css";

const AddMovieButton = () => {
  const { setModalContent } = useModal();

  return (
    <button
      className="add-movie-button"
      onClick={() => setModalContent(<AdminAddMovieModal />)}
    >
      + Add Movie
    </button>
  );
};

export default AddMovieButton;
