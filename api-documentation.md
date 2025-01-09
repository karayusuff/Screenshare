# `Screenshare`

## Database Schema Design

![db-schema]

[db-schema]: ./images/db-diagram.png

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/session
  - Body: none

- Successful Response when there is a logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
        "is_admin": false,
        "total_points": 50,
        "badge": "Reviewer",
        "welcome_movie_id": 10,
        "welcome_movie_note": "A must-watch classic!"
      }
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/session
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/users
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error response: User already exists with the specified email or username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "first_name": "First Name is required",
        "last_name": "Last Name is required"
      }
    }
    ```











## MOVIES

### Get all Movies

Returns all the movies.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/movies
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Movies": [
        {
          "id": 1,
          "title": "Inception",
          "genres": "Sci-Fi, Thriller",
          "description": "A thief who enters dreams to steal secrets.",
          "director": "Christopher Nolan",
          "stars": "Leonardo DiCaprio, Joseph Gordon-Levitt",
          "writer": "Christopher Nolan",
          "producer": "Emma Thomas",
          "release_date": "2010-07-16",
          "platforms": ["Netflix", "HBO Max"],
          "created_at": "2024-01-01",
          "updated_at": "2024-01-02"
        }
      ]
    }
    ```

### Get Movie Details

Returns the details of a movie.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/movies/:movieId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "title": "Inception",
      "genres": "Sci-Fi, Thriller",
      "description": "A thief who enters dreams to steal secrets.",
      "director": "Christopher Nolan",
      "stars": "Leonardo DiCaprio, Joseph Gordon-Levitt",
      "writer": "Christopher Nolan",
      "producer": "Emma Thomas",
      "release_date": "2010-07-16",
      "platforms": ["Netflix", "HBO Max"],
      "created_at": "2024-01-01",
      "updated_at": "2024-01-02"
    }
    ```

- Error response: Couldn't find a Movie with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Movie couldn't be found"
    }
    ```

### Add a Movie

Adds and returns a new movie.

- Require Authentication: true
- Require proper authorization: User must be admin.
- Request

  - Method: POST
  - Route path: /api/movies
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "title": "Interstellar",
      "genres": "Sci-Fi, Adventure",
      "description": "Explorers travel through a wormhole.",
      "director": "Christopher Nolan",
      "stars": "Matthew McConaughey, Anne Hathaway",
      "writer": "Jonathan Nolan",
      "producer": "Emma Thomas",
      "release_date": "2014-11-07",
      "platforms": ["Netflix"]
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 2,
      "title": "Interstellar",
      "created_at": "2024-01-01",
      "updated_at": "2024-01-02" 
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "genres": "Genre is required",
        "description": "Description is required",
        "director": "Director is required",
        "stars": "Stars are required",
        "writer": "Writer is required",
        "producer": "Producer is required",
        "release_date": "Release date is required"
      }
    }
    ```

### Edit a Movie

Updates and returns an existing movie.

- Require Authentication: true
- Require proper authorization: User must be admin.
- Request

  - Method: PUT
  - Route path: /api/movies/:movieId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "title": "Interstellar",
      "genres": "Sci-Fi, Adventure",
      "description": "Updated description",
      "director": "Christopher Nolan",
      "stars": "Matthew McConaughey, Anne Hathaway",
      "writer": "Jonathan Nolan",
      "producer": "Emma Thomas",
      "release_date": "2014-11-07",
      "platforms": ["Netflix"]
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "title": "Interstellar",
      "genres": "Sci-Fi, Adventure",
      "description": "Updated description",
      "director": "Christopher Nolan",
      "stars": "Matthew McConaughey, Anne Hathaway",
      "writer": "Jonathan Nolan",
      "producer": "Emma Thomas",
      "release_date": "2014-11-07",
      "platforms": ["Netflix"],
      "created_at": "2021-11-19 20:39:36",
      "updated_at": "2021-11-20 10:06:40"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "genres": "Genre is required",
        "description": "Description is required",
        "director": "Director is required",
        "stars": "Stars are required",
        "writer": "Writer is required",
        "producer": "Producer is required",
        "release_date": "Release date is required"
      }
    }
    ```

