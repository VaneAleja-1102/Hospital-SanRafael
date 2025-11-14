import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "./config";

const TransactionsHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token no encontrado. Inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Acepta tanto arrays directos como objetos tipo {data: []}
      setTransactions(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (err) {
      console.error("❌ Error al cargar transacciones:", err);
      setError("Error al cargar el historial de movimientos");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const headers = [
      "Fecha",
      "Equipo",
      "Serial",
      "Tipo",
      "Movimiento",
      "Usuario",
      "Observaciones",
    ];

    const csvData = transactions.map((t) => [
      formatDate(t.transaction_date || t.created_at),
      t.equipment?.name || "N/A",
      t.equipment?.serial_number || "N/A",
      t.equipment?.type || "N/A",
      t.transaction_type?.toUpperCase() || "N/A",
      t.user?.username || "N/A",
      t.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historial_movimientos_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    link.click();
  };

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    title: {
      color: "#333",
      fontSize: "28px",
      margin: 0,
    },
    exportBtn: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    loading: {
      textAlign: "center",
      padding: "40px",
      fontSize: "18px",
      color: "#666",
    },
    error: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      borderLeft: "4px solid #dc2626",
    },
    noData: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "#f9fafb",
      borderRadius: "12px",
      border: "2px dashed #d1d5db",
    },
    noDataText: {
      fontSize: "20px",
      color: "#6b7280",
      margin: "10px 0",
    },
    noDataSubtitle: {
      fontSize: "14px",
      color: "#9ca3af",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      backgroundColor: "#f3f4f6",
    },
    th: {
      padding: "16px",
      textAlign: "left",
      fontWeight: 600,
      color: "#374151",
      borderBottom: "2px solid #e5e7eb",
      fontSize: "14px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    tr: {
      borderBottom: "1px solid #e5e7eb",
    },
    td: {
      padding: "16px",
      color: "#4b5563",
      fontSize: "14px",
    },
    badgeEntrada: {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "6px",
      fontWeight: 600,
      fontSize: "13px",
      backgroundColor: "#d1fae5",
      color: "#065f46",
    },
    badgeSalida: {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "6px",
      fontWeight: 600,
      fontSize: "13px",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Cargando historial...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Historial de Movimientos</h1>
        <button style={styles.exportBtn} onClick={exportToCSV}>
          📥 Exportar CSV
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {transactions.length === 0 ? (
        <div style={styles.noData}>
          <p style={styles.noDataText}>📭 No se encontraron registros</p>
          <p style={styles.noDataSubtitle}>
            Los movimientos aparecerán aquí cuando se registren entradas o
            salidas de equipos
          </p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Fecha y Hora</th>
                <th style={styles.th}>Equipo</th>
                <th style={styles.th}>Serial</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Movimiento</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={styles.tr}>
                  <td style={styles.td}>
                    {formatDate(t.transaction_date || t.created_at)}
                  </td>
                  <td style={styles.td}>{t.equipment?.name || "N/A"}</td>
                  <td style={styles.td}>{t.equipment?.serial_number || "N/A"}</td>
                  <td style={styles.td}>{t.equipment?.type || "N/A"}</td>
                  <td style={styles.td}>
                    <span
                      style={
                        t.transaction_type?.toLowerCase() === "entrada"
                          ? styles.badgeEntrada
                          : styles.badgeSalida
                      }
                    >
                      {t.transaction_type?.toLowerCase() === "entrada"
                        ? "📥 INGRESA"
                        : "📤 SALE"}
                    </span>
                  </td>
                  <td style={styles.td}>{t.user?.username || "N/A"}</td>
                  <td style={styles.td}>{t.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsHistory;
