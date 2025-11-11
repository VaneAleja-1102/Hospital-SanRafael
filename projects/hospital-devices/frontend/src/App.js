import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import EquipmentForm from './components/EquipmentForm';
import TransactionForm from './components/TransactionForm';
import TransactionsHistory from './pages/TransactionsHistory';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function check() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:4000/auth/me', {
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
        <header className="app-header">
          <h1>🏥 Control de Equipos - PDS006</h1>
          <nav className="app-nav">
            <Link to="/">📋 Equipos</Link>
            {user ? (
              <>
                <Link to="/create">➕ Registrar Equipo</Link>
                <Link to="/transaction">📝 Registrar Ingreso/Egreso</Link>
                <Link to="/transactions-history">📜 Ver Movimientos</Link>

                <div className="user-info">
                  <span>👤 Hola, {user.name}</span>
                  <button
                    className="logout-btn"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login">🔐 Iniciar sesión</Link>
            )}
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={u => setUser(u)} />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><EquipmentForm /></ProtectedRoute>} />
            <Route path="/transaction" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
            <Route path="/transactions-history" element={<ProtectedRoute><TransactionsHistory /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
  