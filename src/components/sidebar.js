import styles from './sidebar.module.css';
import { FaHome, FaSearch, FaFileAlt, FaCalendarAlt, FaCog, FaUser } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <>
      <button className={styles.toggleButton} onClick={toggle}>
        {isOpen ? '✖' : '☰'}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <nav>
          <ul>
            <li>
              <FaHome className={styles.icon}/>
              {isOpen && <span>Inicio</span>}
            </li>
            <li>
              <FaSearch className={styles.icon}/>
              {isOpen && <span>Buscar</span>}
            </li>
            <li>
              <FaFileAlt className={styles.icon}/>
              {isOpen && <span>Documentos</span>}
            </li>
            <li>
              <FaCalendarAlt className={styles.icon}/>
              {isOpen && <span>Calendario</span>}
            </li>
            <li>
              <FaCog className={styles.icon}/>
              {isOpen && <span>Configuración</span>}
            </li>
            <li>
              <FaUser className={styles.icon}/>
              {isOpen && <span>Perfil</span>}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;