import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { thunkGetListDetails } from "../../redux/lists";
import "./ListDetailsPage.css";

const ListDetailsPage = () => {
  const { listId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listDetails = useSelector((state) => state.lists.listDetails);

  useEffect(() => {
    if (listId) {
      dispatch(thunkGetListDetails(listId));
    }
  }, [dispatch, listId]);

  const navigateToMovie = (movieId) => {
    navigate(`/movies/${movieId}`)
  }

  if (!listDetails) return <div>Loading...</div>;

  return (
    <div className="list-detail-page">
      <div className="list-header">
        <h1>{listDetails.name}</h1>
        <p>Created by: {listDetails.username}</p>
      </div>
      <div className="list-movies">
        {Object.entries(listDetails.movies).length > 0 ? (
          <ul>
            {listDetails.movies.map((movie) => (
              <li key={movie.id}>
                <p>{movie.title}</p>
                <img 
                src={movie.poster_url} 
                title={movie.title} 
                alt={movie.title}
                onClick={() => navigateToMovie(movie.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies in this list.</p>
        )}
      </div>
    </div>
  );
};

export default ListDetailsPage;
