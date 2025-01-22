const SET_REVIEWS = "reviews/SET_REVIEWS";
const SET_USER_REVIEWS = "reviews/SET_USER_REVIEWS";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
const ADD_REVIEW = "reviews/ADD_REVIEW";

const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews
});

const setUserReviews = (reviews) => ({
  type: SET_USER_REVIEWS,
  payload: reviews
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

export const thunkGetReviewsByMovie = (movieId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/${movieId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setReviews(data));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

export const thunkGetUserReviews = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setUserReviews(data.Reviews));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching user reviews:", error);
  }
};

export const thunkUpdateReview = ({ reviewId, reviewText, rating }) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_text: reviewText, rating }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(thunkGetReviewsByMovie(data.movie_id));
      return data;
    } else {
      const errorData = await response.json();
      return { error: errorData };
    }
  } catch (error) {
    console.error("Error updating review:", error);
    return { error: { server: "Something went wrong." } };
  }
};

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(deleteReview(reviewId));
      return data;
    } else {
      const errorData = await response.json();
      return { error: errorData };
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error: { server: "Something went wrong." } };
  }
};

export const thunkAddReview = ({ movieId, reviewText, rating }) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/${movieId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_text: reviewText, rating }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addReview(data));
      return data;
    } else {
      const errorData = await response.json();
      return { error: errorData };
    }
  } catch (error) {
    console.error("Error adding review:", error);
    return { error: { server: "Something went wrong." } };
  }
};

const initialState = { reviews: [], userReviews: [] };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.payload };
    case SET_USER_REVIEWS:
      return { ...state, userReviews: action.payload };
    case DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.payload),
      };
    case ADD_REVIEW:
      return { ...state, reviews: [action.payload, ...state.reviews] };  
    default:
      return state;
  }
};

export default reviewsReducer;
