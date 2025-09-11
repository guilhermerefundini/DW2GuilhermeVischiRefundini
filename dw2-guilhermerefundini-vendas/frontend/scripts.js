const API = 'http://127.0.0.1:8000'
let produtos = []
let cart = JSON.parse(localStorage.getItem('cart')||'[]')
let sortState = localStorage.getItem('sortState')||''

const el = id=>document.getElementById(id)

// Toast utility with ARIA
const toastEl = el('toast')
let toastTimer = null
const toast = (msg)=>{
  if(!toastEl) return
  toastEl.textContent = msg
  toastEl.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(()=>toastEl.classList.remove('show'),2500)
}

async function fetchProdutos(){
  try{
    const q = new URLSearchParams()
    const search = el('search').value.trim()
    if(search) q.set('search',search)
    const categoria = el('categoriaFilter').value
    if(categoria) q.set('categoria',categoria)
    if(sortState) q.set('sort',sortState)
    const res = await fetch(`${API}/produtos?${q.toString()}`)
    if(!res.ok) throw new Error('fetch')
    produtos = await res.json()
    renderProdutos(produtos)
    populateCategorias()
  }catch(e){console.error(e);toast('Erro ao buscar produtos')}
}

function createCard(p){
  const item = document.createElement('div')
  item.className = 'card'
  item.setAttribute('role','listitem')
  const media = document.createElement('div')
  media.className = 'media'
  media.textContent = p.categoria || 'Produto'

  const title = document.createElement('div')
  title.className = 'title'
  title.textContent = p.nome

  const desc = document.createElement('div')
  desc.className = 'desc'
  desc.textContent = p.descricao || ''

  const price = document.createElement('div')
  price.className = 'price'
  price.textContent = 'R$ ' + Number(p.preco).toFixed(2)

  const stock = document.createElement('div')
  stock.className = 'stock'
  stock.textContent = 'Estoque: ' + p.estoque

  const actions = document.createElement('div')
  actions.className = 'actions'

  const btnAdd = document.createElement('button')
  btnAdd.className = 'add'
  btnAdd.textContent = 'Adicionar'
  btnAdd.onclick = ()=>addToCart(p.id)
  btnAdd.disabled = p.estoque<=0

  const btnEdit = document.createElement('button')
  btnEdit.className = 'edit'
  btnEdit.textContent = 'Editar'
  btnEdit.onclick = ()=>openModal(true,p)

  const btnDel = document.createElement('button')
  btnDel.className = 'del'
  btnDel.textContent = 'Remover'
  btnDel.onclick = ()=>removeProduto(p.id)

  actions.appendChild(btnAdd)
  actions.appendChild(btnEdit)
  actions.appendChild(btnDel)

  item.appendChild(media)
  item.appendChild(title)
  item.appendChild(desc)
  item.appendChild(price)
  item.appendChild(stock)
  item.appendChild(actions)
  return item
}

function renderProdutos(list){
  const grid = el('productGrid')
  grid.innerHTML = ''
  if(!list.length){
    grid.innerHTML = '<div class="empty">Nenhum produto encontrado</div>'
    return
  }
  list.forEach(p=> grid.appendChild(createCard(p)))
}

function populateCategorias(){
  const select = el('categoriaFilter')
  const pc = el('pCategoria')
  const cats = Array.from(new Set(produtos.map(p=>p.categoria).filter(Boolean)))
  select.innerHTML = '<option value="">Todas as categorias</option>'
  if(pc) pc.innerHTML = ''
  cats.forEach(c=>{select.innerHTML+=`<option value="${c}">${c}</option>`; if(pc) pc.innerHTML+=`<option value="${c}">${c}</option>`})
}

