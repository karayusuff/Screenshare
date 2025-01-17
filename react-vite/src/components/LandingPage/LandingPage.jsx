import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetMovieOfTheDay } from "../../redux/movies";
import './LandingPage.css'

export default function LandingPage() {
  const dispatch = useDispatch();
  const movieOfTheDay = useSelector((state) => state.movies.movieOfTheDay);

  useEffect(() => {
    dispatch(thunkGetMovieOfTheDay());
  }, [dispatch]);

  if (!movieOfTheDay) return <h2>Loading...</h2>;

  return (
    <div className="landing-page">
      <h1>Movie of the Day</h1>
      <div className="movie-details">
        <img src={movieOfTheDay.poster_url} title={movieOfTheDay.title} alt={movieOfTheDay.title} />
        <h2>{movieOfTheDay.title}</h2>
        <p>{movieOfTheDay.description}</p>
      </div>
    </div>
  );
}
