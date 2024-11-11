import motor.motor_asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client["college"]
user_collection = db["users"]
chat_collection = db["chats"]

def get_user_collection():
    return db["users"]

def get_chat_collection():
    return db["chats"]