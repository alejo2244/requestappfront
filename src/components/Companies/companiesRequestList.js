import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import styles from "./companiesRequest.module.css";
import logoImagen from "../../assets/images/logo.png";

const CompaniesRequestList = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newCompany, setNewCompany] = useState({
    taxId: "",
    businessName: "",
    location: "",
    email: "",
    address: "",
    logoUrl: "",
    phone: "",
    sendConfirmation: false,
  });

  useEffect(() => {
    axios
      .get("/api/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const openPopup = (company) => {
    setSelectedCompany(company);
    setIsEditing(false);
  };

  const closePopup = () => {
    setSelectedCompany(null);
  };

  const createCompany = async () => {
    try {
      const res = await axios.post("/api/companies", newCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies([...companies, res.data]);
      setIsAdding(false);
      setNewCompany({
        taxId: "",
        businessName: "",
        location: "",
        email: "",
        address: "",
        logoUrl: "",
        phone: "",
        sendConfirmation: false,
      });
    } catch (error) {
      console.error("Error al crear la compañia:", error);
    }
  };

  const updateCompany = async () => {
    try {
      const res = await axios.put(
        `/api/companies/${selectedCompany.id}`,
        selectedCompany,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // actualizar listado
      setCompanies(companies.map((c) => (c.id === res.data.id ? res.data : c)));
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la compañia:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar la compañia:", error);
    }
  };

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <h2>Empresas</h2>
        <button
          className={styles.buttonPrimary}
          onClick={() => setIsAdding(true)}
        >
          Agregar
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nit</th>
            <th>Razón social</th>
            <th>Consecutivo</th>
            <th>Direcciòn</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {companies.map((s) => (
            <tr key={s.id}>
              <td>{s.taxId}</td>
              <td>{s.businessName}</td>
              <td>{s.consecutiveId}</td>
              <td>{s.address}</td>
              <td>
                <button
                  className={styles.buttonSecondary}
                  onClick={() => openPopup(s)}
                >
                  Detalle
                </button>
              </td>
              <td>
                <button
                  className={styles.buttonPrimary}
                  onClick={() => deleteCompany(s.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Agregar */}
      {isAdding && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Nueva Empresa</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formLeft}>
                <label>
                  NIT
                  <input
                    type="text"
                    value={newCompany.taxId}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, taxId: e.target.value })
                    }
                  />
                </label>

                <label>
                  Razón Social
                  <input
                    type="text"
                    value={newCompany.businessName}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        businessName: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Ubicación
                  <select
                    value={newCompany.location}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, location: e.target.value })
                    }
                  >
                    <option value="">Seleccione...</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                  </select>
                </label>

                <label>
                  Email*
                  <input
                    type="email"
                    placeholder="email@address.com"
                    value={newCompany.email}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, email: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Dirección
                  <input
                    type="text"
                    placeholder="AV 123 #34 - 45"
                    value={newCompany.address}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, address: e.target.value })
                    }
                  />
                </label>

                <label>
                  Telefono
                  <input
                    type="number"
                    placeholder="0000000000"
                    value={newCompany.phone}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, phone: e.target.value })
                    }
                  />
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={newCompany.sendConfirmation}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        sendConfirmation: e.target.checked,
                      })
                    }
                  />
                  Send email confirmation
                </label>
              </div>

              <div className={styles.formRight}>
                <div className={styles.logoPreview}>
                  <img src={logoImagen} alt="Logo" />
                </div>
                <input
                  type="text"
                  placeholder="URL del logo"
                  value={newCompany.logoUrl}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, logoUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => setIsAdding(false)}
                className={styles.buttonSecondary}
              >
                Cancelar
              </button>
              <button onClick={createCompany} className={styles.buttonPrimary}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modificar */}

      {selectedCompany && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Detalle de la Empresa</h3>

            {isEditing ? (
              <>
                <input
                  type="text"
                  value={selectedCompany.businessName}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      businessName: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={selectedCompany.location}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      location: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={selectedCompany.email}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      email: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={selectedCompany.phone}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      phone: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={selectedCompany.address}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      address: e.target.value,
                    })
                  }
                />
                {/* puedes agregar más campos */}
              </>
            ) : (
              <ul>
                <li>
                  <b>Nit:</b> {selectedCompany.taxId}
                </li>
                <li>
                  <b>Razón social:</b> {selectedCompany.businessName}
                </li>
                <li>
                  <b>Dirección:</b> {selectedCompany.address}
                </li>
                <li>
                  <b>Email:</b> {selectedCompany.email}
                </li>
                <li>
                  <b>Telefono:</b> {selectedCompany.phone}
                </li>
                <li>
                  <b>Ubicación:</b> {selectedCompany.location}
                </li>
                <li>
                  <b>Consecutivo:</b> {selectedCompany.consecutiveId}
                </li>
                <li>
                  <b>Confirmación:</b>{" "}
                  {selectedCompany.sendConfirmation ? "Sí" : "No"}
                </li>
              </ul>
            )}

            <div className={styles.modalActions}>
              <button onClick={closePopup} className={styles.buttonSecondary}>
                Cerrar
              </button>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.buttonPrimary}
                >
                  Modificar
                </button>
              )}
              {isEditing && (
                <button
                  onClick={updateCompany}
                  className={styles.buttonGeneral}
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesRequestList;
