import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addOrder, MARKETPLACES, SCHEDULES } from '../api'

export default function AddProduct() {
  const [url, setUrl] = useState('')
  const [schedule, setSchedule] = useState('60')
  const [target, setTarget] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await addOrder({ url: url.trim(), schedule, target: Number(target) })
      navigate('/orders')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <h1>Добавить товар</h1>
      <p className="sub">Вставьте ссылку на товар.</p>
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="f">
            <label htmlFor="url">Ссылка на товар</label>
            <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.ozon.ru/product/…" />
            <div className="hint">Поддерживаются: {MARKETPLACES.map((m) => m[1]).join(', ')}</div>
          </div>
          <div className="f">
            <label htmlFor="schedule">Как часто проверять цену</label>
            <select id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
              {Object.entries(SCHEDULES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="f">
            <label htmlFor="target">Желаемая цена, ₽</label>
            <input id="target" type="number" min="1" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} />
            <div className="hint">Уведомим, когда цена опустится до этой отметки или ниже</div>
          </div>
          <p className="err" role="alert">{error}</p>
          <button className="btn pri">Начать отслеживание</button>
        </form>
      </div>
    </main>
  )
}
