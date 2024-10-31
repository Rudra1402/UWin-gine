import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client.college
user_collection = db.get_collection("users")
user_collection.create_index("email", unique=True)