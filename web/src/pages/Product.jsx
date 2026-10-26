import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, currentPrice } from '../api'
import PriceChart from '../components/PriceChart'

const rub = (n) => n.toLocaleString('ru-RU') + ' ₽'

export default function Product() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getProduct(id).then(setData).catch((e) => setError(e.message))
  }, [id])

  if (error) return <main><p className="err">{error}</p><Link className="btn" to="/orders">Назад к списку</Link></main>
  if (!data) return <main><p className="sub">Загрузка…</p></main>

  const { product, target } = data
  const prices = product.history.map((h) => h.price)
  const now = currentPrice(product)
  const diff = now - prices[0]
  const percent = Math.round((diff / prices[0]) * 100)

  return (
    <main>
      <div className="row"><Link className="btn" to="/orders">Назад к списку</Link></div>
      <h1>{product.title}</h1>
      <p className="sub">
        {product.marketplace} ·{' '}
        <a href={product.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ac)' }}>Открыть товар на маркетплейсе</a>
      </p>

      <div className="stats">
        <div className="st"><small>Сейчас</small><b>{rub(now)}</b></div>
        <div className="st"><small>Минимум за 30 дней</small><b>{rub(Math.min(...prices))}</b></div>
        <div className="st"><small>Максимум за 30 дней</small><b>{rub(Math.max(...prices))}</b></div>
        <div className="st">
          <small>Изменение за 30 дней</small>
          <b style={{ color: diff <= 0 ? 'var(--ac)' : 'var(--bad)' }}>{diff > 0 ? '+' : ''}{percent}%</b>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 16, margin: '0 0 12px' }}>История цены</h2>
        <PriceChart history={product.history} target={target} />
      </div>
    </main>
  )
}
