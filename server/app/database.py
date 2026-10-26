from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Формат: postgresql://ПОЛЬЗОВАТЕЛЬ:ПАРОЛЬ@ХОСТ:ПОРТ/ИМЯ_БАЗЫ
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5433/price_tracker"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()