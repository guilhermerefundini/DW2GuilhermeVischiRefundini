from sqlalchemy.orm import Session
from models import Produto, Pedido
from decimal import Decimal, ROUND_HALF_UP


def to_decimal(value):
    return Decimal(value).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def get_produtos(db: Session, search: str=None, categoria: str=None, sort: str=None):
    q = db.query(Produto)
    if search:
        q = q.filter(Produto.nome.ilike(f"%{search}%"))
    if categoria:
        q = q.filter(Produto.categoria==categoria)
    if sort == 'preco_asc':
        q = q.order_by(Produto.preco.asc())
    elif sort == 'preco_desc':
        q = q.order_by(Produto.preco.desc())
    elif sort == 'nome_asc':
        q = q.order_by(Produto.nome.asc())
    elif sort == 'nome_desc':
        q = q.order_by(Produto.nome.desc())
    return q.all()

def create_produto(db: Session, p):
    existing = db.query(Produto).filter(Produto.nome==p.nome).first()
    if existing:
        raise ValueError('Produto com esse nome já existe')
    produto = Produto(nome=p.nome, descricao=p.descricao, preco=float(to_decimal(p.preco)), estoque=p.estoque, categoria=p.categoria, sku=p.sku)
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto

def update_produto(db: Session, produto_id: int, p):
    produto = db.get(Produto, produto_id)
    if not produto:
        return None
    other = db.query(Produto).filter(Produto.nome==p.nome, Produto.id!=produto_id).first()
    if other:
        raise ValueError('Outro produto com esse nome já existe')
    produto.nome = p.nome
    produto.descricao = p.descricao
    produto.preco = float(to_decimal(p.preco))
    produto.estoque = p.estoque
    produto.categoria = p.categoria
    produto.sku = p.sku
    db.commit()
    db.refresh(produto)
    return produto

def delete_produto(db: Session, produto_id: int):
    produto = db.get(Produto, produto_id)
    if not produto:
        return False
    db.delete(produto)
    db.commit()
    return True

def confirmar_pedido(db: Session, itens, coupon: str=None):
    if not itens:
        raise ValueError('Carrinho vazio')
    total = Decimal('0.00')
    produtos_a_atualizar = []
    for item in itens:
        produto = db.get(Produto, item['produto_id'] if isinstance(item, dict) else item.produto_id)
        if not produto:
            raise ValueError(f'Produto id {(item.get("produto_id") if isinstance(item, dict) else item.produto_id)} não encontrado')
        quantidade = item['quantidade'] if isinstance(item, dict) else item.quantidade
        if produto.estoque < quantidade:
            raise ValueError(f'Estoque insuficiente para {produto.nome}')
        total += to_decimal(produto.preco) * quantidade
        produtos_a_atualizar.append((produto, quantidade))
    discount = Decimal('0.00')
    if coupon:
        if coupon.strip().upper()=='ALUNO10':
            discount = (total * Decimal('0.10')).quantize(Decimal('0.01'))
        else:
            raise ValueError('Cupom inválido')
    final = (total - discount).quantize(Decimal('0.01'))
    for produto, qtd in produtos_a_atualizar:
        produto.estoque = produto.estoque - qtd
        db.add(produto)
    pedido = Pedido(total_final=float(final))
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return pedido
