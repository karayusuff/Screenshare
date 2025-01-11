from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    admin = User(
        first_name='Admin',
        last_name='User',
        username='admin',
        email='admin@site.com',
        password='adminpassword',
        is_admin=True,
        total_points=0,
        status='active',
        badge='Admin',
        welcome_movie_id=None,
        welcome_movie_note=None
    )
    demo = User(
        first_name='Demo',
        last_name='User',
        username='Demo',
        email='demo@aa.io',
        password='password',
        is_admin=False,
        total_points=10,
        status='active',
        badge='Newbie',
        welcome_movie_id=1,
        welcome_movie_note='This is one of my favorite movies!'
    )
    marnie = User(
        first_name='Marnie',
        last_name='Smith',
        username='marnie',
        email='marnie@aa.io',
        password='password',
        is_admin=False,
        total_points=25,
        status='active',
        badge='Movie Enthusiast',
        welcome_movie_id=None,
        welcome_movie_note=None
    )
    bobbie = User(
        first_name='Bobbie',
        last_name='Brown',
        username='bobbie',
        email='bobbie@aa.io',
        password='password',
        is_admin=False,
        total_points=55,
        status='active',
        badge='Movie Monster',
        welcome_movie_id=2,
        welcome_movie_note='A must-watch for everyone!'
    )
    alex = User(
        first_name='Alex',
        last_name='Johnson',
        username='alex',
        email='alex@aa.io',
        password='password',
        is_admin=False,
        total_points=0,
        status='active',
        badge='Newbie',
        welcome_movie_id=None,
        welcome_movie_note=None
    )
    chris = User(
        first_name='Chris',
        last_name='Evans',
        username='chris',
        email='chris@aa.io',
        password='password',
        is_admin=False,
        total_points=15,
        status='active',
        badge='Newbie',
        welcome_movie_id=None,
        welcome_movie_note='Cinema is my life!'
    )

    db.session.add(admin)
    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(alex)
    db.session.add(chris)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
