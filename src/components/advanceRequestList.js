import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import styles from './advanceRequest.module.css';
import fileDownload from 'js-file-download';

const AdvanceRequestList = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    axios.get('/api/advanceRequest', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setSolicitudes(res.data))
    .catch(err => console.error(err));
  }, [token]);

  const descargarPDF = async (id) => {
    try {
      const response = await axios.get(`api/advanceRequest/documento/${id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fileDownload(response.data, `anticipo_${id}.pdf`);
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };

  return (
    <div className={styles.table}>
      <h2>Solicitudes de Anticipo</h2>
      <table>
        <thead>
          <tr>
            <th>Consecutivo</th>
            <th>Empresa</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(s => (
            <tr key={s.id}>
              <td>{s.consecutive}</td>
              <td>{s.company?.businessName}</td>
              <td>{s.concept}</td>
              <td>${s.totalAdvance.toLocaleString()}</td>
              <td>{s.responsible}</td>
              <td>{s.statusId === 1 ? 'Pendiente' : 'Aprobada'}</td>
              <td>
                <button onClick={() => descargarPDF(s.id)}>
                  Descargar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvanceRequestList;