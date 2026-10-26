import { NavLink, Outlet } from 'react-router-dom'

// Общая шапка сайта.
export default function Layout({ user, onLogout }) {
  const cls = ({ isActive }) => 'nl' + (isActive ? ' on' : '')
  return (
    <>
      <header>
        <div className="bar">
          <span className="logo">Мониторинг цен</span>
          <nav>
            <NavLink to="/orders" className={cls}>Мои отслеживания</NavLink>
            <NavLink to="/add" className={cls}>Добавить товар</NavLink>
          </nav>
          <span className="who">{user}</span>
          <button className="btn" onClick={onLogout}>Выйти</button>
        </div>
      </header>
      <Outlet />
    </>
  )
}
