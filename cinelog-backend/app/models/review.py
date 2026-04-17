from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id        = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    tmdb_movie_id  = Column(String, nullable=False, index=True)
    movie_title    = Column(String, nullable=False)  # denormalized for speed
    rating         = Column(Integer, nullable=False)  # 1-10
    content        = Column(Text, nullable=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    author         = relationship("User", back_populates="reviews")
    insights       = relationship(
                        "ReviewInsight",
                        back_populates="review",
                        uselist=False,
                        cascade="all, delete-orphan",
                        )

class ReviewInsight(Base):
    __tablename__ = "review_insights"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    review_id   = Column(UUID(as_uuid=True), ForeignKey("reviews.id"), nullable=False)
    sentiment   = Column(String(20))   # "positive" | "negative" | "mixed"
    themes      = Column(String(255))  # comma-separated: "acting, pacing, visuals"
    verdict     = Column(Text)         # one sentence from ChatGPT
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    review      = relationship("Review", back_populates="insights")