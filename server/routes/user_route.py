import os
from dotenv import load_dotenv
from typing import Optional
from fastapi import APIRouter, Body, HTTPException, status, Response
from pydantic import EmailStr
from bson import ObjectId
from pymongo.errors import PyMongoError
from models.user_model import UserModel, LoginModel
from core.security import hash_password, verify_password
from database.connection import user_collection
from datetime import datetime, timedelta, timezone
import jwt

load_dotenv()

router = APIRouter()

def utc_now():
    return datetime.now(timezone.utc)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = utc_now() + (expires_delta or timedelta(minutes=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt

@router.post(
    "/signup/",
    response_description="Register a new user",
    response_model=UserModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def signup(user: UserModel = Body(...)):
    try:
        user.password = hash_password(user.password)
        new_user = await user_collection.insert_one(user.model_dump(by_alias=True, exclude=["id"]))
        created_user = await user_collection.find_one({"_id": new_user.inserted_id})
        return {"stat": "success", "statusCode": 201, "data": created_user}
    except PyMongoError as e:
        return {
            "stat": "error",
            "message": "Failed to register user due to a server error.",
            "details": str(e)
        }

@router.post(
    "/login/",
    response_description="User login",
    status_code=status.HTTP_200_OK,
)
async def login(login_data: LoginModel = Body(...), response: Response = None):
    try:
        user = await user_collection.find_one({"email": login_data.email})
        if user and verify_password(login_data.password, user["password"]):
            access_token = create_access_token(data={"user_id": str(user["_id"]), "email": user["email"]})
            response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True)
            return {"stat": "success","message": "Login successful", "statusCode": 200}
        return {
            "stat": "error",
            "message": "Invalid credentials",
        }
    except PyMongoError as e:
        return {
            "stat": "error",
            "message": "Failed to login due to a server error.",
            "details": str(e)
        }

@router.get(
    "/users/{id}",
    response_description="Get a single user",
    response_model=UserModel,
    response_model_by_alias=False,
)
async def show_user(id: str):
    try:
        user = await user_collection.find_one({"_id": ObjectId(id)})
        if user is not None:
            return {"stat": "success", "statusCode": 200, "data": user}
        return {
            "stat": "error",
            "message": f"User {id} not found",
        }
    except Exception as e:
        if isinstance(e, PyMongoError):
            return {
                "stat": "error",
                "message": "Failed to retrieve user due to a server error.",
                "details": str(e)
            }
        else:
            return {
                "stat": "error",
                "message": "Invalid ID format",
                "details": str(e)
            }

@router.delete("/users/{id}", response_description="Delete a user")
async def delete_user(id: str):
    try:
        delete_result = await user_collection.delete_one({"_id": ObjectId(id)})
        if delete_result.deleted_count == 1:
            return {"stat": "success", "message": "User deleted successfully"}
        return {
            "stat": "error",
            "message": f"User {id} not found",
        }
    except Exception as e:
        if isinstance(e, PyMongoError):
            return {
                "stat": "error",
                "message": "Failed to delete user due to a server error.",
                "details": str(e)
            }
        else:
            return {
                "stat": "error",
                "message": "Invalid ID format",
                "details": str(e)
            }