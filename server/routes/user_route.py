from fastapi import APIRouter, Body, HTTPException, status, Response
from pydantic import EmailStr
from bson import ObjectId
from models.user_model import UserModel, LoginModel
from core.security import hash_password, verify_password
from database.connection import user_collection

router = APIRouter()

@router.post(
    "/signup/",
    response_description="Register a new user",
    response_model=UserModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def signup(user: UserModel = Body(...)):
    user.password = hash_password(user.password)
    new_user = await user_collection.insert_one(user.model_dump(by_alias=True, exclude=["id"]))
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return created_user

@router.post(
    "/login/",
    response_description="User login",
    status_code=status.HTTP_200_OK,
)
async def login(login_data: LoginModel = Body(...)):
    user = await user_collection.find_one({"email": login_data.email})
    if user and verify_password(login_data.password, user["password"]):
        return {"message": "Login successful"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

@router.get(
    "/users/{id}",
    response_description="Get a single user",
    response_model=UserModel,
    response_model_by_alias=False,
)
async def show_user(id: str):
    if (user := await user_collection.find_one({"_id": ObjectId(id)})) is not None:
        return user
    raise HTTPException(status_code=404, detail=f"User {id} not found")

@router.delete("/users/{id}", response_description="Delete a user")
async def delete_user(id: str):
    delete_result = await user_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail=f"User {id} not found")
