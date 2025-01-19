const SET_MOVIE_OF_THE_DAY = "movies/SET_MOVIE_OF_THE_DAY";
const SET_MOVIE = "movies/SET_MOVIE";
const CLEAR_MOVIE = "movies/CLEAR_MOVIE"
const SET_MOVIES = "movies/SET_MOVIES";

const setMovieOfTheDay = (movie) => ({
  type: SET_MOVIE_OF_THE_DAY,
  payload: movie
});

const setMovie = (movie) => ({
  type: SET_MOVIE,
  payload: movie
});

export const clearMovie = () => ({
  type: CLEAR_MOVIE
});

const setMovies = (movies) => ({
  type: SET_MOVIES,
  payload: movies
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

export const thunkGetMovieById = (movieId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/${movieId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setMovie(data));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
  }
};

export const thunkGetMovies = (page = 1, limit = 8) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies?page=${page}&limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setMovies(data.Movies));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

const initialState = { movieOfTheDay: null, movie: null, movies: [] };

const moviesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVIE_OF_THE_DAY:
      return { ...state, movieOfTheDay: action.payload };
    case SET_MOVIE:
      return { ...state, movie: action.payload };
    case CLEAR_MOVIE:
      return { ...state, movie: null };
    case SET_MOVIES:
      return { ...state, movies: action.payload };
    default:
      return state;
  }
}

export default moviesReducer;