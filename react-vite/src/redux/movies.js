const SET_MOVIE_OF_THE_DAY = "movies/SET_MOVIE_OF_THE_DAY";
const SET_MOVIE = "movies/SET_MOVIE";
const CLEAR_MOVIE = "movies/CLEAR_MOVIE";
const SET_MOVIES = "movies/SET_MOVIES";
const ADD_MOVIE = "movies/ADD_MOVIE";
const UPDATE_MOVIE = "movies/UPDATE_MOVIE";
const DELETE_MOVIE = "movies/DELETE_MOVIE";

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

const addMovie = (movie) => ({
  type: ADD_MOVIE,
  payload: movie
});

const updateMovie = (movie) => ({
  type: UPDATE_MOVIE,
  payload: movie
});

const deleteMovie = (movieId) => ({
  type: DELETE_MOVIE,
  payload: movieId
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

export const thunkCreateMovie = (formData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/`, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addMovie(data));
      return data;
    } else {
      const errorData = await response.json();
      return { error: errorData };
    }
  } catch (error) {
    console.error("Error creating movie:", error);
    return { error: { server: "Something went wrong." }};
  }
};

export const thunkUpdateMovie = (movieId, formData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/${movieId}`, {
      method: "PUT",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(updateMovie(data));
      return data;
    } else {
      const errorData = await response.json();
      return { error: errorData };
      // return { error: errorData.errors || "An unexpected error occurred." };
    }
  } catch (error) {
    console.error("Error updating movie:", error);
    return { error: { server: "Something went wrong." }};
  }
};

export const thunkDeleteMovie = (movieId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/movies/${movieId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteMovie(movieId));
    } else {
      const errorData = await response.json();
      return { error: errorData.error };
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    return { error: "Something went wrong." };
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
    case ADD_MOVIE:
      return { ...state, movies: [...state.movies, action.payload] };
    case UPDATE_MOVIE:
      return {
        ...state,
        movies: state.movies.map((movie) =>
          movie.id === action.payload.id ? action.payload : movie
        ),
      };
    case DELETE_MOVIE:
      return {
        ...state,
        movies: state.movies.filter((movie) => movie.id !== action.payload),
      };
    default:
      return state;
  }
};

export default moviesReducer;