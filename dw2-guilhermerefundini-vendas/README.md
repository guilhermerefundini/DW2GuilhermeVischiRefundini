# Loja Escolar (Vendas de Produtos)

Backend: FastAPI + SQLAlchemy + SQLite
Frontend: Vanilla HTML/CSS/JS

Run backend:

1. Create a virtual env and install deps

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

2. Seed the database

```powershell
python backend\seed.py
```

3. Start server

```powershell
uvicorn backend.app:app --reload
```

4. Open `frontend/index.html` in the browser (serve via simple static server to avoid CORS issues):

```powershell
cd frontend
python -m http.server 5173
```

API endpoints:
- GET /produtos
- POST /produtos
- PUT /produtos/{id}
- DELETE /produtos/{id}
- POST /carrinho/confirmar

