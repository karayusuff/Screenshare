const SET_FOLLOWERS_COUNT = "follows/SET_FOLLOWERS_COUNT";
const SET_FOLLOWING = "follows/SET_FOLLOWING";
const SET_FOLLOWERS = "follows/SET_FOLLOWERS";

const setFollowersCount = (followersCount) => ({
  type: SET_FOLLOWERS_COUNT,
  payload: followersCount
});

const setFollowing = (following) => ({
  type: SET_FOLLOWING,
  payload: following,
});

const setFollowers = (followers) => ({
  type: SET_FOLLOWERS,
  payload: followers,
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

export const thunkGetFollowing = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}/following`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setFollowing(data.Following));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching following:", error);
  }
};

export const thunkGetFollowers = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}/followers`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setFollowers(data.Followers));
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
};

const initialState = { followersCount: {}, followers: [], following: [] };

const followsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FOLLOWERS_COUNT:
      return { ...state, followersCount: action.payload };
    case SET_FOLLOWERS:
      return { ...state, followers: action.payload };
    case SET_FOLLOWING:
      return { ...state, following: action.payload };  
    default:
      return state;
  }
};

export default followsReducer;