import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import MoviePage from '../components/MoviePage/MoviePage';
import MoviesPage from '../components/MoviesPage/MoviesPage';
import ProfilePage from '../components/ProfilePage/ProfilePage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/movies/:movieId",
        element: <MoviePage />,
      },
      {
        path: "/movies",
        element: <MoviesPage />,
      },
      {
        path: "/users/:username",
        element: <ProfilePage />,
      },
    ],
  },
]);