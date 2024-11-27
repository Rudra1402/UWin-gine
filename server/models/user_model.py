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

class LoginModel(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)

class UserResponseModel(BaseModel):
    stat: str
    statusCode: int
    data: UserModel

class ReferenceModel(BaseModel):
    title: str = Field(..., description="Title of the referenced document")
    link: str = Field(..., description="URL link to the referenced document")
    pages: list[int] = Field(..., description="List of pages referenced in the document")

class ChatModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId = Field(..., description="Reference to the user who sent/received the message")
    session_id: PyObjectId = Field(..., description="Unique identifier for the chat session")
    timestamp: datetime = Field(default_factory=utc_now, description="Timestamp of the message")
    role: str = Field(..., description="The role of the message sender, either 'user' or 'bot'")
    prompt: str = Field(..., description="The user prompt")
    answer: str = Field(..., description="The LLM response")
    references: list[ReferenceModel] = Field(default_factory=list, description="List of references for the answer")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class UserChatSession(BaseModel):
    user_id: str = Field(..., description="The ID of the user who owns the session")
    session_id: str = Field(..., description="Unique identifier for the chat session")
    type: str = Field(..., description="The type of chat session")
    started_at: Optional[datetime] = Field(default_factory=utc_now, description="Start time of the session")
    ended_at: Optional[datetime] = Field(default=None, description="End time of the session, if applicable")

    class Config:
        arbitrary_types_allowed = True

class DateChatModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId = Field(..., description="Reference to the user who sent/received the message")
    timestamp: datetime = Field(default_factory=utc_now, description="Timestamp of the message")
    role: str = Field(..., description="The role of the message sender, either 'user' or 'bot'")
    prompt: str = Field(..., description="The user prompt")
    answer: str = Field(..., description="The LLM response")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
class QueryRequestModel(BaseModel):
    thread_id: str
    question: str
    chat_type: str

class ChatRecord(BaseModel):
    id: str
    user_id: str
    timestamp: datetime
    role: str
    prompt: str
    answer: str