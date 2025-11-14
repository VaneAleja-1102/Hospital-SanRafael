import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { Link } from "react-router-dom";

export default function EquipmentList({ refreshTrigger }) {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/equipments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
        console.error(err);
        setError("❌ Error al cargar los equipos");
        setLoading(false);
      });
  }, [refreshTrigger]);

  if (loading) return <div className="loading">⏳ Cargando equipos...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ marginBottom: "1rem", color: "#222" }}>
        📋 Equipos Registrados ({equipments.length})
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <Link
          to="/create"
          style={{
            textDecoration: "none",
            background: "#1976d2",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            marginRight: "0.5rem",
          }}
        >
          ➕ Registrar equipo
        </Link>
        <Link
          to="/transaction"
          style={{
            textDecoration: "none",
            background: "#4caf50",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
          }}
        >
          🔄 Registrar ingreso/salida
        </Link>
      </div>

      <div className="table-container" style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#1976d2", color: "#fff" }}>
            <tr>
              <th style={th}>Foto</th>
              <th style={th}>ID</th>
              <th style={th}>Tipo</th>
              <th style={th}>Marca</th>
              <th style={th}>Modelo</th>
              <th style={th}>Serial</th>
              <th style={th}>Propietario</th>
              <th style={th}>Notas</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((e) => {
              // 🔥 AQUI IMPRIMIMOS LA URL REAL DE LA IMAGEN
              console.log("IMAGE URL DEL EQUIPO:", e.imageUrl);

              return (
                <tr key={e.id}>
                  <td style={td}>
                    {e.imageUrl ? (
                      <img
                        src={
    equipments.imageUrl?.startsWith("http")
      ? equipments.imageUrl
      : `${API_BASE.replace("/api", "")}${equipments.imageUrl}`
  }
                        alt="Equipo"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#aaa" }}>Sin imagen</span>
                    )}
                  </td>
                  <td style={td}>#{e.id}</td>
                  <td style={td}>{e.type}</td>
                  <td style={td}>{e.brand || "-"}</td>
                  <td style={td}>{e.model || "-"}</td>
                  <td style={td}>{e.serial || "-"}</td>
                  <td style={td}>{e.ownerName || "-"}</td>
                  <td style={td}>
                    {e.notes
                      ? e.notes.length > 50
                        ? e.notes.substring(0, 50) + "..."
                        : e.notes
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  fontWeight: "600",
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #eee",
};
