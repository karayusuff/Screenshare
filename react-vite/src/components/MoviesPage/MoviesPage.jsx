import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetMovies, thunkSearchMovies } from "../../redux/movies";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./MoviesPage.css";

const MoviesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.movies.movies);
  const searchResults = useSelector((state) => state.movies.searchResults);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      dispatch(thunkGetMovies(currentPage));
    }
  }, [dispatch, currentPage, isSearching]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
      dispatch(thunkSearchMovies(value));
    }
  };

  const handleResultClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    setQuery("");
    setIsSearching(false);
  };

  const handleNextPage = () => {
    setSearchParams({ page: currentPage + 1 });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setSearchParams({ page: currentPage - 1 });
  };

  const displayMovies = isSearching ? searchResults : movies;

  return (
    <div className="movies-page">
      <h1>All Movies</h1>
      <input
        type="text"
        placeholder="Search movies..."
        className="movies-search-bar"
        value={query}
        onChange={handleSearchChange}
      />
      <div className="movies-list">
        {displayMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleResultClick(movie.id)}
          >
            <img
              src={movie.poster_url}
              title={movie.title}
              alt={movie.title}
              className="movie-poster-movies"
            />
            <h3 className="movies-h3">{movie.title}</h3>
          </div>
        ))}
      </div>
      {!isSearching && (
        <div className="page-controls">
          <button
            className="page-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-text">Page {currentPage}</span>
          <button
            className="page-button"
            onClick={handleNextPage}
            disabled={movies.length < 8}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;