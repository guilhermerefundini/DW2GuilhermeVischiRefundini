from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProdutoBase(BaseModel):
    nome: str = Field(..., min_length=3, max_length=60)
    descricao: Optional[str] = None
    preco: float = Field(..., gt=0.009)
    estoque: int = Field(..., ge=0)
    categoria: Optional[str] = None
    sku: Optional[str] = None

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoOut(ProdutoBase):
    id: int
    class Config:
        orm_mode = True

class CarrinhoItem(BaseModel):
    produto_id: int
    quantidade: int

class ConfirmRequest(BaseModel):
    itens: List[CarrinhoItem]
    cupom: Optional[str] = None
    # Accept 'coupon' as an alias from some clients
    coupon: Optional[str] = None

class PedidoOut(BaseModel):
    id: int
    total_final: float
    data: datetime
    status: str
    class Config:
        orm_mode = True
