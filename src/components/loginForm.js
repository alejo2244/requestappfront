import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import styles from './loginForm.module.css';
import { UserContext } from '../context/userContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const res = await axios.post('/login', {
      email,
      password,
    });

    const { token, username } = res.data;

    login(token, username);  // Guarda token y nombre en contexto + localStorage
    navigate('/');           // Redirige al dashboard
  } catch (err) {
    setError(err.response?.data?.message || 'Error al iniciar sesión');
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.icon}>_</div>
          RequestApp
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.card}>
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className={styles.input}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Ingresar
            </button>
          </form>
          <div className={styles.link}>
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </div>
          {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}