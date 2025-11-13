import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function EquipmentForm({ onEquipmentCreated }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    brand: "",
    model: "",
    serial: "",
    ownerName: "",
    notes: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("❌ No se encontró token de autenticación");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append("image", image);

      const res = await fetch(`${API_BASE_URL}/equipments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Equipo registrado exitosamente");
        setForm({
          type: "",
          brand: "",
          model: "",
          serial: "",
          ownerName: "",
          notes: "",
        });
        setImage(null);
        setPreview(null);
        if (onEquipmentCreated) onEquipmentCreated();
        navigate("/equipments");
      } else {
        setError(data.error || "❌ No se pudo registrar el equipo");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "550px",
        margin: "2rem auto",
        background: "#ffffff",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        ➕ Registrar Nuevo Equipo
      </h2>

      {error && (
        <div style={{ background: "#ffd7d7", padding: "1rem", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input name="type" type="text" placeholder="Tipo de Equipo *" required value={form.type} onChange={handleChange} />
        <input name="brand" type="text" placeholder="Marca" value={form.brand} onChange={handleChange} />
        <input name="model" type="text" placeholder="Modelo" value={form.model} onChange={handleChange} />
        <input name="serial" type="text" placeholder="Número de Serie" value={form.serial} onChange={handleChange} />
        <input name="ownerName" type="text" placeholder="Propietario" value={form.ownerName} onChange={handleChange} />
        <textarea name="notes" placeholder="Notas Adicionales" value={form.notes} onChange={handleChange}></textarea>

        <div style={{ textAlign: "center" }}>
          <label>📸 Imagen del equipo:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Vista previa"
              style={{
                marginTop: "1rem",
                width: "120px",
                height: "120px",
                borderRadius: "12px",
                objectFit: "cover",
                border: "2px solid #ccc",
              }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "⏳ Guardando..." : "💾 Guardar Equipo"}
        </button>
      </form>
    </div>
  );
}
