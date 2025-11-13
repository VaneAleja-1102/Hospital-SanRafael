// frontend/src/components/EquipmentSelector.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function EquipmentSelector({ onSelect }) {
  const [equipments, setEquipments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/equipments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data)
          ? data
          : data.equipments || data.data || [];
        setEquipments(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching equipments:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>⏳ Cargando equipos...</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Selecciona un equipo:</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        {equipments.map((eq) => (
          <div
            key={eq.id}
            onClick={() => {
              setSelectedId(eq.id);
              onSelect(eq);
            }}
            style={{
              cursor: "pointer",
              width: "140px",
              padding: "10px",
              border: eq.id === selectedId ? "3px solid #1976d2" : "2px solid #ccc",
              borderRadius: "10px",
              backgroundColor: "#fff",
              boxShadow:
                eq.id === selectedId
                  ? "0 0 10px rgba(25,118,210,0.5)"
                  : "0 2px 5px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
            }}
          >
            <img
              src={
                eq.imageUrl
                  ? `http://localhost:4000${eq.imageUrl}`
                  : "/default-image.png"
              }
              alt={eq.type}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <div style={{ marginTop: "0.5rem", fontSize: "14px" }}>
              <b>{eq.type}</b>
              <p style={{ margin: 0, color: "#555", fontSize: "12px" }}>
                {eq.serial || "Sin serial"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
