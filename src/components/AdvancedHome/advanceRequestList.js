import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import styles from "../AdvancedHome/advanceRequest.module.css";
import fileDownload from "js-file-download";
import AdvanceRequestModal from "./AdvanceRequestModal";

const AdvanceRequestList = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const [solicitudes, setSolicitudes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      axios
        .get(`/api/advanceRequest/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setSolicitudes(res.data))
        .catch((err) => console.error(err));
    }
  }, [token, user?.id]);

  const descargarPDF = async (id) => {
    try {
      const response = await axios.get(`api/advanceRequest/documento/${id}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fileDownload(response.data, `anticipo_${id}.pdf`);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };

  const aprobarSolicitud = async (id) => {
    try {
      const response = await axios.put(
        `/api/advanceRequest/status/${id}`,
        { statusId: 2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Solicitud aprobada:", response.data);
    } catch (error) {
      console.error("Error al aprobar la solicitud:", error);
    }
  };
console.log(solicitudes)
  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <h2>Solicitudes de Anticipo</h2>
        <button
          className={styles.buttonGeneral}
          onClick={() => setIsAdding(true)}
        >
          Solicitar
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Consecutivo</th>
            <th>Empresa</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id}>
              <td>{s.consecutive}</td>
              <td>{s.company?.businessName}</td>
              <td>{s.concept}</td>
              <td>${s.totalAdvance.toLocaleString()}</td>
              <td>{s.responsible}</td>
              <td>
                {s.statusId === 1
                  ? "Pendiente"
                  : s.statusId === 2
                  ? "Aprobada"
                  : "Finalizada"}
              </td>
              <td>
                {s.statusId === 1 && (user.rolId === 1 || user.rolId === 3) && (
                  <button
                    className={styles.buttonPrimary}
                    onClick={() => aprobarSolicitud(s.id)}
                  >
                    Aprobar
                  </button>
                )}

                {s.statusId === 2 && (
                  <button
                    className={styles.buttonPrimary}
                    onClick={() => descargarPDF(s.id)}
                  >
                    Descargar PDF
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdding && (
        <AdvanceRequestModal
          onClose={() => setIsAdding(false)}
          onSaved={(nuevaSolicitud) =>
            setSolicitudes((prev) => [...prev, nuevaSolicitud])
          }
          token={token}
          user={user}
        />
      )}
    </div>
  );
};

export default AdvanceRequestList;
