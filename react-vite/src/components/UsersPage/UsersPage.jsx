import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers, thunkGetTopUsers, thunkGetTopScorers } from "../../redux/users";
import { useNavigateTo } from "../../utils/navigation";
import "./UsersPage.css";

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigateTo("users");
  const [activeTab, setActiveTab] = useState("all");

  const allUsers = useSelector((state) => state.users.users);
  const topUsers = useSelector((state) => state.users.topUsers);
  const topScorers = useSelector((state) => state.users.topScorers);

  useEffect(() => {
    if (activeTab === "all") {
      dispatch(thunkGetAllUsers());
    } else if (activeTab === "top") {
      dispatch(thunkGetTopUsers());
    } else if (activeTab === "scorers") {
      dispatch(thunkGetTopScorers());
    }
  }, [dispatch, activeTab]);

  const renderUsers = (users) => {
    return (
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-card" onClick={() => navigateTo(user.username)}>
            <img src={user.profile_pic_url || "https://screenshare-app-images.s3.eu-north-1.amazonaws.com/no+pp+image.png"} alt={user.username} className="user-avatar" />
            <h3 className="user-name">{user.username}</h3>
            <h4 className="user-badge">{user.badge}</h4>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="users-page">
      <h1>Users</h1>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Users
        </button>
        <button
          className={`tab-button ${activeTab === "top" ? "active" : ""}`}
          onClick={() => setActiveTab("top")}
        >
          Top Users
        </button>
        <button
          className={`tab-button ${activeTab === "scorers" ? "active" : ""}`}
          onClick={() => setActiveTab("scorers")}
        >
          Top Scorers
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "all" && renderUsers(allUsers)}
        {activeTab === "top" && renderUsers(topUsers)}
        {activeTab === "scorers" && renderUsers(topScorers)}
      </div>
    </div>
  );
};

export default UsersPage;
