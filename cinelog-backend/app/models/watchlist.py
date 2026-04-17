from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id        = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    tmdb_movie_id  = Column(String, nullable=False)
    movie_title    = Column(String, nullable=False)
    poster_path    = Column(String, nullable=True)
    added_at       = Column(DateTime(timezone=True), server_default=func.now())

    user           = relationship("User", back_populates="watchlist", cascade="all, delete-orphan", single_parent=True)