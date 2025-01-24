import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import CreateListButton from "../CreateListModal/CreateListButton";
import AddMovieButton from "../AdminAddMovieModal/AddMovieButton";
import logo from "../../../../images/screenshare-logo-transparent.png";
import "./Navigation.css";

function Navigation() {
  const currentUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <NavLink to="/">
          <img
            src={logo}
            alt="Screenshare Logo"
            title="Lights, Camera, Socialize!"
            className="nav-logo"
          />
        </NavLink>
      </div>

      <div className="nav-center">
        <input
          type="text"
          placeholder="Search..."
          className="nav-search-bar"
        />
        <button className="nav-button" onClick={() => navigate('/users')}>
          Users
        </button>
        <button className="nav-button" onClick={() => navigate('/movies')}>
          Movies
        </button>
      </div>

      <div className="nav-right">
        {!currentUser?.is_admin && <CreateListButton />}
        {currentUser?.is_admin && <AddMovieButton />}
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
