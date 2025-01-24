import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { thunkSearchMovies } from "../../redux/movies";
import { thunkSearchUsers } from "../../redux/users";
import ProfileButton from "./ProfileButton";
import CreateListButton from "../CreateListModal/CreateListButton";
import AddMovieButton from "../AdminAddMovieModal/AddMovieButton";
import logo from "../../../../images/screenshare-logo-transparent.png";
import { FaChevronDown } from "react-icons/fa";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);
  const movieSearchResults = useSelector((state) => state.movies.searchResults);
  const userSearchResults = useSelector((state) => state.users.searchResults);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef();
  const itemRefs = useRef([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchType, setSearchType] = useState("movies");
  const [showSearchTypeMenu, setShowSearchTypeMenu] = useState(false);

  const handleInputFocus = () => {
    setShowDropdown(true);
    setShowSearchTypeMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setShowSearchTypeMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSearchTypeMenu = (e) => {
    if (showDropdown) {
      setShowDropdown(false);
      setShowSearchTypeMenu(true);
    } else {
      setShowSearchTypeMenu(prev => !prev);
    }
    e.stopPropagation();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowSearchTypeMenu(false);

    if (value.trim() !== "") {
      if (searchType === "movies") {
        dispatch(thunkSearchMovies(value));
      } else if (searchType === "users") {
        dispatch(thunkSearchUsers(value));
      }
    }
  };

  const handleKeyDown = (e) => {
    const searchResults = searchType === "movies" ? movieSearchResults : userSearchResults;

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
      const selectedResult = searchResults[selectedIndex];
      if (searchType === "movies") {
        navigate(`/movies/${selectedResult.id}`);
      } else if (searchType === "users") {
        navigate(`/users/${selectedResult.username}`);
      }
      setQuery("");
    }
  };

  const handleResultClick = (result) => {
    if (searchType === "movies") {
      navigate(`/movies/${result.id}`);
    } else if (searchType === "users") {
      navigate(`/users/${result.username}`);
    }
    setQuery("");
  };

  const handleSearchTypeSelect = (type) => {
    setSearchType(type);
    setShowSearchTypeMenu(false);
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
          <div className="search-type-dropdown">
            <div 
              className="search-type-select"
              onClick={toggleSearchTypeMenu}
            >
              {searchType === "movies" ? "Movies" : "Users"}
              <FaChevronDown className="dropdown-arrow" />
            </div>
            {showSearchTypeMenu && (
              <ul className="search-type-menu">
                <li 
                  onClick={() => handleSearchTypeSelect("movies")} 
                  className={searchType === "movies" ? "selected" : ""}
                >
                  Movies
                </li>
                <li 
                  onClick={() => handleSearchTypeSelect("users")} 
                  className={searchType === "users" ? "selected" : ""}
                >
                  Users
                </li>
              </ul>
            )}
          </div>
          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            className="nav-search-bar"
            value={query}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
          />
          {showDropdown && query && (
            <ul className="search-results-dropdown">
              {(searchType === "movies" ? movieSearchResults : userSearchResults).map(
                (result, index) => (
                  <li
                    key={result.id || result.username}
                    className={`search-result-item ${
                      index === selectedIndex ? "selected" : ""
                    }`}
                    onClick={() => handleResultClick(result)}
                    ref={(el) => (itemRefs.current[index] = el)}
                  >
                    {searchType === "movies" ? (
                      <>
                        <img
                          src={result.poster_url}
                          alt={result.title}
                          className="search-result-movie-poster"
                        />
                        <span>{result.title}</span>
                      </>
                    ) : (
                      <>
                        <img
                          src={result.profile_pic_url || "https://screenshare-app-images.s3.eu-north-1.amazonaws.com/no+pp+image.png"}
                          alt={result.username}
                          className="search-result-user-pic"
                        />
                        <span>{result.username}</span>
                      </>
                    )}
                  </li>
                )
              )}
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