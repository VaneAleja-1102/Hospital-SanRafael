// frontend/src/pages/Home.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { Link } from "react-router-dom";

export default function Home() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/api/equipments`, {  // ✅ AGREGADO /api
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.equipments || data.data || []);
        setEquipments(arr);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error al cargar los equipos");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">⏳ Cargando equipos...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="quick-actions">
        
      </div>

      {equipments.length === 0 ? (
        <div className="empty-state">
          <h3>📦 No hay equipos registrados</h3>
        </div>
      ) : (
        <>
          <h2>📋 Lista de Equipos ({equipments.length})</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Serial</th><th>Propietario</th><th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {equipments.map(e => (
                  <tr key={e.id}>
                    <td>#{e.id}</td>
                    <td>{e.type}</td>
                    <td>{e.brand || "-"}</td>
                    <td>{e.model || "-"}</td>
                    <td>{e.serial || "-"}</td>
                    <td>{e.ownerName || "-"}</td>
                    <td>{e.notes ? (e.notes.length > 50 ? e.notes.substring(0, 50) + "..." : e.notes) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}