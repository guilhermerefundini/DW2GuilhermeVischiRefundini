// Clean, single-file frontend script
const API = 'http://127.0.0.1:8000'
let produtos = []
let cart = JSON.parse(localStorage.getItem('cart') || '[]')
let sortState = localStorage.getItem('sortState') || ''

const el = id => document.getElementById(id)

// Toast
const toast = (msg) => {
  const t = el('toast')
  if (!t) return
  t.textContent = msg
  t.classList.add('show')
  clearTimeout(t._timer)
  t._timer = setTimeout(() => t.classList.remove('show'), 2500)
}

async function fetchProdutos() {
  try {
    const q = new URLSearchParams()
    const searchNode = el('search')
    const search = searchNode ? searchNode.value.trim() : ''
    if (search) q.set('search', search)
    const categoria = el('categoriaFilter') ? el('categoriaFilter').value : ''
    if (categoria) q.set('categoria', categoria)
    if (sortState) q.set('sort', sortState)
    const res = await fetch(`${API}/produtos?${q.toString()}`)
    if (!res.ok) throw new Error('fetch')
    produtos = await res.json()
    renderProdutos(produtos)
    populateCategorias()
  } catch (e) {
    console.error(e)
    toast('Erro ao buscar produtos')
  }
}

function createCard(p) {
  const item = document.createElement('div')
  item.className = 'card'
  item.setAttribute('role', 'listitem')
  item.setAttribute('data-pid', p.id)

  const media = document.createElement('div')
  media.className = 'media'
  media.textContent = (p.categoria || '').slice(0,1).toUpperCase()

  const content = document.createElement('div')
  content.className = 'content'

  const title = document.createElement('div')
  title.className = 'title'
  title.textContent = p.nome

  const desc = document.createElement('div')
  desc.className = 'desc'
  desc.textContent = p.descricao || ''

  const details = document.createElement('div')
  details.className = 'details'
  const price = document.createElement('div')
  price.className = 'price'
  price.textContent = 'R$ ' + Number(p.preco).toFixed(2)
  const stock = document.createElement('div')
  stock.className = 'stock'
  stock.textContent = 'Est: ' + p.estoque
  details.appendChild(price); details.appendChild(stock)

  content.appendChild(title)
  content.appendChild(desc)
  content.appendChild(details)

  const actions = document.createElement('div')
  actions.className = 'actions'

  const btnAdd = document.createElement('button')
  btnAdd.className = 'add'
  btnAdd.setAttribute('title','Adicionar ao carrinho')
  btnAdd.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12v8H6z" fill="currentColor" opacity="0.9"/><path d="M12 9v6M9 12h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  btnAdd.onclick = () => addToCart(p.id)
  btnAdd.disabled = p.estoque <= 0

  const btnEdit = document.createElement('button')
  btnEdit.className = 'edit'
  btnEdit.setAttribute('title','Editar produto')
  btnEdit.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3-1 11-11 2 2L8 22 3 21z" fill="currentColor"/></svg>'
  btnEdit.onclick = () => openModal(true, p)

  const btnDel = document.createElement('button')
  btnDel.className = 'del'
  btnDel.setAttribute('title','Remover produto')
  btnDel.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6v12M16 6v12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  btnDel.onclick = () => removeProduto(p.id)

  actions.appendChild(btnAdd)
  actions.appendChild(btnEdit)
  actions.appendChild(btnDel)

  item.appendChild(media)
  item.appendChild(content)
  item.appendChild(actions)
  return item
}

function renderProdutos(list) {
  const grid = el('productGrid')
  if (!grid) return
  grid.innerHTML = ''
  if (!list || list.length === 0) {
    grid.innerHTML = '<div class="empty">Nenhum produto encontrado</div>'
    return
  }
  list.forEach(p => grid.appendChild(createCard(p)))
  // attach selection handlers: clicking a card toggles selection
  Array.from(grid.querySelectorAll('.card')).forEach(card => {
    card.addEventListener('click', (ev) => {
      // ignore clicks on action buttons inside the card
      if (ev.target.closest('button')) return
      // toggle selected
      card.classList.toggle('selected')
      // ensure only one selected at a time
      Array.from(grid.querySelectorAll('.card')).forEach(c => { if (c !== card) c.classList.remove('selected') })
    })
  })
}
  // add selected to cart
  const addSel = el('addSelectedBtn')
  if (addSel) addSel.addEventListener('click', () => {
    const sel = document.querySelector('.card.selected')
    if (!sel) { toast('Nenhum produto selecionado'); return }
    const pidAttr = sel.getAttribute('data-pid')
    let pid = pidAttr
    if (!pid) {
      // try to extract from title text by matching with produtos array
      const name = sel.querySelector('.title') ? sel.querySelector('.title').textContent.trim() : ''
      const p = produtos.find(x => x.nome === name)
      if (!p) { toast('Não foi possível identificar o produto selecionado'); return }
      pid = p.id
    }
    addToCart(pid)
  })

