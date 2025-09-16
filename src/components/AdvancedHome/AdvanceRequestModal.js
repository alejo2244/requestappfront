import { useState, useEffect } from "react";
import axios from "../../api/axios";
import styles from "./advanceRequestModal.module.css";

const vatOptions = ["No Aplica", "19%", "5%"];

const AdvanceRequestModal = ({ onClose, onSaved, token, user }) => {
  const [companies, setCompanies] = useState([]);
  const [companyLogo, setCompanyLogo] = useState("");

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const [newSolicitud, setNewSolicitud] = useState({
    companyId: "",
    statusId: 1,
    consecutive: "",
    requestDate: new Date().toISOString(),
    supplierTaxId: "",
    supplierName: "",
    supplierAddress: "",
    supplierPhone: "",
    costCenter: "",
    concept: "",
    baseAmount: 0,
    vatRate: "No Aplica",
    vatTotal: 0,
    approvedPercentage: 0,
    totalAdvance: 0,
    amountToTransfer: 0,
    notes: "",
    responsible: "",
    preparedBy: "",
    approvedBy: "",
    documentUrl: "",
    userId: user?.userId || "",
  });

  // Cargar empresas
  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/companies", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Error cargando empresas:", err));
  }, [token]);

  // Autocompleta campos al seleccionar empresa
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    const company = companies.find((c) => String(c.id) === String(companyId));
    if (!company) {
      setNewSolicitud((prev) => ({ ...prev, companyId: "", supplierTaxId: "", supplierName: "", supplierAddress: "", supplierPhone: "" }));
      setCompanyLogo("");
      return;
    }

    setCompanyLogo(company.logoUrl || "");
    setNewSolicitud((prev) => ({
      ...prev,
      companyId: company.id || "",
      supplierTaxId: company.taxId || "",
      supplierName: company.businessName || "",
      supplierAddress: company.address || "",
      supplierPhone: company.phone || "",
    }));
  };

  // Manejo inputs generales
  const handleChange = (e) => {
    const { name, value } = e.target;
    // For numeric fields we convert to Number where appropriate
    if (["baseAmount", "approvedPercentage"].includes(name)) {
      const num = value === "" ? "" : Number(value);
      setNewSolicitud((prev) => ({ ...prev, [name]: isNaN(num) ? 0 : num }));
    } else {
      setNewSolicitud((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejo archivo PDF
  const handleFileChange = (e) => {
    setFileError("");
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setFileError("Solo se permiten archivos PDF.");
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFileError("El archivo debe ser menor o igual a 5MB.");
      setFile(null);
      return;
    }
    setFile(f);
  };

  // Calculos automáticos: vatTotal, totalAdvance, amountToTransfer
  useEffect(() => {
    const base = Number(newSolicitud.baseAmount) || 0;
    const apr = Number(newSolicitud.approvedPercentage) || 0;
    const vatRate = (() => {
      if (newSolicitud.vatRate === "No Aplica") return 0;
      return Number(newSolicitud.vatRate.replace("%", ""));
    })();

    const vatTotal = +(base * (vatRate / 100));
    const total = base + vatTotal;
    const totalAdvance = +(total * (apr / 100));
    const amountToTransfer = totalAdvance; // aquí asumimos que a girar == totalAdvance

    setNewSolicitud((prev) => ({
      ...prev,
      vatTotal,
      totalAdvance,
      amountToTransfer,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newSolicitud.baseAmount, newSolicitud.vatRate, newSolicitud.approvedPercentage]);

  // Subir archivo (si tu backend tiene endpoint /api/advanceRequest/upload)
  const uploadFile = async (fileToUpload) => {
    if (!fileToUpload) return null;
    try {
      const form = new FormData();
      form.append("file", fileToUpload);

      const res = await axios.post("/api/advanceRequest/upload", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // espera { url: "https://..." }
      return res.data?.url || null;
    } catch (err) {
      console.error("Error subiendo archivo:", err);
      return null;
    }
  };

  const validate = () => {
    if (!newSolicitud.companyId) { alert("Seleccione una empresa."); return false; }
    if (!newSolicitud.supplierTaxId) { alert("NIT proveedor requerido."); return false; }
    if (!newSolicitud.concept) { alert("Concepto requerido."); return false; }
    if (!newSolicitud.baseAmount || Number(newSolicitud.baseAmount) <= 0) { alert("Base debe ser mayor a 0."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!validate()) return;

    try {
      let documentUrl = newSolicitud.documentUrl || "";
      if (file) {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          documentUrl = uploadedUrl;
        } else {
          // si falla el upload, continúa pero avisa
          console.warn("No se pudo subir el archivo, la solicitud se enviará sin documentUrl.");
        }
      }

      const payload = {
        ...newSolicitud,
        documentUrl,
        userId: user?.id || newSolicitud.userId,
      };

      const res = await axios.post("/api/advanceRequest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onSaved && onSaved(res.data);
      onClose && onClose();
    } catch (err) {
      console.error("Error creando solicitud:", err);
      alert("Error al enviar la solicitud. Revisa la consola.");
    }
  };

  const formatCurrency = (v) => {
    if (v === null || v === undefined || isNaN(v)) return "";
    return `$ ${Number(v).toLocaleString()}`;
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.logoBox}>
              {companyLogo ? (
                <img src={companyLogo} alt="logo" />
              ) : (
                <div className={styles.placeholder}>LOGO</div>
              )}
            </div>
            <div className={styles.companyMeta}>
              <div className={styles.companyName}>
                {newSolicitud.supplierName || "Nombre Empresa"}
              </div>
              <div className={styles.consecutiveSmall}>
                {newSolicitud.consecutive || "Consecutivo"}
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <label>Fecha</label>
            <input
              type="date"
              name="requestDate"
              value={newSolicitud.requestDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Datos Proveedor */}
          <section className={styles.section}>
            <h4>Datos Proveedor</h4>
            <div className={styles.row}>
              <div className={styles.col3}>
                <label>Empresa</label>
                <select name="companyId" value={newSolicitud.companyId} onChange={handleCompanyChange} required>
                  <option value="">-- Seleccione empresa --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.businessName}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.col3}>
                <label>NIT</label>
                <input type="text" name="supplierTaxId" value={newSolicitud.supplierTaxId} readOnly />
              </div>

              <div className={styles.col3}>
                <label>Teléfono / Celular</label>
                <input type="text" name="supplierPhone" value={newSolicitud.supplierPhone} readOnly />
              </div>

              <div className={styles.col3}>
                <label>Dirección</label>
                <input type="text" name="supplierAddress" value={newSolicitud.supplierAddress} readOnly />
              </div>
            </div>
          </section>

          {/* Información Anticipo */}
          <section className={styles.section}>
            <h4>Información del Anticipo</h4>

            <div className={styles.row}>
              <div className={styles.col6}>
                <label>Centro de Costo</label>
                <input type="text" name="costCenter" value={newSolicitud.costCenter} onChange={handleChange} placeholder="Proyecto" />
              </div>

              <div className={styles.col6}>
                <label>Concepto</label>
                <input type="text" name="concept" value={newSolicitud.concept} onChange={handleChange} placeholder="Ej: Anticipo Materiales" />
              </div>

              <div className={styles.col3}>
                <label>Base</label>
                <input type="number" name="baseAmount" value={newSolicitud.baseAmount} onChange={handleChange} />
              </div>

              <div className={styles.col3}>
                <label>Tarifa IVA</label>
                <select name="vatRate" value={newSolicitud.vatRate} onChange={handleChange}>
                  {vatOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className={styles.col3}>
                <label>Valor IVA</label>
                <input type="text" value={formatCurrency(newSolicitud.vatTotal)} readOnly />
              </div>

              <div className={styles.col3}>
                <label>Total</label>
                <input type="text" value={formatCurrency((Number(newSolicitud.baseAmount)||0) + (Number(newSolicitud.vatTotal)||0))} readOnly />
              </div>

              <div className={styles.col3}>
                <label>% Anticipo Aprobado</label>
                <input type="number" name="approvedPercentage" value={newSolicitud.approvedPercentage} onChange={handleChange} min="0" max="100" />
              </div>

              <div className={styles.col3}>
                <label>Total Anticipo</label>
                <input type="text" value={formatCurrency(newSolicitud.totalAdvance)} readOnly />
              </div>

              <div className={styles.col3}>
                <label>A Girar</label>
                <input type="text" value={formatCurrency(newSolicitud.amountToTransfer)} readOnly />
              </div>
            </div>
          </section>

          {/* Observaciones */}
          <section className={styles.section}>
            <h4>Observaciones</h4>
            <textarea name="notes" value={newSolicitud.notes} onChange={handleChange} placeholder="Ej: Anticipo 80% compra materiales" />
          </section>

          {/* Responsables */}
          <section className={styles.section}>
            <div className={styles.row}>
              <div className={styles.col4}>
                <label>Responsable</label>
                <input type="text" name="responsible" value={newSolicitud.responsible} onChange={handleChange} />
              </div>
              <div className={styles.col4}>
                <label>Elaboró</label>
                <input type="text" name="preparedBy" value={newSolicitud.preparedBy} onChange={handleChange} />
              </div>
              <div className={styles.col4}>
                <label>Aprobó</label>
                <input type="text" name="approvedBy" value={newSolicitud.approvedBy} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* Upload */}
          <section className={styles.section}>
            <h4>Subir Documento Soporte</h4>
            <div className={styles.fileRow}>
              <input type="file" accept="application/pdf" onChange={handleFileChange} />
              {file && <div className={styles.fileInfo}>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</div>}
              {fileError && <div className={styles.fileError}>{fileError}</div>}
              <small>Formato PDF. Con un tamaño hasta 5MB</small>
            </div>
          </section>

          <div className={styles.actions}>
            <button type="button" className={styles.buttonSecondary} onClick={onClose}>Cancelar Solicitud</button>
            <button type="submit" className={styles.buttonPrimary}>Enviar a Aprobación</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvanceRequestModal;
