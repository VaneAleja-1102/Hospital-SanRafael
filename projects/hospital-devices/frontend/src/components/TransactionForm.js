// frontend/src/components/TransactionForm.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function TransactionForm() {
  const [equipments, setEquipments] = useState([]);
  const [pendingEntries, setPendingEntries] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [form, setForm] = useState({
    equipmentId: "",
    type: "Ingreso",
    registeredBy: "",
    description: "",
    isWorking: true,
    entryTransactionId: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadEquipments();
  }, []);

  useEffect(() => {
    if (form.type === "Egreso" && form.equipmentId) {
      loadPendingEntries(form.equipmentId);
    } else {
      setPendingEntries([]);
    }
  }, [form.type, form.equipmentId]);

  // 🔧 Carga de equipos con fallback
  const loadEquipments = async () => {
    const token = localStorage.getItem("token");
    try {
      let res = await fetch(`${API_BASE}/api/equipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si /equipments no existe, probar con /api/equipos
      if (res.status === 404) {
        console.warn("Ruta /equipments no encontrada. Probando /api/equipos...");
        res = await fetch(`${API_BASE}/api/equipos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const data = await res.json();
      const arr = Array.isArray(data)
        ? data
        : data.equipments || data.data || [];

      setEquipments(arr);
    } catch (err) {
      console.error("❌ Error cargando equipos:", err);
      setError("Error al cargar la lista de equipos");
    }
  };

  const loadPendingEntries = async (equipmentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/transactions/pending-entries?equipmentId=${equipmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.data || [];
      setPendingEntries(arr);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEquipmentChange = (equipmentId) => {
    const equipment = equipments.find((e) => e.id === Number(equipmentId));
    setSelectedEquipment(equipment || null);
    setForm({ ...form, equipmentId, entryTransactionId: "" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

    const token = localStorage.getItem("token");
    try {
      const payload = {
        equipmentId: Number(form.equipmentId),
        type: form.type,
        registeredBy: form.registeredBy,
        description: form.description,
        isWorking: form.isWorking,
        photoUrl: photoPreview || null,
        entryTransactionId:
          form.type === "Salida" ? Number(form.entryTransactionId) : null,
      };

      const res = await fetch(`${API_BASE}/api/transactions`, {
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
      <h2>📝 Registrar Ingreso/Salida</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Tipo */}
        <div className="form-group">
          <label>Tipo</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value, entryTransactionId: "" })
            }
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Salida">Salida</option>
          </select>
        </div>

        {/* Equipos */}
        <div className="form-group">
          <label>Seleccionar Equipo</label>
          <select
            value={form.equipmentId}
            onChange={(e) => handleEquipmentChange(e.target.value)}
            required
          >
            <option value="">-- Seleccionar --</option>
            {equipments.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.type} {eq.brand || ""} {eq.model || ""}{" "}
                {eq.serial ? `(${eq.serial})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Si es egreso */}
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

        {/* Registrado por */}
        <div className="form-group">
          <label>Registrado por</label>
          <input
            value={form.registeredBy}
            onChange={(e) =>
              setForm({ ...form, registeredBy: e.target.value })
            }
            required
          />
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

        {/* Estado */}
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
