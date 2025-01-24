const SET_TOP_USERS = "users/SET_TOP_USERS";
const SET_TOP_SCORERS = "users/SET_TOP_SCORERS";
const SET_USER_BY_USERNAME = "users/SET_USER_BY_USERNAME";
const SET_USERS = "users/SET_USERS";
const DELETE_USER = "users/DELETE_USER";
const SET_SEARCH_RESULTS = "users/SET_SEARCH_RESULTS";

const setTopUsers = (users) => ({
  type: SET_TOP_USERS,
  payload: users
});

const setTopScorers = (users) => ({
  type: SET_TOP_SCORERS,
  payload: users
});

const setUserByUsername = (user) => ({
  type: SET_USER_BY_USERNAME,
  payload: user
});

const setUsers = (users) => ({
  type: SET_USERS,
  payload: users
})

const setSearchResults = (users) => ({
  type: SET_SEARCH_RESULTS,
  payload: users
});

export const thunkGetTopUsers = () => async (dispatch) => {
  try {
    const response = await fetch("/api/users/top-users");
    if (response.ok) {
      const data = await response.json();
      dispatch(setTopUsers(data.TopUsers));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }    
  } catch (error) {
    console.error("Error fetching top users:", error);
  }
};

export const thunkGetTopScorers = () => async (dispatch) => {
  try {
    const response = await fetch("/api/users/top-scorers");
    if (response.ok) {
      const data = await response.json();
      dispatch(setTopScorers(data.TopScorers));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching top scorers:", error);
  }
};

export const thunkGetUserByUsername = (username) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${username}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setUserByUsername(data));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching user by username:", error);
  }
};

export const thunkGetAllUsers = () => async (dispatch) => {
  try {
    const response = await fetch("/api/users");
    if (response.ok) {
      const data = await response.json();
      dispatch(setUsers(data.Users));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching all users:", error)
  }
};

export const thunkSearchUsers = (query) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users?q=${query}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setSearchResults(data.Users)); // Arama sonuçlarını sakla
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error searching users:", error);
  }
};

const initialState = { topUsers: [], topScorers: [], userByUsername: null, users: [], searchResults: [] };

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOP_USERS:
      return { ...state, topUsers: action.payload };
    case SET_TOP_SCORERS:
      return { ...state, topScorers: action.payload };
    case SET_USER_BY_USERNAME:
      return { ...state, userByUsername: action.payload };
    case SET_USERS:
      return { ...state, users: action.payload };
    case DELETE_USER:
      return { ...state, user: null };
    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
};

export default usersReducer;
