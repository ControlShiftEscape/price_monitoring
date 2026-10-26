import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrders, toggleOrder, deleteOrder, currentPrice, SCHEDULES, STATUSES } from '../api'

const rub = (n) => n.toLocaleString('ru-RU') + ' ₽'

export default function Orders() {
  const [orders, setOrders] = useState(null) // null = ещё грузится
  const [confirmId, setConfirmId] = useState(null) // id заказа, который собираются удалить
  const navigate = useNavigate()

  const load = () => getOrders().then(setOrders)
  useEffect(() => { load() }, [])

  const handleToggle = async (id) => { await toggleOrder(id); load() }
  const handleDelete = async (id) => { await deleteOrder(id); setConfirmId(null); load() }

  if (orders === null) return <main><p className="sub">Загрузка…</p></main>

  return (
    <main>
      <div className="row">
        <div style={{ marginRight: 'auto' }}>
          <h1>Мои отслеживания</h1>
          <p className="sub" style={{ margin: 0 }}>Отслеживаемых товаров: {orders.length}</p>
        </div>
        <button className="btn pri" onClick={() => navigate('/add')}>Добавить товар</button>
      </div>

      <div className="card scroll" style={{ padding: 8 }}>
        {orders.length === 0 ? (
          <div className="empty">
            Вы пока ничего не отслеживаете.<br /><br />
            <button className="btn pri" onClick={() => navigate('/add')}>Добавить первый товар</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Товар</th><th>Маркетплейс</th>
                <th className="num">Сейчас</th><th className="num">Желаемая</th>
                <th>Статус</th><th>Проверка</th><th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><Link className="lk" to={`/product/${o.product.id}`}>{o.product.title}</Link></td>
                  <td>{o.product.marketplace}</td>
                  <td className="num">{rub(currentPrice(o.product))}</td>
                  <td className="num">{rub(o.target)}</td>
                  <td><span className={'b ' + o.status}>{STATUSES[o.status]}</span></td>
                  <td>{SCHEDULES[o.schedule]}</td>
                  <td>
                    <div className="acts">
                      <button className="btn" onClick={() => handleToggle(o.id)}>
                        {o.status === 'active' ? 'Пауза' : 'Возобновить'}
                      </button>
                      {confirmId === o.id ? (
                        <>
                          <button className="btn dng" onClick={() => handleDelete(o.id)}>Да, удалить</button>
                          <button className="btn" onClick={() => setConfirmId(null)}>Отмена</button>
                        </>
                      ) : (
                        <button className="btn dng" onClick={() => setConfirmId(o.id)}>Удалить</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
