from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Produto(Base):
    __tablename__ = 'produtos'
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False, unique=True)
    descricao = Column(String(1000), nullable=True)
    preco = Column(Float, nullable=False)
    estoque = Column(Integer, nullable=False, default=0)
    categoria = Column(String(100), nullable=True)
    sku = Column(String(50), nullable=True, unique=True)

class Pedido(Base):
    __tablename__ = 'pedidos'
    id = Column(Integer, primary_key=True, index=True)
    total_final = Column(Float, nullable=False)
    data = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default='CONFIRMADO')
