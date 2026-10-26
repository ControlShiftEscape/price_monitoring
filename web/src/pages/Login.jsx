import { useState } from 'react'
import { authenticate } from '../api'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const switchTab = (reg) => { setIsRegister(reg); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await authenticate(login, password, isRegister)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <div className="auth card">
        <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
        <p className="sub">Следите за ценами на маркетплейсах и получайте уведомления о снижении.</p>
        <div className="tabs">
          <button type="button" className={'nl' + (!isRegister ? ' on' : '')} onClick={() => switchTab(false)}>Вход</button>
          <button type="button" className={'nl' + (isRegister ? ' on' : '')} onClick={() => switchTab(true)}>Регистрация</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="f">
            <label htmlFor="login">Логин</label>
            <input id="login" value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" />
          </div>
          <div className="f">
            <label htmlFor="password">Пароль</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'} />
            {isRegister && <div className="hint">Не короче 6 символов</div>}
          </div>
          <p className="err" role="alert">{error}</p>
          <button className="btn pri" style={{ width: '100%' }}>{isRegister ? 'Создать аккаунт' : 'Войти'}</button>
        </form>
      </div>
    </main>
  )
}
