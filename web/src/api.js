// Сейчас это заглушки.
// Когда бэкенд (FastAPI) будет готов, заменим тела функций на fetch к API_URL.

export const MARKETPLACES = [
  ['wildberries.ru', 'Wildberries'],
  ['ozon.ru', 'Ozon'],
  ['market.yandex.ru', 'Яндекс Маркет'],
]
export const SCHEDULES = { 60: 'Каждый час', 360: 'Раз в 6 часов', 1440: 'Раз в день' }
export const STATUSES = { active: 'Активен', paused: 'На паузе', error: 'Ошибка' }

export const currentPrice = (p) => p.history[p.history.length - 1].price

// Генериратор истории цен(заглушка)
function makeHistory(base, seed) {
  const out = []
  let price = base * 1.15
  let s = seed
  for (let i = 29; i >= 0; i--) {
    s = (s * 9301 + 49297) % 233280
    price = Math.max(base * 0.7, price * (1 + (s / 233280 - 0.55) * 0.06))
    out.push({
      date: new Date(Date.now() - i * 864e5).toISOString().slice(0, 10),
      price: Math.round(price),
    })
  }
  return out
}

const db = {
  nextId: 4,
  products: {
    1: { id: 1, title: 'Наушники Sony WH-1000XM5', url: 'https://www.wildberries.ru/catalog/100001/detail.aspx', marketplace: 'Wildberries', history: makeHistory(24500, 7) },
    2: { id: 2, title: 'Кофемашина DeLonghi Magnifica S', url: 'https://www.ozon.ru/product/200002/', marketplace: 'Ozon', history: makeHistory(31900, 21) },
    3: { id: 3, title: 'Смартфон Xiaomi Redmi Note 13', url: 'https://market.yandex.ru/product/300003', marketplace: 'Яндекс Маркет', history: makeHistory(16400, 5) },
  },
  orders: [
    { id: 1, productId: 1, status: 'active', schedule: 60, target: 21000 },
    { id: 2, productId: 2, status: 'paused', schedule: 1440, target: 27000 },
    { id: 3, productId: 3, status: 'error', schedule: 360, target: 14000 },
  ],
}

const later = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 150))

// ----- Авторизация -----
export function getUser() {
  try { return localStorage.getItem('user') } catch { return null }
}

export async function authenticate(login, password, isRegister) {
  if (!login.trim() || !password) throw new Error('Введите логин и пароль')
  if (isRegister && password.length < 6) throw new Error('Пароль должен быть не короче 6 символов')
  try { localStorage.setItem('user', login.trim()) } catch { }
  return later(login.trim())
}

export function logout() {
  try { localStorage.removeItem('user') } catch { }
}

// ----- Заказы (отслеживания) -----
export async function getOrders() {
  return later(db.orders.map((o) => ({ ...o, product: db.products[o.productId] })))
}

export async function addOrder({ url, schedule, target }) {
  let host
  try { host = new URL(url).hostname.replace(/^www\./, '') }
  catch { throw new Error('Вставьте полную ссылку, начиная с https://') }

  const mp = MARKETPLACES.find(([d]) => host === d || host.endsWith('.' + d))
  if (!mp) throw new Error('Этот маркетплейс пока не поддерживается. Доступны: ' + MARKETPLACES.map((m) => m[1]).join(', '))
  if (!(target > 0)) throw new Error('Укажите желаемую цену больше нуля')

  // Если такой товар уже есть в базе, новый не создаём
  let product = Object.values(db.products).find((p) => p.url === url)
  if (!product) {
    const id = db.nextId++
    product = db.products[id] = {
      id, url, marketplace: mp[1],
      title: 'Товар на ' + mp[1] + ' (название загрузится после первой проверки)',
      history: makeHistory(5000 + id * 3000, id * 13),
    }
  }
  db.orders.push({ id: db.nextId++, productId: product.id, status: 'active', schedule: Number(schedule), target: Number(target) })
  return later(true)
}

export async function toggleOrder(id) {
  const o = db.orders.find((x) => x.id === id)
  o.status = o.status === 'active' ? 'paused' : 'active'
  return later(true)
}

export async function deleteOrder(id) {
  db.orders = db.orders.filter((x) => x.id !== id)
  return later(true)
}

export async function getProduct(id) {
  const product = db.products[id]
  if (!product) throw new Error('Товар не найден')
  const order = db.orders.find((o) => o.productId === product.id)
  return later({ product, target: order ? order.target : null })
}
