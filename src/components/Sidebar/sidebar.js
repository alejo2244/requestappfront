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
                <FaFileAlt className={styles.icon} />
                {isOpen && <span>Inicio</span>}
              </Link>
            </li>
            <li>
              <Link to="/companies">
              <FaBuilding className={styles.icon} />
              {isOpen && <span>Empresas</span>}</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
