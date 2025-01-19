import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetMovies } from "../../redux/movies";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./MoviesPage.css";

const MoviesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.movies.movies);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    dispatch(thunkGetMovies(currentPage));
  }, [dispatch, currentPage]);

  const handleNextPage = () => {
    setSearchParams({ page: currentPage + 1 });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setSearchParams({ page: currentPage - 1 });
  };

  return (
    <div className="movies-page">
      <h1>All Movies</h1>
      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => navigate(`/movies/${movie.id}`)}>
            <img src={movie.poster_url} title={movie.title} alt={movie.title} className="movie-poster-movies" />
            <h3 className="movies-h3">{movie.title}</h3>
          </div>
        ))}
      </div>
      <div className="page-controls">
        <button className="page-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-text">Page {currentPage}</span>
        <button className="page-button" onClick={handleNextPage} disabled={movies.length < 8}>Next</button>
      </div>
    </div>
  );
};

export default MoviesPage;