from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserPublic(BaseModel):
    id: UUID
    username: str
    bio: str | None = None
    avatar_url: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True     # lets Pydantic read SQLAlchemy objects

class UserUpdate(BaseModel):
    bio: str | None = Field(None, max_length=300)
    avatar_url: str | None = None


class UserProfileOut(BaseModel):
    id:  UUID
    username: str
    bio: str | None = None
    avatar_url: str | None = None
    created_at: datetime
    review_count: int        # computed, not a DB column

    class Config:
        from_attributes = True