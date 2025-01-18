const SET_TOP_USERS = "users/SET_TOP_USERS";
const SET_TOP_SCORERS = "users/SET_TOP_SCORERS";

const setTopUsers = (users) => ({
  type: SET_TOP_USERS,
  payload: users
});

const setTopScorers = (users) => ({
  type: SET_TOP_SCORERS,
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

const initialState = { topUsers: [], topScorers: [] };

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOP_USERS:
      return { ...state, topUsers: action.payload };
    case SET_TOP_SCORERS:
      return { ...state, topScorers: action.payload };  
    default:
      return state;
  }
};

export default usersReducer;
