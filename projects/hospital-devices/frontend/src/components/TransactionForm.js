import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";
import "./TransactionForm.css";

export default function TransactionForm() {
  const [equipments, setEquipments] = useState([]);
  const [pendingEntries, setPendingEntries] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    equipmentId: "",
    type: "Ingreso",
    registeredBy: "",
    description: "",
    isWorking: true,
    entryTransactionId: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // =======================
  // Cargar equipos
  // =======================
  useEffect(() => {
    loadEquipments();
    loadUsers(); // <-- CARGAR USUARIOS
  }, []);

  // =======================
  // Cargar usuarios
  // =======================
  const loadUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err);
    }
  };

  // =======================
  // Cargar equipos
  // =======================
  const loadEquipments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token encontrado. Inicia sesión nuevamente.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/equipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();
      setEquipments(data.equipments || []);
    } catch (err) {
      console.error("❌ Error cargando equipos:", err);
      setError("Error al cargar la lista de equipos");
    }
  };

  // =======================
  // Cargar ingresos pendientes
  // =======================
  useEffect(() => {
    if (form.type === "Egreso" && form.equipmentId) {
      loadPendingEntries(form.equipmentId);
    } else {
      setPendingEntries([]);
    }
  }, [form.type, form.equipmentId]);

  const loadPendingEntries = async (equipmentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/transactions/pending-entries?equipmentId=${equipmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setPendingEntries(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // =======================
  // Manejar selección de equipo
  // =======================
  const handleEquipmentSelect = (eq) => {
    setForm({ ...form, equipmentId: eq.id, entryTransactionId: "" });
    setSelectedEquipment(eq);
    if (form.type === "Egreso") loadPendingEntries(eq.id);
  };

  // =======================
  // Manejar foto
  // =======================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // =======================
  // Enviar formulario
  // =======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    if (selectedEquipment?.isBiomedical && !photoFile && !photoPreview) {
      setError("Este equipo biomédico requiere una foto");
      setLoading(false);
      return;
    }

    if (form.type === "Egreso" && !form.entryTransactionId) {
      setError("Debe seleccionar el registro de ingreso correspondiente");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        equipmentId: Number(form.equipmentId),
        type: form.type,
        registeredBy: Number(form.registeredBy), // <-- AHORA ES NUMÉRICO
        description: form.description,
        isWorking: form.isWorking,
        photoUrl: photoPreview || null,
        entryTransactionId:
          form.type === "Egreso" ? Number(form.entryTransactionId) : null,
      };

      const res = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(`✅ ${form.type} registrado exitosamente`);
        navigate("/transactions-history");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "No se pudo registrar la transacción");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>📝 Registrar Ingreso / Salida</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Tipo */}
        <div className="form-group">
          <label>Tipo de Movimiento</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
                entryTransactionId: "",
                equipmentId: "",
              })
            }
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
        </div>

        {/* Equipos */}
        <div className="form-group">
          <label>Selecciona el equipo</label>
          <div className="equipment-grid">
            {equipments.map((eq) => (
              <div
                key={eq.id}
                className={`equipment-card ${
                  form.equipmentId === eq.id ? "selected" : ""
                }`}
                onClick={() => handleEquipmentSelect(eq)}
              >
                <img
                  src={
                    eq.imageUrl
                      ? `${API_BASE.replace("/api", "")}${eq.imageUrl}`
                      : "https://via.placeholder.com/120?text=Sin+imagen"
                  }
                  alt={eq.type}
                  className="equipment-image"
                />
                <p className="equipment-name">
                  {eq.type} - {eq.brand || ""} {eq.model || ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingresos pendientes */}
        {form.type === "Egreso" && form.equipmentId && (
          <div className="form-group">
            <label>Seleccionar Ingreso</label>
            <select
              value={form.entryTransactionId}
              onChange={(e) =>
                setForm({ ...form, entryTransactionId: e.target.value })
              }
              required
            >
              <option value="">-- Seleccionar ingreso --</option>
              {pendingEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  Ingreso #{entry.id} -{" "}
                  {new Date(entry.createdAt).toLocaleString()}{" "}
                  {entry.registeredBy ? `por ${entry.registeredBy}` : ""}
                </option>
              ))}
            </select>
            {pendingEntries.length === 0 && (
              <small>No hay ingresos pendientes</small>
            )}
          </div>
        )}

        {/* Selector de Usuarios */}
        <div className="form-group">
          <label>Registrado por</label>
          <select
            value={form.registeredBy}
            onChange={(e) =>
              setForm({ ...form, registeredBy: Number(e.target.value) })
            }
            required
          >
            <option value="">-- Seleccionar usuario --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
            rows="4"
          ></textarea>
        </div>

        {/* ¿Funciona? */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={form.isWorking}
              onChange={(e) =>
                setForm({ ...form, isWorking: e.target.checked })
              }
            />
            El equipo funciona correctamente
          </label>
        </div>

        {/* Foto */}
        {selectedEquipment?.isBiomedical && (
          <div className="form-group">
            <label>Foto del equipo (requerida)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                style={{ maxWidth: "200px", marginTop: 10 }}
              />
            )}
          </div>
        )}

        {/* Botón */}
        <button type="submit" disabled={loading}>
          {loading ? "⏳ Registrando..." : `✓ Registrar ${form.type}`}
        </button>
      </form>
    </div>
  );
}
