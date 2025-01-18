const SET_MOVIE_OF_THE_DAY = "movies/SET_MOVIE_OF_THE_DAY";

const setMovieOfTheDay = (movie) => ({
  type: SET_MOVIE_OF_THE_DAY,
  payload: movie
});

export const thunkGetMovieOfTheDay = () => async (dispatch) => {
  try {
    const response = await fetch("/api/movies/random");
    if (response.ok) {
      const data = await response.json();
      dispatch(setMovieOfTheDay(data));
    } else {
      const errorData = await response.json();
      console.error(errorData.error)
    }
  } catch (error) {
    console.error("Error fetching Movie of the Day:", error);
  }
};

const initialState = { movieOfTheDay: null };

const moviesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVIE_OF_THE_DAY:
      return { ...state, movieOfTheDay: action.payload };
    default:
      return state;
  }
}

export default moviesReducer;