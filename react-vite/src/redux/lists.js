const SET_RECENT_LISTS = "lists/SET_RECENT_LISTS";
const SET_USER_LISTS = "lists/SET_USER_LISTS";
const SET_LIST_DETAILS = "lists/SET_LIST_DETAILS";
const CREATE_LIST = "lists/CREATE_LIST";

const setRecentLists = (lists) => ({
  type: SET_RECENT_LISTS,
  payload: lists
});

const setUserLists = (lists) => ({
  type: SET_USER_LISTS,
  payload: lists
});

const setListDetails = (list) => ({
  type: SET_LIST_DETAILS,
  payload: list
});

const createList = (list) => ({
  type: CREATE_LIST,
  payload: list
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

export const thunkGetListDetails = (listId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/lists/${listId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setListDetails(data));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching list details:", error);
  }
};

export const thunkCreateList = (listData) => async (dispatch) => {
  try {
    const response = await fetch("/api/session/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(createList(data));
    } else {
      const errorData = await response.json();
      console.error(errorData.error)
    }
  } catch (error) {
    return { errors: "An unexpected error occurred." };
  }
};

const initialState = { recentLists: [], userLists: [], listDetails: null, lists: [] };

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RECENT_LISTS:
      return { ...state, recentLists: action.payload };
    case SET_USER_LISTS:
      return { ...state, userLists: action.payload };
    case SET_LIST_DETAILS:
      return { ...state, listDetails: action.payload };
    case CREATE_LIST:
      return { ...state, lists: [action.payload, ...state.lists] };
    default:
      return state;
  }
};

export default listsReducer;
