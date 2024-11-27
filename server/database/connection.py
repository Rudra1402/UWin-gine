import motor.motor_asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client["college"]
user_collection = db["users"]
chat_collection = db["chats"]
date_chat_collection = db["dateChats"]
user_chat_session_collection = db["chatSession"]

def get_user_collection():
    return db["users"]

def get_chat_collection():
    return db["chats"]

def get_date_chat_collection():
    return db["date_chats"]

def get_user_chat_session_collection():
    return db["chatSession"]