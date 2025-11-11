import React, { useState } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister 
        ? { email: formData.email, password: formData.password, name: formData.name }
        : { email: formData.email, password: formData.password };

      const res = await fetch(`http://localhost:4000/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // Verificar si la respuesta es JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor no está respondiendo correctamente. Verifica que el backend esté corriendo en http://localhost:4000');
      }

      const data = await res.json();

      if (!res.ok) {
        // Mensajes más específicos
        if (res.status === 401 && !isRegister) {
          throw new Error('Usuario no encontrado. Por favor regístrate primero.');
        }
        throw new Error(data.error || 'Error en la autenticación');
      }

      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);

    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        setError('No se puede conectar al servidor. Verifica que el backend esté corriendo.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.formGroup}>
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="tu@email.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar sesión')}
          </button>
        </form>

        <div style={styles.divider}>
          <span>O</span>
        </div>

        <GoogleLoginButton onLoginSuccess={onLogin} />

        <div style={styles.toggle}>
          {isRegister ? (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button 
                onClick={() => setIsRegister(false)} 
                style={styles.linkButton}
              >
                Inicia sesión
              </button>
            </p>
          ) : (
            <p>
              ¿No tienes cuenta?{' '}
              <button 
                onClick={() => setIsRegister(true)} 
                style={styles.linkButton}
              >
                Regístrate
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%'
  },
  form: {
    marginTop: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginTop: '5px'
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    position: 'relative',
    color: '#666'
  },
  toggle: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#1a73e8',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px'
  }
};