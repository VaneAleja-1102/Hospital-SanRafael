import React, { useState } from "react";
import EquipmentList from "../components/EquipmentList";
import { Link } from "react-router-dom";

export default function Home() {
  const [refresh] = useState(false); // 🔧 eliminado setRefresh

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "2rem auto",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <h1 style={{ marginBottom: "1rem", color: "#222" }}>🧰 Gestión de Equipos</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Link to="/create" style={linkBtn}>➕ Registrar Equipo</Link>
        <Link to="/transaction" style={linkBtn}>📦 Registrar Ingreso/Egreso</Link>
        <Link to="/transactions-history" style={linkBtn}>📊 Ver Movimientos</Link>
      </div>

      <EquipmentList refreshTrigger={refresh} />
    </div>
  );
}

const linkBtn = {
  backgroundColor: "#1976d2",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
  transition: "all 0.3s ease",
};