// Cart
function updateBadge(){
  const badge = el('cartBadge')
  if(!badge) return
  const API = 'http://127.0.0.1:8000'
  let produtos = []
  let cart = JSON.parse(localStorage.getItem('cart')||'[]')
  let sortState = localStorage.getItem('sortState')||''

  const el = id=>document.getElementById(id)

  // Toast utility with ARIA
  const toastEl = el('toast')
  let toastTimer = null
  const toast = (msg)=>{
    if(!toastEl) return
    toastEl.textContent = msg
    toastEl.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(()=>toastEl.classList.remove('show'),2500)
  }

  async function fetchProdutos(){
    try{
      const q = new URLSearchParams()
      const search = el('search').value.trim()
      if(search) q.set('search',search)
      const categoria = el('categoriaFilter').value
      if(categoria) q.set('categoria',categoria)
      if(sortState) q.set('sort',sortState)
      const res = await fetch(`${API}/produtos?${q.toString()}`)
      if(!res.ok) throw new Error('fetch')
      produtos = await res.json()
      renderProdutos(produtos)
      populateCategorias()
    }catch(e){console.error(e);toast('Erro ao buscar produtos')}
  }

  function createCard(p){
    const item = document.createElement('div')
    item.className = 'card'
    item.setAttribute('role','listitem')
    const media = document.createElement('div')
    media.className = 'media'
    media.textContent = p.categoria || 'Produto'

    const title = document.createElement('div')
    title.className = 'title'
    title.textContent = p.nome

    const desc = document.createElement('div')
    desc.className = 'desc'
    desc.textContent = p.descricao || ''

    const price = document.createElement('div')
    price.className = 'price'
    price.textContent = 'R$ ' + Number(p.preco).toFixed(2)

    const stock = document.createElement('div')
    stock.className = 'stock'
    stock.textContent = 'Estoque: ' + p.estoque

    const actions = document.createElement('div')
    actions.className = 'actions'

    const btnAdd = document.createElement('button')
    btnAdd.className = 'add'
    btnAdd.textContent = 'Adicionar'
    btnAdd.onclick = ()=>addToCart(p.id)
    btnAdd.disabled = p.estoque<=0

    const btnEdit = document.createElement('button')
    btnEdit.className = 'edit'
    btnEdit.textContent = 'Editar'
    btnEdit.onclick = ()=>openModal(true,p)

    const btnDel = document.createElement('button')
    btnDel.className = 'del'
    btnDel.textContent = 'Remover'
    btnDel.onclick = ()=>removeProduto(p.id)

    actions.appendChild(btnAdd)
    actions.appendChild(btnEdit)
    actions.appendChild(btnDel)

    item.appendChild(media)
    item.appendChild(title)
    item.appendChild(desc)
    item.appendChild(price)
    item.appendChild(stock)
    item.appendChild(actions)
    return item
  }

  function renderProdutos(list){
    const grid = el('productGrid')
    grid.innerHTML = ''
    if(!list.length){
      grid.innerHTML = '<div class="empty">Nenhum produto encontrado</div>'
      return
    }
    list.forEach(p=> grid.appendChild(createCard(p)))
  }

  function populateCategorias(){
    const select = el('categoriaFilter')
    const pc = el('pCategoria')
    const cats = Array.from(new Set(produtos.map(p=>p.categoria).filter(Boolean)))
    select.innerHTML = '<option value="">Todas as categorias</option>'
    if(pc) pc.innerHTML = ''
    cats.forEach(c=>{select.innerHTML+=`<option value="${c}">${c}</option>`; if(pc) pc.innerHTML+=`<option value="${c}">${c}</option>`})
  }

  // Cart
  function updateBadge(){
    const badge = el('cartBadge')
    if(!badge) return
    badge.textContent = cart.reduce((s,i)=>s+i.quantidade,0)
  }
  function saveCart(){localStorage.setItem('cart',JSON.stringify(cart));updateBadge()}

  function addToCart(id){
    const p = produtos.find(x=>x.id==id)
    if(!p) return
    if(p.estoque<=0){toast('Item sem estoque');return}
    const found = cart.find(i=>i.produto_id==id)
    if(found){found.quantidade+=1}else{cart.push({produto_id:id,quantidade:1})}
    saveCart();toast('Adicionado ao carrinho')
    renderCart()
  }

  async function removeProduto(id){
    if(!confirm('Remover produto?'))return
    try{
      const res = await fetch(`${API}/produtos/${id}`,{method:'DELETE'})
      if(res.ok){toast('Removido');fetchProdutos()}else{const e=await res.json();toast(e.detail||'Erro ao remover')}
    }catch(e){toast('Erro na requisição')}
  }

  function openModal(edit=false,p){
    const d = el('productModal')
    el('pId').value = edit?p.id:''
    el('pNome').value = edit?p.nome:''
    el('pDescricao').value = edit?p.descricao||''
    el('pPreco').value = edit?Number(p.preco).toFixed(2):''
    el('pEstoque').value = edit?p.estoque:0
    el('pCategoria').value = edit?p.categoria:''
    el('pSku').value = edit?p.sku||''
    d.showModal();el('pNome').focus()
  }

  async function saveProduct(e){
    e.preventDefault()
    const id = el('pId').value
    const payload = {nome:el('pNome').value.trim(), descricao:el('pDescricao').value.trim(), preco:parseFloat(el('pPreco').value), estoque:parseInt(el('pEstoque').value||0,10), categoria:el('pCategoria').value, sku:el('pSku').value}
    try{
      let res
      if(id){
        res = await fetch(`${API}/produtos/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        if(!res.ok) throw new Error('erro')
        toast('Produto atualizado')
      }else{
        res = await fetch(`${API}/produtos`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        if(!res.ok) throw new Error('erro')
        toast('Produto criado')
      }
      el('productModal').close();fetchProdutos()
    }catch(e){console.error(e);toast('Erro ao salvar produto')}
  }

  function renderCart(){
    const container = el('cartItems')
    container.innerHTML = ''
    if(cart.length===0){container.innerHTML = '<div class="empty">Carrinho vazio</div>';updateBadge();return}
    cart.forEach(i=>{
      const p = produtos.find(x=>x.id==i.produto_id)
      const row = document.createElement('div')
      row.className = 'cart-item'
      const meta = document.createElement('div')
      meta.className = 'meta'
      meta.innerHTML = `<div class="cart-name">${p? p.nome : 'Produto removido'}</div><div class="cart-qty">Qty: ${i.quantidade}</div>`
      const actions = document.createElement('div')
      const btnRem = document.createElement('button')
      btnRem.textContent = 'Remover'
      btnRem.onclick = ()=>{cart = cart.filter(x=>x.produto_id!==i.produto_id);saveCart();renderCart()}
      actions.appendChild(btnRem)
      row.appendChild(meta);row.appendChild(actions)
      container.appendChild(row)
    })
    updateBadge()
    renderTotals()
  }

  function renderTotals(){
    const totals = el('cartTotals')
    const itens = cart.map(i=>({produto_id:i.produto_id,quantidade:i.quantidade}))
    let subtotal = 0
    itens.forEach(it=>{const p = produtos.find(x=>x.id==it.produto_id); if(p) subtotal += Number(p.preco)*it.quantidade})
    totals.innerHTML = `<div>Subtotal: R$ ${subtotal.toFixed(2)}</div>`
  }

  async function confirmOrder(){
    if(cart.length===0){toast('Carrinho vazio');return}
    const itens = cart.map(i=>({produto_id:i.produto_id,quantidade:i.quantidade}))
    const cupom = el('coupon').value.trim()
    try{
      const res = await fetch(`${API}/carrinho/confirmar`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({itens,cupom})})
      if(!res.ok){const err=await res.json();toast(err.detail||'Erro');return}
      const data = await res.json();toast('Pedido confirmado R$ '+parseFloat(data.total_final).toFixed(2))
      cart=[];saveCart();el('cartDrawer').setAttribute('aria-hidden','true')
      fetchProdutos()
    }catch(e){console.error(e);toast('Erro ao confirmar pedido')}
  }

  // Exports
  function exportCsv(){
    const rows = produtos.map(p=>[p.id,`"${p.nome.replace(/"/g,'""')}"`,p.categoria,p.preco,p.estoque].join(','))
    const csv = 'id,nome,categoria,preco,estoque\n'+rows.join('\n')
    const a = document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='produtos.csv';a.click()
  }
  function exportJson(){
    const a = document.createElement('a');a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(produtos,null,2));a.download='produtos.json';a.click()
  }

  // safe event attach helper
  function on(id, type, handler){
    const node = el(id)
    if(node) node.addEventListener(type, handler)
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    on('search','input', ()=>{fetchProdutos()})
    on('sort','change', e=>{sortState=e.target.value;localStorage.setItem('sortState',sortState);fetchProdutos()})
    on('newProductBtn','click', ()=>openModal(false))
    const pc = el('pCategoria')
    if(pc) pc.addEventListener('change', ()=>{})
    on('productForm','submit', saveProduct)
    on('cancelProduct','click', ()=>{ const d = el('productModal'); if(d && d.close) d.close() })
    on('closeModal','click', ()=>{ const d = el('productModal'); if(d && d.close) d.close() })
    on('exportCsv','click', exportCsv)
    on('exportJson','click', exportJson)
    on('cartBtn','click', ()=>{ const cd = el('cartDrawer'); if(cd) {cd.setAttribute('aria-hidden','false'); renderCart()} })
    on('closeCart','click', ()=>{ const cd = el('cartDrawer'); if(cd) cd.setAttribute('aria-hidden','true') })
    on('confirmOrder','click', confirmOrder)

    // close cart on Escape
    document.addEventListener('keydown', (e)=>{
      const cd = el('cartDrawer')
      if(e.key==='Escape' && cd && cd.getAttribute('aria-hidden')==='false') cd.setAttribute('aria-hidden','true')
      // Alt+N opens modal
      if(e.altKey && e.key.toLowerCase()==='n'){ openModal(false); e.preventDefault() }
    })

    renderCart()
    updateBadge()
    fetchProdutos()
  })
