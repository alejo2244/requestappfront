// src/components/Header.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import { UserContext } from '../context/userContext';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const username = user?.username;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.rightAligned}>
        <div className={styles.username}>Bienvenido, <strong>{username || 'Usuario'}</strong></div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;