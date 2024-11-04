import sys
import os
from dotenv import load_dotenv
from typing import Optional
from fastapi import APIRouter, Body, HTTPException, status, Response
from pydantic import EmailStr
from bson import ObjectId
from pymongo.errors import PyMongoError, DuplicateKeyError
from models.user_model import UserModel, LoginModel, QueryRequestModel
from core.security import hash_password, verify_password
from database.connection import user_collection
from typing import Union
from datetime import datetime, timedelta, timezone
import jwt

load_dotenv()

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'llm')))
from llm_model_qna import main

router = APIRouter()

def utc_now():
    return datetime.now(timezone.utc)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))  # Default to 15 minutes if not set
    expire = utc_now() + (expires_delta or timedelta(minutes=expire_minutes))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt

@router.get("/")
async def root():
    return {"message": "Welcome to the API! The server is up and running."}

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

        if created_user:
            return UserModel(**created_user)
    except DuplicateKeyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User registration failed: {str(e)}"
        )
    except PyMongoError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error during user registration: {str(e)}"
        )

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
            return {
                "stat": "success",
                "message": "Login successful",
                "statusCode": 200,
                "access_token": access_token
            }
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

@router.post(
    "/chat/",
    response_description="Process user query",
    status_code=status.HTTP_200_OK
)
async def process_query(query_request: QueryRequestModel = Body(...), response: Response = None):
    try:
        # Validate user_id
        user = await user_collection.find_one({"_id": ObjectId(query_request.thread_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {query_request.thread_id} not found."
            )
        
        print("Calling LLM!")
        # Process the query (logic can be extended as needed)
        d = main(thread_id=query_request.thread_id, question=query_request.question)

        if not d or 'answer' not in d or d['answer'] is None:
            raise ValueError("The main function returned an invalid response")

        result = {
            "message": f"Query '{d['answer']}' has been processed for user!"
        }
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing the query: {str(e)}"
        )
