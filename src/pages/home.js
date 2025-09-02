import { useContext } from 'react';
import styles from './home.module.css';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import { UserContext } from '../context/userContext';
import Sidebar from '../components/sidebar';
import { useState } from 'react';

export default function Home() {
  const { user  } = useContext(UserContext);

  return user?.token ? <DashboardView /> : <PublicHomeView />;
}

function PublicHomeView() {
  return (
    <div className={styles.container}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.icon}>_</div>
          RequestApp
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.card}>
          <h1>Bienvenido</h1>
          <p>Gestiona tus solicitudes de forma rápida y segura.</p>
          <Link to="/login" className={styles.button}>Iniciar sesión</Link>
          <Link to="/register" className={styles.button}>Registrarse</Link>
        </div>
      </div>
    </div>
  );
}

function DashboardView() { 
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)} />
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

      <main className={`${styles.mainContent} ${menuOpen ? styles.shifted : ''}`}>
        <Header />

        <section className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Solicitudes</h3>
            <p>21,324</p>
            <span className={styles.growth}>+20,324</span>
          </div>
          <div className={styles.card}>
            <h3>Solicitudes Completadas</h3>
            <p>20,324</p>
          </div>
          <div className={styles.card}>
            <h3>Usuarios Conectados</h3>
            <p>16,703</p>
          </div>
        </section>

        <section className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Empresa</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jerry Matfield</td>
                <td>19 May, 2021 10:00 AM</td>
                <td>Company 1</td>
                <td>New York</td>
                <td>Finalizado</td>
                <td><button>Detalles</button></td>
              </tr>
              <tr>
                <td>Ellianos Vesilov</td>
                <td>19 May, 2021 12:00 PM</td>
                <td>Company 1</td>
                <td>Ontario</td>
                <td>Pendiente</td>
                <td><button>Aprobar</button> <button>Detalles</button></td>
              </tr>
              <tr>
                <td>Diana Lee</td>
                <td>19 May, 2021 2:15 PM</td>
                <td>Company 2</td>
                <td>Chicago</td>
                <td>Finalizado</td>
                <td><button>Detalles</button></td>
              </tr>
              <tr>
                <td>Lissa Shipsey</td>
                <td>19 May, 2021 3:30 PM</td>
                <td>Company 2</td>
                <td>San Francisco</td>
                <td>Pendiente</td>
                <td><button>Detalles</button></td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}