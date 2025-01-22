const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const UPDATE_USER = 'session/updateUser';
const DELETE_USER = "users/DELETE_USER";

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user
});

const deleteUser = () => ({
  type: DELETE_USER
})

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (formData) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: formData
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const thunkUpdateProfile = (updatedProfile) => async (dispatch) => {
  try {
    const response = await fetch("/api/session/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(updateUser(data));
      return data;
    } else {
      const errorData = await response.json();
      return { error: errorData };
    }
  } catch (error) {
    return { error: "Something went wrong. Please try again later." };
  }
};

export const thunkDeleteAccount = () => async (dispatch) => {
  try {
    const response = await fetch("/api/session/delete-account", {
      method: "DELETE"
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(null));
      return data;
    } else {
      const errorData = await response.json();
      return { error: errorData.error };
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case UPDATE_USER:
      return { ...state, user: action.payload };
    case DELETE_USER:
      return { ...state, user: null }
    default:
      return state;
  }
}

export default sessionReducer;