function populateCategorias() {
  const select = el('categoriaFilter')
  const pc = el('pCategoria')
  if (!select) return
  const cats = Array.from(new Set(produtos.map(p => p.categoria).filter(Boolean)))
  select.innerHTML = '<option value="">Todas as categorias</option>'
  if (pc) pc.innerHTML = ''
  cats.forEach(c => { select.innerHTML += `<option value="${c}">${c}</option>`; if (pc) pc.innerHTML += `<option value="${c}">${c}</option>` })
}

// Cart helpers
function updateBadge() {
  const badge = el('cartBadge')
  if (!badge) return
  badge.textContent = cart.reduce((s, i) => s + i.quantidade, 0)
}

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); updateBadge() }

function addToCart(id) {
  const p = produtos.find(x => x.id == id)
  if (!p) return
  if (p.estoque <= 0) { toast('Item sem estoque'); return }
  const found = cart.find(i => i.produto_id == id)
  if (found) { found.quantidade += 1 } else { cart.push({ produto_id: id, quantidade: 1 }) }
  saveCart(); toast('Adicionado ao carrinho')
  renderCart()
}

async function removeProduto(id) {
  if (!confirm('Remover produto?')) return
  try {
    const res = await fetch(`${API}/produtos/${id}`, { method: 'DELETE' })
    if (res.ok) { toast('Removido'); fetchProdutos() } else { const e = await res.json(); toast(e.detail || 'Erro ao remover') }
  } catch (e) { toast('Erro na requisição') }
}

function openModal(edit = false, p) {
  const d = el('productModal')
  if (!d) return
  el('pId').value = edit && p ? p.id : ''
  el('pNome').value = edit && p ? p.nome : ''
  el('pDescricao').value = edit && p ? p.descricao || '' : ''
  el('pPreco').value = edit && p ? Number(p.preco).toFixed(2) : ''
  el('pEstoque').value = edit && p ? p.estoque : 0
  el('pCategoria').value = edit && p ? p.categoria : ''
  el('pSku').value = edit && p ? p.sku || '' : ''
  if (typeof d.showModal === 'function') d.showModal(); el('pNome') && el('pNome').focus()
}

async function saveProduct(e) {
  e.preventDefault()
  const id = el('pId').value
  const payload = { nome: el('pNome').value.trim(), descricao: el('pDescricao').value.trim(), preco: parseFloat(el('pPreco').value), estoque: parseInt(el('pEstoque').value || 0, 10), categoria: el('pCategoria').value, sku: el('pSku').value }
  // Simple client-side validation
  if (!payload.nome || payload.nome.length < 3) { toast('Nome do produto precisa ter ao menos 3 caracteres'); return }
  if (isNaN(payload.preco) || payload.preco <= 0) { toast('Preço inválido'); return }
  try {
    let res
    if (id) {
      res = await fetch(`${API}/produtos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        let msg = 'Erro ao atualizar produto'
        try { const body = await res.json(); msg = body.detail || JSON.stringify(body) } catch(_) { try { const t = await res.text(); if (t) msg = t } catch(__){} }
        console.error('PUT /produtos error', res.status, res.statusText)
        console.error('Response body:', await (async ()=>{try{return await res.clone().text()}catch(e){return '<no body>'}})())
        toast(msg)
        return
      }
      toast('Produto atualizado')
    } else {
      res = await fetch(`${API}/produtos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        let msg = 'Erro ao criar produto'
        try { const body = await res.json(); msg = body.detail || JSON.stringify(body) } catch(_) { try { const t = await res.text(); if (t) msg = t } catch(__){} }
        console.error('POST /produtos error', res.status, res.statusText)
        console.error('Response body:', await (async ()=>{try{return await res.clone().text()}catch(e){return '<no body>'}})())
        toast(msg)
        return
      }
      toast('Produto criado')
    }
    const d = el('productModal')
    if (d && typeof d.close === 'function') d.close()
    fetchProdutos()
  } catch (e) { console.error(e); toast('Erro ao salvar produto') }
}

