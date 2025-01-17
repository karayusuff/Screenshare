from app.models import db, Movie, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_movies():
    seed_data = [
        Movie(
            title="Inception",
            poster_url="https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
            description="A thief who steals corporate secrets through the use of dream-sharing technology.",
            release_date=date(2010, 7, 16),
            genres="Sci-Fi, Thriller",
            director="Christopher Nolan",
            stars="Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
            writer="Christopher Nolan",
            producer="Emma Thomas",
            platforms={"HBO": "Unavailable", "Netflix": "2025-12-31", "Amazon Prime": "2025-11-30", "Disney+": "2025-10-15", "Apple TV": "Unavailable"}
        ),
        Movie(
            title="Interstellar",
            poster_url="https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description="A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            release_date=date(2014, 11, 7),
            genres="Sci-Fi, Adventure",
            director="Christopher Nolan",
            stars="Matthew McConaughey, Anne Hathaway, Jessica Chastain",
            writer="Jonathan Nolan, Christopher Nolan",
            producer="Emma Thomas",
            platforms={"HBO": "2025-12-01", "Netflix": "2026-01-15", "Amazon Prime": "2025-09-30", "Disney+": "Unavailable", "Apple TV": "2025-08-20"}
        ),
        Movie(
            title="The Dark Knight",
            poster_url="https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg",
            description="When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
            release_date=date(2008, 7, 18),
            genres="Action, Crime, Drama",
            director="Christopher Nolan",
            stars="Christian Bale, Heath Ledger, Aaron Eckhart",
            writer="Jonathan Nolan, Christopher Nolan",
            producer="Emma Thomas",
            platforms={"HBO": "2025-11-15", "Netflix": "2025-12-31", "Amazon Prime": "Unavailable", "Disney+": "2025-12-01", "Apple TV": "Unavailable"}
        ),
        Movie(
            title="Pulp Fiction",
            poster_url="https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description="The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            release_date=date(1994, 10, 14),
            genres="Crime, Drama",
            director="Quentin Tarantino",
            stars="John Travolta, Uma Thurman, Samuel L. Jackson",
            writer="Quentin Tarantino, Roger Avary",
            producer="Lawrence Bender",
            platforms={"HBO": "2025-10-15", "Netflix": "2025-11-30", "Amazon Prime": "Unavailable", "Disney+": "Unavailable", "Apple TV": "2025-09-25"}
        ),
        Movie(
            title="The Godfather",
            poster_url="https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description="The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            release_date=date(1972, 3, 24),
            genres="Crime, Drama",
            director="Francis Ford Coppola",
            stars="Marlon Brando, Al Pacino, James Caan",
            writer="Mario Puzo, Francis Ford Coppola",
            producer="Albert S. Ruddy",
            platforms={"HBO": "2025-11-01", "Netflix": "Unavailable", "Amazon Prime": "2025-12-15", "Disney+": "Unavailable", "Apple TV": "2025-08-30"}
        ),
        Movie(
            title="The Shawshank Redemption",
            poster_url="https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg",
            description="Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            release_date=date(1994, 9, 23),
            genres="Drama",
            director="Frank Darabont",
            stars="Tim Robbins, Morgan Freeman, Bob Gunton",
            writer="Stephen King, Frank Darabont",
            producer="Niki Marvin",
            platforms={"HBO": "Unavailable", "Netflix": "2026-01-01", "Amazon Prime": "2025-10-20", "Disney+": "2025-11-25", "Apple TV": "2025-12-10"}
        ),
        Movie(
            title="Fight Club",
            poster_url="https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            description="An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
            release_date=date(1999, 10, 15),
            genres="Drama",
            director="David Fincher",
            stars="Brad Pitt, Edward Norton, Meat Loaf",
            writer="Chuck Palahniuk, Jim Uhls",
            producer="Art Linson",
            platforms={"HBO": "2025-11-15", "Netflix": "2025-12-31", "Amazon Prime": "Unavailable", "Disney+": "2025-10-10", "Apple TV": "Unavailable"}
        ),
        Movie(
            title="Forrest Gump",
            poster_url="https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_.jpg",
            description="The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other history unfold through the perspective of an Alabama man with an IQ of 75.",
            release_date=date(1994, 7, 6),
            genres="Drama, Romance",
            director="Robert Zemeckis",
            stars="Tom Hanks, Robin Wright, Gary Sinise",
            writer="Winston Groom, Eric Roth",
            producer="Wendy Finerman",
            platforms={"HBO": "Unavailable", "Netflix": "2025-12-15", "Amazon Prime": "2025-11-20", "Disney+": "2025-08-15", "Apple TV": "Unavailable"}
        ),
        Movie(
            title="The Matrix",
            poster_url="https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_.jpg",
            description="A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
            release_date=date(1999, 3, 31),
            genres="Action, Sci-Fi",
            director="The Wachowskis",
            stars="Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
            writer="The Wachowskis",
            producer="Joel Silver",
            platforms={"HBO": "2025-12-20", "Netflix": "Unavailable", "Amazon Prime": "2025-11-10", "Disney+": "Unavailable", "Apple TV": "2025-09-15"}
        ),
        Movie(
            title="Parasite",
            poster_url="https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg",
            description="Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
            release_date=date(2019, 5, 30),
            genres="Drama, Thriller",
            director="Bong Joon Ho",
            stars="Kang-ho Song, Sun-kyun Lee, Yeo-jeong Cho",
            writer="Bong Joon Ho, Jin Won Han",
            producer="Kwak Sin-ae",
            platforms={"HBO": "2025-11-30", "Netflix": "2025-10-05", "Amazon Prime": "Unavailable", "Disney+": "2025-09-01", "Apple TV": "2025-08-20"}
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_movies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.movies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM movies"))
        
    db.session.commit()