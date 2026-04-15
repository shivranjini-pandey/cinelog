from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username       = Column(String(30), unique=True, nullable=False, index=True)
    email          = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    bio            = Column(Text, nullable=True)
    avatar_url     = Column(String, nullable=True)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    reviews        = relationship("Review", back_populates="author")
    watchlist      = relationship("WatchlistItem", back_populates="user")