import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { thunkSearchMovies } from "../../redux/movies";
import ProfileButton from "./ProfileButton";
import CreateListButton from "../CreateListModal/CreateListButton";
import AddMovieButton from "../AdminAddMovieModal/AddMovieButton";
import logo from "../../../../images/screenshare-logo-transparent.png";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);
  const searchResults = useSelector((state) => state.movies.searchResults);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef();
  const itemRefs = useRef([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim() !== "") {
      dispatch(thunkSearchMovies(value));
    }
  };

  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => {
        const newIndex = prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0;
        itemRefs.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : - 1;
        itemRefs.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return newIndex;
      });
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      navigate(`/movies/${searchResults[selectedIndex].id}`);
      setQuery("");
    }
  };

  const handleResultClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    setQuery("");
  };

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
        <div className="search-container" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search movies..."
            className="nav-search-bar"
            value={query}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
          />
          {showDropdown && query && searchResults.length > 0 && (
            <ul className="search-results-dropdown">
              {searchResults.map((movie, index) => (
                <li
                  key={movie.id}
                  className={`search-result-item ${
                    index === selectedIndex ? "selected" : ""
                  }`}
                  onClick={() => handleResultClick(movie.id)}
                  ref={(el) => (itemRefs.current[index] = el)}
                >
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="search-result-poster"
                  />
                  <span>{movie.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="nav-button" onClick={() => navigate("/users")}>
          Users
        </button>
        <button className="nav-button" onClick={() => navigate("/movies")}>
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
