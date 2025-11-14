// frontend/src/pages/RegisterTransaction.js
import React, { useState } from "react";
import EquipmentSelector from "../components/EquipmentSelector";
import { API_BASE } from "../config";

export default function RegisterTransaction() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [type, setType] = useState("entrada");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEquipment) {
      return setMessage("⚠️ Selecciona un equipo primero");
    }

    const token = localStorage.getItem("token");
    const body = {
      equipmentId: selectedEquipment.id,
      type,
      notes,
    };

    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Transacción registrada correctamente");
      setNotes("");
      setSelectedEquipment(null);
    } else {
      setMessage(data.error || "❌ Error al registrar la transacción");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        textAlign: "center",
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>📦 Registrar Ingreso / Salida</h2>

      <EquipmentSelector onSelect={setSelectedEquipment} />

      {selectedEquipment && (
        <div style={{ marginTop: "1rem", color: "#1976d2" }}>
          <strong>Equipo seleccionado:</strong> {selectedEquipment.type} (
          {selectedEquipment.serial})
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <label>
          Tipo de transacción:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </label>

        <div style={{ marginTop: "1rem" }}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionales..."
            style={{
              width: "100%",
              height: "80px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "none",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Registrar
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", color: "#333" }}>{message}</p>
      )}
    </div>
  );
}
