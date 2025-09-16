import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";
import {
  FaHome,
  FaSearch,
  FaFileAlt,
  FaCalendarAlt,
  FaCog,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <>
      <button className={styles.toggleButton} onClick={toggle}>
        {isOpen ? "✖" : "☰"}
      </button>

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      >
        <nav>
          <ul>
            <li>
              <Link to="/">
                <FaHome className={styles.icon} />
                {isOpen && <span>Inicio</span>}
              </Link>
            </li>
            <li>
                <Link to="/">
              <FaUser className={styles.icon} />
              {isOpen && <span>Perfiles</span>}
              </Link>
            </li>
            <li>
              <Link to="/companies">
              <FaBuilding className={styles.icon} />
              {isOpen && <span>Empresas</span>}</Link>
            </li>
            <li>
              <FaSearch className={styles.icon} />
              {isOpen && <span>Buscar</span>}
            </li>
            <li>
              <FaFileAlt className={styles.icon} />
              {isOpen && <span>Documentos</span>}
            </li>
            <li>
              <FaCalendarAlt className={styles.icon} />
              {isOpen && <span>Calendario</span>}
            </li>
            <li>
              <FaCog className={styles.icon} />
              {isOpen && <span>Configuración</span>}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
