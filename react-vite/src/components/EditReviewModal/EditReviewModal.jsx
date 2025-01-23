import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdateReview, thunkGetReviewsByMovie } from "../../redux/reviews";
import { useModal } from "../../context/Modal";
import './EditReviewModal.css'

const EditReviewModal = ({ review, movieId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [reviewText, setReviewText] = useState(review.review_text || "");
  const [rating, setRating] = useState(review.rating || 0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      thunkUpdateReview({ reviewId: review.id, reviewText, rating })
    );

    if (result?.error) {
      setErrors(result.error);
    } else {
      closeModal();
      dispatch(thunkGetReviewsByMovie(movieId));
    }
  };

  return (
    <div className="edit-review-modal">
      <h2>Edit Your Review</h2>
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
        <button type="submit">Save Changes</button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditReviewModal;