- Error response: Couldn't find a Movie with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Movie couldn't be found"
    }
    ```

### Delete a Movie

Deletes an existing movie.

- Require Authentication: true
- Require proper authorization: User must be admin.
- Request

  - Method: DELETE
  - Route path: /api/movies/:movieId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted the movie"
    }
    ```

- Error response: Couldn't find a Movie with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Movie couldn't be found"
    }
    ```

## REVIEWS

### Get all Reviews of the Current User

Returns all the reviews written by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/session/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "user_id": 1,
          "movie_id": 1,
          "review_text": "This was an awesome movie!",
          "rating": 8,
          "created_at": "2021-11-19 20:39:36",
          "updated_at": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "first_name": "John",
            "last_name": "Smith"
          },
          "Movie": {
            "id": 1,
            "title": "Insception"
          }
        }
      ]
    }
    ```

### Get all Reviews by Movie's id

Returns all the reviews that belong to a movie specified by id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/movies/:movieId/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "user_id": 1,
          "movie_id": 1,
          "review_text": "This was an awesome movie!",
          "rating": 8,
          "created_at": "2021-11-19 20:39:36",
          "updated_at": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "first_name": "John",
            "last_name": "Smith"
          },
          "Movie": {
            "id": 1,
            "title": "Insception"
          }
        }
      ]
    }
    ```

- Error response: Couldn't find a Movie with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Movie couldn't be found"
    }
    ```

### Add a Review for a Movie

Add and return a new review for a Movie specified by id.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/movies/:movieId/reviews
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "review_text": "This was an awesome movie!",
      "rating": 9
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "user_id": 1,
      "movie_id": 1,
      "review_text": "This was an awesome movie!",
      "rating": 5,
      "created_at": "2021-11-19 20:39:36",
      "updated_at": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "review_text": "Review text is required",
        "rating": "Rating must be an integer from 1 to 10"
      }
    }
    ```

- Error response: Couldn't find a Movie with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Movie couldn't be found"
    }
    ```

- Error response: Review from the current user already exists for the Movie

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already has a review for this movie"
    }
    ```

### Edit a Review

Update and return an existing review.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: PUT
  - Route path: /api/reviews/:reviewId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "review_text": "This was an awesome movie!",
      "rating": 10
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "user_id": 1,
      "movie_id": 1,
      "review_text": "This was an awesome movie!",
      "rating": 10,
      "created_at": "2021-11-19 20:39:36",
      "updated_at": "2021-11-20 10:06:40"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "review_text": "Review text is required",
        "rating": "Rating must be an integer from 1 to 10"
      }
    }
    ```

- Error response: Couldn't find a Review with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

### Delete a Review

Delete an existing review.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/reviews/:reviewId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted the review"
    }
    ```

- Error response: Couldn't find a Review with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

## LISTS

### Get all the Lists of the Current User

Return all the lists of the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/session/lists
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Lists": [
        {
          "id": 1,
          "user_id": 2,
          "name": "none",
          "list_type": "Favourites",
          "created_at": "2021-11-19 20:39:36",
          "updated_at": "2021-11-19 20:39:36",
          "Movies": [
            {
              "id": 1,
              "title": "Inception"
            }
          ]
        }
      ]
    }
    ```

### Get all the Lists

Return all the lists.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/lists
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Lists": [
        {
          "id": 1,
          "user_id": 3,
          "name": "Movies of my life",
          "list_type": "Custom",
          "created_at": "2021-11-19 20:39:36",
          "updated_at": "2021-11-19 20:39:36",
          "Movies": [
            {
              "id": 1,
              "title": "Inception"
            }
          ]
        }
      ]
    }
    ```    

### Create a List

Create and return a new list for the current user.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/session/lists
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "name": "Sci-Fi Classics",
      "list_type": "Custom"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 2,
      "name": "Sci-Fi Classics",
      "list_type": "Custom",
      "created_at": "2021-11-19 20:39:36",
      "updated_at": "2021-11-19 20:39:36"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "list_type": "List type is required"
      }
    }
    ```

