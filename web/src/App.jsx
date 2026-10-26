import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser, logout } from './api'
import Layout from './components/Layout'
import Login from './pages/Login'
import Orders from './pages/Orders'
import AddProduct from './pages/AddProduct'
import Product from './pages/Product'

export default function App() {
  const [user, setUser] = useState(getUser())

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/orders" replace /> : <Login onLogin={setUser} />} />
        {/* Все страницы внутри этого маршрута доступны только после входа */}
        <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/product/:id" element={<Product />} />
        </Route>
        <Route path="*" element={<Navigate to="/orders" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
