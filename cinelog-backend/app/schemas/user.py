from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: UUID
    username: str
    bio: str | None
    avatar_url: str | None
    created_at: datetime

    class Config:
        from_attributes = True     # lets Pydantic read SQLAlchemy objects