### Edit a List

Update and return an existing list.

- Require Authentication: true
- Require proper authorization: List must belong to the current user
- Request

  - Method: PUT
  - Route path: /api/session/lists
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "name": "Updated List Name"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "name": "Updated List Name",
      "list_type": "Custom",
      "created_at": "2021-11-19 20:39:36",
      "updated_at": "2021-11-20 10:06:40"
    }
    ```

### Delete a List

Delete an existing List.

- Require Authentication: true
- Require proper authorization: List must belong to the current user
- Request

  - Method: DELETE
  - Route path: /api/lists/:listId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "List successfully deleted"
    }
    ```

- Error response: Couldn't find a List with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "List couldn't be found"
    }
    ```

## Follows

### Get Followers of the Current User

Return a list of followers of the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/session/followers
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Followers": [
        {
          "id": 1,
          "user_id": 1,
          "follower_id": 2,
          "username": "JohnSmith",
          "created_at": "2024-12-17 20:39:36",
          "updated_at": "2024-12-17 20:39:36"
        }
      ]
    }
    ```

### Get Followers of a User

Return a list of users that are following current user.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/followers
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Followers": [
        {
          "id": 1,
          "user_id": 1,
          "follower_id": 2,
          "username": "JohnSmith",
          "created_at": "2024-12-17 20:39:36",
          "updated_at": "2024-12-17 20:39:36"
        }
      ]
    }
    ```    

### Follow a User

Allows the current user to follow another user.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /follows/:userId
  - Body: none

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 5,
      "user_id": 1,
      "following_id": 2,
      "created_at": "2024-12-17 20:39:36",
      "updated_at": "2024-12-17 20:39:36"
    }
    ```

- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

- Error Response: Couldn't find a User with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User not found"
    }
    ``` 

### Unfollow a User

Allows the current user to unfollow another user.

- Require Authentication: true
- Request

  - Method: DELETE
  - Route path: /follows/:userId
  - Headers:
    - Content-Type: application/json
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully unfollowed the user"
    }    





## Query Filters

### Add query filter to get all Lists

Return lists filtered by query parameters.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/lists
  - Query Parameters
    - page: integer, minimum: 1, default: 1
    - size: integer, minimum: 1, maximum: 10, default: 10
    - user_id: integer, optional
    - list_type: Favourites, Watchlist, Watched, Custom, optional
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Lists": [
        {
          "id": 1,
          "name": "Sci-Fi Classics",
          "list_type": "Custom",
          "user_id": 2,
          "created_at": "2021-11-19 20:39:36",
          "updated_at": "2021-11-19 20:39:36",
        }
      ],
      "page": 2,
      "size": 10
    }
    ```

- Error Response: Query parameter validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be between 1 and 10",
        "user_id": "User ID must be an integer",
        "list_type": "List type is invalid"
      }
    }
    ```

### Add query filter to get all Movies

Return movies filtered by query parameters.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/movies
  - Query Parameters
    - page: integer, minimum: 1, default: 1
    - size: integer, minimum: 1, maximum: 10, default: 10
    - title: string, optional
    - genres: string, optional
    - director: string, optional
    - stars: string, optional
    - minRating: decimal, optional, minimum: 1
    - maxRating: decimal, optional, minimum: 1
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Movies": [
        {
          "id": 1,
          "title": "Inception",
          "genres": "Sci-Fi, Thriller",
          "director": "Christopher Nolan",
          "stars": "Leonardo DiCaprio",
          "rating": 8.8
        }
      ],
      "page": 2,
      "size": 10
    }
    ```

- Error Response: Query parameter validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be between 1 and 10",
        "title": "Title must be a string",
        "genres": "Genre must be string",
        "director": "Director must be a string",
        "stars": "Star must be a string",
        "minRating": "Minimum rating must between 1 and 10",
        "maxRating": "Maximum rating must between 1 and 10"
      }
    }
    ```