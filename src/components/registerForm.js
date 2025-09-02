import { useState, useContext } from 'react';
import axios from '../api/axios';
import { UserContext } from '../context/userContext';
import styles from './registerForm.module.css';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const { login } = useContext(UserContext);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('/register', {
        email,
        password,
        nombre,
      });

      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
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
          <h2>Registro</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
              className={styles.input}
              required
            />
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
              Registrarse
            </button>
          </form>
          <div className={styles.link}>
            ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
          </div>
          {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}