import React, { useState } from "react";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function EquipmentForm() {
  const [form, setForm] = useState({ 
    type: "", 
    brand: "", 
    model: "", 
    serial: "", 
    ownerName: "", 
    notes: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE}/api/equipments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        alert("✅ Equipo registrado exitosamente");
        navigate("/");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "No se pudo registrar el equipo");
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
      <h2>➕ Registrar Nuevo Equipo</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Tipo de Equipo *</label>
          <input 
            id="type"
            type="text"
            required 
            value={form.type} 
            onChange={e => setForm({...form, type: e.target.value})}
            placeholder="Ej: Monitor, Ventilador, Desfibrilador"
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand">Marca</label>
          <input 
            id="brand"
            type="text"
            value={form.brand} 
            onChange={e => setForm({...form, brand: e.target.value})}
            placeholder="Ej: Philips, GE Healthcare"
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Modelo</label>
          <input 
            id="model"
            type="text"
            value={form.model} 
            onChange={e => setForm({...form, model: e.target.value})}
            placeholder="Ej: MP5, Dash 4000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="serial">Número de Serie</label>
          <input 
            id="serial"
            type="text"
            value={form.serial} 
            onChange={e => setForm({...form, serial: e.target.value})}
            placeholder="Ej: SN123456789"
          />
        </div>

        <div className="form-group">
          <label htmlFor="owner">Propietario</label>
          <input 
            id="owner"
            type="text"
            value={form.ownerName} 
            onChange={e => setForm({...form, ownerName: e.target.value})}
            placeholder="Ej: Hospital Universitario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notas Adicionales</label>
          <textarea 
            id="notes"
            value={form.notes} 
            onChange={e => setForm({...form, notes: e.target.value})}
            placeholder="Información adicional sobre el equipo..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Guardando...' : '💾 Guardar Equipo'}
        </button>
      </form>
    </div>
  );
}