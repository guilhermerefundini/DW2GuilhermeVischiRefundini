from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

produtos = [
    {"nome": "Caderno A5 100 folhas", "descricao": "Caderno com capa dura - 100 folhas pautadas.", "preco": 12.90, "estoque": 50, "categoria": "Cadernos", "sku": "CAD-A5-100"},
    {"nome": "Caderno A4 200 folhas", "descricao": "Caderno grande para projetos e anotações.", "preco": 24.50, "estoque": 30, "categoria": "Cadernos", "sku": "CAD-A4-200"},
    {"nome": "Caneta Esferográfica Azul", "descricao": "Caneta esferográfica 0.7mm, tinta azul.", "preco": 1.80, "estoque": 200, "categoria": "Canetas", "sku": "CAN-AZ-07"},
    {"nome": "Caneta Gel Preta", "descricao": "Caneta gel 0.5mm, escrita suave.", "preco": 3.50, "estoque": 120, "categoria": "Canetas", "sku": "CAN-GEL-05"},
    {"nome": "Lápis HB", "descricao": "Lápis de grafite HB - pacote com 12.", "preco": 9.00, "estoque": 80, "categoria": "Lápis", "sku": "LAP-HB-12"},
    {"nome": "Borracha branca", "descricao": "Borracha macia para apagar sem rasgar o papel.", "preco": 2.75, "estoque": 150, "categoria": "Acessórios", "sku": "BORR-BR"},
    {"nome": "Apontador duplo", "descricao": "Apontador com reservatório.", "preco": 4.20, "estoque": 90, "categoria": "Acessórios", "sku": "APON-DUO"},
    {"nome": "Mochila Escolar 20L", "descricao": "Mochila resistente com vários bolsos.", "preco": 89.90, "estoque": 25, "categoria": "Mochilas", "sku": "MOC-20L"},
    {"nome": "Estojo simples", "descricao": "Estojo para canetas e lápis.", "preco": 15.00, "estoque": 60, "categoria": "Acessórios", "sku": "EST-SIM"},
    {"nome": "Réguas plásticas 30cm", "descricao": "Conjunto com 2 réguas de 30cm.", "preco": 7.80, "estoque": 40, "categoria": "Acessórios", "sku": "REG-30"},
    {"nome": "Marcador de Texto Amarelo", "descricao": "Marcador de texto fluorescente.", "preco": 5.50, "estoque": 110, "categoria": "Marcadores", "sku": "MAR-AM"},
    {"nome": "Cola Bastão 20g", "descricao": "Cola em bastão para papel.", "preco": 6.20, "estoque": 75, "categoria": "Colas", "sku": "COL-B20"},
    {"nome": "Bloco de Notas Adesivas 3x3", "descricao": "Post-it 3x3 - pacote com 5 cores.", "preco": 9.90, "estoque": 95, "categoria": "Papéis", "sku": "POST-3X3"},
    {"nome": "Massa de Modelar 200g", "descricao": "Massa colorida para atividades manuais.", "preco": 12.00, "estoque": 45, "categoria": "Artes", "sku": "MAS-200"},
    {"nome": "Calculadora Científica", "descricao": "Calculadora para funções científicas.", "preco": 149.90, "estoque": 10, "categoria": "Eletrônicos", "sku": "CAL-CIEN"},
    {"nome": "Agenda 2025", "descricao": "Agenda anual com calendário e espaço para notas.", "preco": 29.90, "estoque": 35, "categoria": "Papelaria", "sku": "AGEN-2025"},
    {"nome": "Papel Sulfite A4 (500fls)", "descricao": "Resma de papel sulfite A4 - 500 folhas.", "preco": 22.00, "estoque": 20, "categoria": "Papéis", "sku": "PAP-A4-500"},
    {"nome": "Fita Adesiva Transparente", "descricao": "Fita adesiva para escritório - 18mm.", "preco": 6.50, "estoque": 140, "categoria": "Acessórios", "sku": "FIT-TR"},
    {"nome": "Caderno de Música", "descricao": "Caderno pautado para partituras.", "preco": 14.00, "estoque": 18, "categoria": "Cadernos", "sku": "CAD-MUS"},
    {"nome": "Estojo Organizacional", "descricao": "Estojo com divisórias para materiais diversos.", "preco": 34.90, "estoque": 0, "categoria": "Acessórios", "sku": "EST-ORG"},
]


db = SessionLocal()
try:
    db.query(models.Produto).delete()
    for p in produtos:
        prod = models.Produto(**p)
        db.add(prod)
    db.commit()
    print('Seed concluído: ', len(produtos), 'produtos inseridos')
finally:
    db.close()
