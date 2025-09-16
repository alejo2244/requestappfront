import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import styles from "./home.module.css";
import Sidebar from "../components/Sidebar/sidebar";
import Header from "../components/Header/header";
import { Link } from "react-router-dom";
import CompaniesRequestList from "../components/Companies/companiesRequestList";

export default function Companies() {
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
  const [menuOpen, setMenuOpen] = useState(false);

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

        <section className={styles.table}>
          <CompaniesRequestList />
        </section>
      </main>
    </div>
  );
}
