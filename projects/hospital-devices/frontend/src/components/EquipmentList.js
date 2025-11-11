// frontend/src/pages/EquipmentList.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { Link } from "react-router-dom";

export default function EquipmentList() {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");  // ✅ AGREGADO token
    
    fetch(`${API_BASE}/api/equipments`, {  // ✅ AGREGADO /api
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // ✅ AGREGADO Authorization
      }
    })
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.equipments || data.data || []);
        setEquipments(arr);
      })
      .catch(err => {
        console.error(err);
        setError("Error al cargar los equipos");
      });
  }, []);

  return (
    <div>
      <h2>Equipos Registrados</h2>

      <Link to="/create">Registrar equipo</Link> |{" "}
      <Link to="/transaction">Registrar ingreso/salida</Link>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <table border="1" cellPadding="6" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Id</th><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Serial</th><th>Propietario</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.type}</td>
              <td>{e.brand || "-"}</td>
              <td>{e.model || "-"}</td>
              <td>{e.serial || "-"}</td>
              <td>{e.ownerName || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}