from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import schemas
import crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Loja Escolar - Vendas de Produtos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/produtos', response_model=list[schemas.ProdutoOut])
def listar_produtos(search: str = None, categoria: str = None, sort: str = None, db: Session = Depends(get_db)):
    produtos = crud.get_produtos(db, search, categoria, sort)
    return produtos

@app.post('/produtos', response_model=schemas.ProdutoOut, status_code=201)
def criar_produto(p: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    try:
        produto = crud.create_produto(db, p)
        return produto
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put('/produtos/{produto_id}', response_model=schemas.ProdutoOut)
def atualizar_produto(produto_id: int, p: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    try:
        produto = crud.update_produto(db, produto_id, p)
        if not produto:
            raise HTTPException(status_code=404, detail='Produto não encontrado')
        return produto
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete('/produtos/{produto_id}')
def remover_produto(produto_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_produto(db, produto_id)
    if not ok:
        raise HTTPException(status_code=404, detail='Produto não encontrado')
    return {'ok': True}

@app.post('/carrinho/confirmar', response_model=schemas.PedidoOut)
def confirmar_carrinho(req: schemas.ConfirmRequest, db: Session = Depends(get_db)):
    try:
        coupon = req.cupom or req.coupon
        pedido = crud.confirmar_pedido(db, req.itens, coupon)
        return schemas.PedidoOut.from_orm(pedido)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
