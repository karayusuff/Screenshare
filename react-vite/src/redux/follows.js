const SET_FOLLOWERS_COUNT = "follows/SET_FOLLOWERS_COUNT";

const setFollowersCount = (followersCount) => ({
  type: SET_FOLLOWERS_COUNT,
  payload: followersCount
});

export const thunkGetFollowersCount = (topUsers) => async (dispatch) => {
  const counts = {};
  try {
    for (const user of topUsers) {
      const response = await fetch(`/api/users/${user.id}/followers-count`);
      if (response.ok) {
        const data = await response.json();
        counts[user.id] = data.followers_count;
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    }
    dispatch(setFollowersCount(counts));
  } catch (error) {
    console.error("Error fetching followers count:", error);
  }
};

const initialState = { followersCount: {} };

const followsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FOLLOWERS_COUNT:
      return { ...state, followersCount: action.payload };
    default:
      return state;
  }
};

export default followsReducer;