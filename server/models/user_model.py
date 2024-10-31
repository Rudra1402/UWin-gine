from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from datetime import datetime, timezone

# Represents an ObjectId field in the database.
PyObjectId = Annotated[str, BeforeValidator(str)]

def utc_now():
    return datetime.now(timezone.utc)

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    user_type: str = Field(..., description="The type of user, e.g., 'admin' or 'regular' user")
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "first_name": "Jane",
                "last_name": "Doe",
                "email": "jane.doe@example.com",
                "password": "securepassword",
                "user_type": "Incoming Grad",
            }
        },
    )

class LoginModel(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)

class ChatModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId = Field(..., description="Reference to the user who sent/received the message")
    timestamp: datetime = Field(default_factory=utc_now, description="Timestamp of the message")
    role: str = Field(..., description="The role of the message sender, either 'user' or 'bot'")
    message: str = Field(..., description="The actual chat message content")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "user_id": "605c72a1d3e3b69a2f5d8f9a",
                "timestamp": "2024-10-30T12:34:56Z",
                "role": "user",
                "message": "Hello! How can I help you today?"
            }
        }