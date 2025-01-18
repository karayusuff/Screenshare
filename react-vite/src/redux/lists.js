const SET_RECENT_LISTS = "lists/SET_RECENT_LISTS";

const setRecentLists = (lists) => ({
  type: SET_RECENT_LISTS,
  payload: lists
});

export const thunkGetRecentLists = () => async (dispatch) => {
  try {
    const response = await fetch("/api/lists/recent");
    if (response.ok) {
      const data = await response.json();
      dispatch(setRecentLists(data.Lists));
    } else {
      console.error("Failed to fetch recent lists.");
    }
  } catch (error) {
    console.error("Error fetching recent lists:", error);
  }
};

const initialState = { recentLists: [] };

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RECENT_LISTS:
      return { ...state, recentLists: action.payload };
    default:
      return state;
  }
};

export default listsReducer;