function renderCart() {
  const container = el('cartItems')
  if (!container) return
  container.innerHTML = ''
  if (!cart || cart.length === 0) { container.innerHTML = '<div class="empty">Carrinho vazio</div>'; updateBadge(); return }
  cart.forEach(i => {
    const p = produtos.find(x => x.id == i.produto_id)
    const row = document.createElement('div')
    row.className = 'cart-item'
    const meta = document.createElement('div')
    meta.className = 'meta'
    meta.innerHTML = `<div class="cart-name">${p ? p.nome : 'Produto removido'}</div><div class="cart-qty">Qty: ${i.quantidade}</div>`
    const actions = document.createElement('div')
    const btnRem = document.createElement('button')
    btnRem.textContent = 'Remover'
    btnRem.onclick = () => { cart = cart.filter(x => x.produto_id !== i.produto_id); saveCart(); renderCart() }
    actions.appendChild(btnRem)
    row.appendChild(meta); row.appendChild(actions)
    container.appendChild(row)
  })
  updateBadge()
  renderTotals()
}

function renderTotals() {
  const totals = el('cartTotals')
  if (!totals) return
  const itens = cart.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade }))
  let subtotal = 0
  itens.forEach(it => { const p = produtos.find(x => x.id == it.produto_id); if (p) subtotal += Number(p.preco) * it.quantidade })
  totals.innerHTML = `<div>Subtotal: R$ ${subtotal.toFixed(2)}</div>`
}

async function confirmOrder() {
  if (!cart || cart.length === 0) { toast('Carrinho vazio'); return }
  const itens = cart.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade }))
  const cupom = el('coupon') ? el('coupon').value.trim() : ''
  try {
    const res = await fetch(`${API}/carrinho/confirmar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itens, cupom }) })
    if (!res.ok) { const err = await res.json(); toast(err.detail || 'Erro'); return }
    const data = await res.json(); toast('Pedido confirmado R$ ' + parseFloat(data.total_final).toFixed(2))
    cart = []; saveCart(); el('cartDrawer') && el('cartDrawer').setAttribute('aria-hidden', 'true')
    fetchProdutos()
  } catch (e) { console.error(e); toast('Erro ao confirmar pedido') }
}

// Exports
/* exportCsv and exportJson removed per request */

// safe event attach helper
function on(id, type, handler) { const node = el(id); if (node) node.addEventListener(type, handler) }

// Theme
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.body.setAttribute('data-theme', 'dark')
    document.querySelectorAll('.card').forEach(c => c.setAttribute('data-theme', 'dark'))
    document.querySelectorAll('#cartDrawer').forEach(c => c.setAttribute('data-theme', 'dark'))
    const tbtn = el('themeToggle'); if (tbtn) { tbtn.setAttribute('aria-pressed', 'true'); tbtn.textContent = '☀️' }
  } else {
    document.documentElement.removeAttribute('data-theme')
    document.body.removeAttribute('data-theme')
    document.querySelectorAll('.card').forEach(c => c.removeAttribute('data-theme'))
    document.querySelectorAll('#cartDrawer').forEach(c => c.removeAttribute('data-theme'))
    const tbtn = el('themeToggle'); if (tbtn) { tbtn.setAttribute('aria-pressed', 'false'); tbtn.textContent = '🌙' }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem('site-theme') || 'light'
  applyTheme(storedTheme)
  on('themeToggle', 'click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('site-theme', next)
    applyTheme(next)
  })

  on('search', 'input', () => { fetchProdutos() })
  on('sort', 'change', e => { sortState = e.target.value; localStorage.setItem('sortState', sortState); fetchProdutos() })
  on('newProductBtn', 'click', () => openModal(false))
  const pc = el('pCategoria')
  if (pc) pc.addEventListener('change', () => { })
  on('productForm', 'submit', saveProduct)
  on('cancelProduct', 'click', () => { const d = el('productModal'); if (d && d.close) d.close() })
  on('closeModal', 'click', () => { const d = el('productModal'); if (d && d.close) d.close() })
  // export buttons removed
  on('cartBtn', 'click', () => { const cd = el('cartDrawer'); if (cd) { cd.setAttribute('aria-hidden', 'false'); renderCart() } })
  on('closeCart', 'click', () => { const cd = el('cartDrawer'); if (cd) cd.setAttribute('aria-hidden', 'true') })
  on('confirmOrder', 'click', confirmOrder)

  document.addEventListener('keydown', (e) => {
    const cd = el('cartDrawer')
    if (e.key === 'Escape' && cd && cd.getAttribute('aria-hidden') === 'false') cd.setAttribute('aria-hidden', 'true')
    if (e.altKey && e.key.toLowerCase() === 'n') { openModal(false); e.preventDefault() }
  })

  renderCart()
  updateBadge()
  fetchProdutos()
})

