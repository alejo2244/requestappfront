import { useContext, useEffect ,useState } from "react";
import styles from "./home.module.css";
import { Link } from "react-router-dom";
import Header from "../components/Header/header";
import { UserContext } from "../context/userContext";
import Sidebar from "../components/Sidebar/sidebar";
import AdvanceRequestList from "../components/AdvancedHome/advanceRequestList";
import axios from "../api/axios";

export default function Home() {
  const { user } = useContext(UserContext);

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
          <Link to="/login" className={styles.button}>
            Iniciar sesión
          </Link>
          <Link to="/register" className={styles.button}>
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const { user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const [porAprobar, setPorAprobar] = useState(0);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        if (user?.userId) {
          axios
            .get(`/api/advanceRequest/${user.userId}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              const data = res.data;

              setTotalSolicitudes(data.length);

              const pendientes = data.filter((s) => s.statusId === 1).length;
              setPorAprobar(pendientes);
            })
            .catch((err) => console.error("Error cargando solicitudes:", err));
        }
      } catch (err) {
        console.error("Error en try/catch:", err);
      }
    };

    if (user?.userId) fetchSolicitudes();
  }, [user]);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)} />
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      <main
        className={`${styles.mainContent} ${menuOpen ? styles.shifted : ""}`}
      >
        <Header />

        <section className={styles.cards}>
          <div className={styles.card}>
            <h3>Solicitudes Por Aprobar</h3>
            <p>{porAprobar}</p>
          </div>
          <div className={styles.card}>
            <h3>Total de Solicitudes</h3>
            <p>{totalSolicitudes}</p>
          </div>
        </section>

        <section className={styles.table}>
          <AdvanceRequestList />
        </section>
      </main>
    </div>
  );
}
