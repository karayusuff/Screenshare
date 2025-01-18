const SET_REVIEWS = "reviews/SET_REVIEWS";

const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews
});

export const thunkGetReviewsByMovie = (movieId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/${movieId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setReviews(data));
    } else {
      console.error("Failed to fetch reviews.");
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

const initialState = { reviews: [] };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.payload };
    default:
      return state;
  }
};

export default reviewsReducer;
