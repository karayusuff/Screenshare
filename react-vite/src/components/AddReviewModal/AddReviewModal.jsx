import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkAddReview } from "../../redux/reviews";
import { useModal } from "../../context/Modal";
import './AddReviewModal.css'

const AddReviewModal = ({ movieId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(thunkAddReview({ movieId, reviewText, rating }));
    if (result?.error) {
      setErrors(result.error);
    } else {
      closeModal();
    }
  };

  return (
    <div className="add-review-modal">
      <h2>Add Your Review</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Review
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </label>
        <label>
          Rating
          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
        </label>
        {/* {errors && <p className="error">{errors}</p>} */}
        {errors && (
          <div className="error-messages">
            {Object.entries(errors).map(([key, message], idx) => (
              <p key={idx}>
                <strong>{key}:</strong> {message}
              </p>
            ))}
          </div>
        )}
        <button type="submit">Post Your Review</button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddReviewModal;
