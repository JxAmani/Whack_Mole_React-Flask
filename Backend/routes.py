from flask import Blueprint, request, jsonify
from models import User
from db import db
import uuid

bp = Blueprint("api", __name__)

# Register
@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user = User(
        id=str(uuid.uuid4()),
        name=data["name"],
        email=data["email"],
        password=data["password"]  
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# Login
@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(name=data["name"], password=data["password"]).first()
    if user:
        return jsonify(user.to_dict())
    return jsonify({"error": "Invalid credentials"}), 401

# Update highscore
@bp.route("/update-score/<user_id>", methods=["PUT"])
def update_score(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if user:
        user.highscore = data["highscore"]
        db.session.commit()
        return jsonify(user.to_dict())
    return jsonify({"error": "User not found"}), 404

# Delete user
@bp.route("/delete-user/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404
