from db import db

class User(db.Model):
    __tablename__ = "users"  # Table name in the database

    # Columns (fields in the users table)
    id = db.Column(db.String(36), primary_key=True)  # UUID as primary key
    name = db.Column(db.String(100), nullable=False)  # Character name (required)
    email = db.Column(db.String(100), unique=True, nullable=False)  # Unique email
    password = db.Column(db.String(100), nullable=False)  # Hashed password
    highscore = db.Column(db.Integer, default=0)  # Default score is 0

    # Convert a user object to dictionary (used when returning JSON)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "highscore": self.highscore
        }
