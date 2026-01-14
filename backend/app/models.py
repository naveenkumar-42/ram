from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime
from .database import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    VIEWER = "viewer"

class TriggerSource(enum.Enum):
    RPA = "rpa"
    MANUAL = "manual"
    MARGIN_PROTECTION = "margin_protection"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VIEWER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    base_cost = Column(Float, nullable=False) # cost price
    current_price = Column(Float, nullable=False) # selling price
    min_margin_percent = Column(Float, default=0.10) # 10% default margin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    competitor_prices = relationship("CompetitorPrice", back_populates="product")
    price_history = relationship("PriceHistory", back_populates="product")

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)
    base_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    prices = relationship("CompetitorPrice", back_populates="competitor")

class CompetitorPrice(Base):
    __tablename__ = "competitor_prices"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    competitor_id = Column(String, ForeignKey("competitors.id"), nullable=False)
    price = Column(Float, nullable=False)
    captured_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="competitor_prices")
    competitor = relationship("Competitor", back_populates="prices")

class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    old_price = Column(Float, nullable=False)
    new_price = Column(Float, nullable=False)
    trigger_source = Column(Enum(TriggerSource), nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="price_history")
