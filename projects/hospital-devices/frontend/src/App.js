import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import EquipmentForm from './components/EquipmentForm';
import TransactionForm from './components/TransactionForm';
import TransactionsHistory from './pages/TransactionsHistory';
import RegisterTransaction from "./pages/RegisterTransaction";
import './App.css';

// 🔹 Header condicional (no aparece en /login ni /)
function Header({ user }) {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  return (
    <header className="app-header">
      <h1>🏥 Control de Equipos - PDS006</h1>
      <nav className="app-nav">
        <Link to="/">🏠 Inicio</Link>
        <Link to="/equipments">📋 Equipos</Link>
        <Link to="/create">➕ Registrar Equipo</Link>
        <Link to="/transaction">📦 Registrar Ingreso/Egreso</Link>
        <Link to="/transactions-history">📊 Ver Movimientos</Link>

        <div className="user-info">
          <span>👤 Hola, {user?.name}</span>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
}

function App() {
  const [user, setUser] = useState(null);

  // 🔹 Verificar token en localStorage
  useEffect(() => {
    async function check() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Invalid token');
        const u = await res.json();
        setUser(u);
      } catch (err) {
        console.log('Token invalid, logout', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    check();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header user={user} />

        <main className="app-content">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={u => setUser(u)} />} />
            <Route path="/" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
            <Route path="/equipments" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><EquipmentForm /></ProtectedRoute>} />
            <Route path="/transaction" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
            <Route path="/transactions-history" element={<ProtectedRoute><TransactionsHistory /></ProtectedRoute>} />
            <Route path="/registro" element={<ProtectedRoute><RegisterTransaction /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
