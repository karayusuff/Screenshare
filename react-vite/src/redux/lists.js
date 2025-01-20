const SET_RECENT_LISTS = "lists/SET_RECENT_LISTS";
const SET_USER_LISTS = "lists/SET_USER_LISTS";

const setRecentLists = (lists) => ({
  type: SET_RECENT_LISTS,
  payload: lists
});

const setUserLists = (lists) => ({
  type: SET_USER_LISTS,
  payload: lists
});

export const thunkGetRecentLists = () => async (dispatch) => {
  try {
    const response = await fetch("/api/lists/recent");
    if (response.ok) {
      const data = await response.json();
      dispatch(setRecentLists(data.Lists));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching recent lists:", error);
  }
};

export const thunkGetUserLists = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}/lists`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setUserLists(data.Lists));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching user lists:", error);
  }
};

const initialState = { recentLists: [], userLists: [] };

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RECENT_LISTS:
      return { ...state, recentLists: action.payload };
    case SET_USER_LISTS:
      return { ...state, userLists: action.payload };
    default:
      return state;
  }
};

export default listsReducer;
