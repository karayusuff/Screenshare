const SET_REVIEWS = "reviews/SET_REVIEWS";
const SET_USER_REVIEWS = "reviews/SET_USER_REVIEWS";

const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews
});

const setUserReviews = (reviews) => ({
  type: SET_USER_REVIEWS,
  payload: reviews
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

const initialState = { reviews: [], userReviews: [] };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.payload };
    case SET_USER_REVIEWS:
      return { ...state, userReviews: action.payload };  
    default:
      return state;
  }
};

export default reviewsReducer;
