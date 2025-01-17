import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import logo from "../../../../images/screenshare-logo-transparent.png"
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <NavLink to="/">
          <img src={logo} alt="Screenshare Logo" title="Lights, Camera, Socialize!" className="nav-logo" />
        </NavLink>
      </div>

      <div className="nav-center">
        <input
          type="text"
          placeholder="Search..."
          className="nav-search-bar"
        />
      </div>

      <div className="nav-right">
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
