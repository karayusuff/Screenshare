import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import * as moviesActions from "./redux/movies";
import * as reviewsActions from "./redux/reviews";
import * as listsActions from "./redux/lists";
import * as usersActions from "./redux/users";
import * as followsActions from "./redux/follows";
import "./index.css";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
  window.moviesActions = moviesActions;
  window.reviewsActions = reviewsActions;
  window.listsActions = listsActions;
  window.usersActions = usersActions;
  window.followsActions = followsActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);
