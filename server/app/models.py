from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String(255), unique=True, index=True)
    balance = Column(Numeric(15, 2), default=0)

class Marketplace(Base):
    __tablename__ = "marketplaces"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))

class Product(Base):
    __tablename__ = "products"
    id = Column(BigInteger, primary_key=True)
    url = Column(String(255))
    marketplace_id = Column(Integer, ForeignKey("marketplaces.id"))
    
    # Связь с историей цен (один товар - много записей истории)
    price_history = relationship("PriceHistory", back_populates="product")

class PriceHistory(Base):
    __tablename__ = "price_history"
    id = Column(Integer, primary_key=True)
    product_id = Column(BigInteger, ForeignKey("products.id"))
    price = Column(Numeric(15, 2))
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Обратная связь
    product = relationship("Product", back_populates="price_history")

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True)
    schedule_type = Column(String(255))
    run_at = Column(DateTime(timezone=True))
    interval = Column(Integer)

class Subscription(Base):
    __tablename__ = "subscriptions" # Бывшие orders
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    product_id = Column(BigInteger, ForeignKey("products.id"))
    schedule_id = Column(Integer, ForeignKey("schedules.id"))
    status = Column(String(255), default="active")